import { Injectable, InternalServerErrorException } from "@nestjs/common";

interface EvaluationAssessment {
  summary: string;
  strengths: string;
  improvementAreas: string;
}

interface SkillGap {
  skillName: string;
  currentLevel: number;
  expectedLevel: number;
}

interface TrainingSuggestion {
  title: string;
  reason: string;
}

interface SmartObjectiveContext {
  positionTitle: string;
  currentSkills: { name: string; level: number }[];
  recentEvaluations: { score?: number; managerComment?: string; aiSummary?: string }[];
}

interface SmartObjectiveSuggestion {
  title: string;
  description: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound?: string;
}

interface CareerContext {
  currentPositionTitle: string;
  availablePositions: string[];
  currentSkills: { name: string; level: number }[];
  recentEvaluations: { score?: number; managerComment?: string; aiSummary?: string; aiStrengths?: string; aiImprovementAreas?: string }[];
}

interface CareerSuggestion {
  suggestedRole: string;
  progressionPlan: string;
}

interface ChatHistoryItem {
  sender: "USER" | "BOT";
  content: string;
}

@Injectable()
export class AiService {
  private readonly apiKey = process.env.GROQ_API_KEY;
  private readonly model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

  async generateEvaluationAssessment(managerComment: string): Promise<EvaluationAssessment> {
    const prompt = `Tu es un assistant RH. A partir du commentaire suivant redige par un manager sur un employe, genere une evaluation professionnelle structuree.

Commentaire du manager :
"""
${managerComment}
"""

Reponds UNIQUEMENT au format JSON strict suivant, sans texte autour, sans markdown :
{
  "summary": "un resume professionnel de l evaluation en 2-3 phrases",
  "strengths": "les points forts identifies, sous forme de liste a puces texte",
  "improvementAreas": "les axes d amelioration identifies, sous forme de liste a puces texte"
}`;

    const parsed = await this.callGroqJson(prompt);
    return {
      summary: parsed.summary ?? "",
      strengths: parsed.strengths ?? "",
      improvementAreas: parsed.improvementAreas ?? "",
    };
  }

  // 4.4 - Analyse des competences : propose des formations a partir des ecarts detectes
  async generateTrainingSuggestions(gaps: SkillGap[]): Promise<TrainingSuggestion[]> {
    const gapsText = gaps
      .map((g) => `- ${g.skillName} : niveau actuel ${g.currentLevel}/5, niveau attendu ${g.expectedLevel}/5`)
      .join("\n");

    const prompt = `Tu es un assistant RH specialise en formation professionnelle. Voici les ecarts de competences detectes pour un employe par rapport a son poste :

${gapsText}

Propose des formations concretes pour combler ces ecarts. Tu peux regrouper plusieurs competences proches dans une meme formation si c est pertinent. Propose entre 1 et 4 formations au total.

Reponds UNIQUEMENT au format JSON strict suivant, sans texte autour, sans markdown :
{
  "trainings": [
    { "title": "titre court de la formation", "reason": "pourquoi cette formation est recommandee, en lien avec l ecart identifie" }
  ]
}`;

    const parsed = await this.callGroqJson(prompt);
    const trainings = Array.isArray(parsed.trainings) ? parsed.trainings : [];
    return trainings.map((t: any) => ({
      title: t.title ?? "Formation recommandee",
      reason: t.reason ?? "",
    }));
  }

  // 4.5 - Genere des objectifs SMART a partir du poste, des competences et des evaluations passees
  async generateSmartObjectives(context: SmartObjectiveContext): Promise<SmartObjectiveSuggestion[]> {
    const skillsText = context.currentSkills.length
      ? context.currentSkills.map((s) => `- ${s.name} (niveau ${s.level}/5)`).join("\n")
      : "Aucune competence renseignee.";

    const evaluationsText = context.recentEvaluations.length
      ? context.recentEvaluations
          .map(
            (ev, i) =>
              `Evaluation ${i + 1} : note ${ev.score ?? "N/A"}/20. Commentaire manager : ${ev.managerComment ?? "aucun"}.${
                ev.aiSummary ? ` Resume IA : ${ev.aiSummary}` : ""
              }`,
          )
          .join("\n")
      : "Aucune evaluation precedente disponible.";

    const prompt = `Tu es un assistant RH specialise en gestion de la performance. Genere des objectifs SMART (Specifique, Mesurable, Atteignable, Realiste, Temporellement defini) pour un employe, en te basant sur les informations suivantes :

Poste occupe : ${context.positionTitle}

Competences actuelles :
${skillsText}

Evaluations precedentes :
${evaluationsText}

Propose entre 2 et 3 objectifs SMART pertinents et realistes, adaptes au poste et aux competences de cette personne. Pour chaque objectif, precise une echeance realiste (entre 1 et 6 mois a partir d aujourd hui, date du jour : ${new Date().toISOString().slice(0, 10)}).

Reponds UNIQUEMENT au format JSON strict suivant, sans texte autour, sans markdown :
{
  "objectives": [
    {
      "title": "titre court de l objectif",
      "description": "description generale de l objectif en 1-2 phrases",
      "specific": "ce qui rend l objectif specifique",
      "measurable": "comment mesurer l atteinte de l objectif",
      "achievable": "pourquoi cet objectif est atteignable pour cette personne",
      "relevant": "en quoi cet objectif est pertinent pour le poste ou l evolution de carriere",
      "timeBound": "date d echeance au format AAAA-MM-JJ"
    }
  ]
}`;

    const parsed = await this.callGroqJson(prompt);
    const objectives = Array.isArray(parsed.objectives) ? parsed.objectives : [];
    return objectives.map((o: any) => ({
      title: o.title ?? "Objectif",
      description: o.description ?? "",
      specific: o.specific ?? "",
      measurable: o.measurable ?? "",
      achievable: o.achievable ?? "",
      relevant: o.relevant ?? "",
      timeBound: o.timeBound ?? undefined,
    }));
  }

  // 4.6 - Propose une evolution de poste + plan de progression a partir des evaluations
  async generateCareerRecommendations(context: CareerContext): Promise<CareerSuggestion[]> {
    const skillsText = context.currentSkills.length
      ? context.currentSkills.map((s) => `- ${s.name} (niveau ${s.level}/5)`).join("\n")
      : "Aucune competence renseignee.";

    const evaluationsText = context.recentEvaluations.length
      ? context.recentEvaluations
          .map((ev, i) => {
            const parts = [`Evaluation ${i + 1} : note ${ev.score ?? "N/A"}/20.`];
            if (ev.managerComment) parts.push(`Commentaire manager : ${ev.managerComment}.`);
            if (ev.aiStrengths) parts.push(`Points forts : ${ev.aiStrengths}.`);
            if (ev.aiImprovementAreas) parts.push(`Axes d amelioration : ${ev.aiImprovementAreas}.`);
            return parts.join(" ");
          })
          .join("\n")
      : "Aucune evaluation precedente disponible.";

    const positionsText = context.availablePositions.length
      ? context.availablePositions.join(", ")
      : "Aucun autre poste disponible dans l organisation pour le moment.";

    const prompt = `Tu es un assistant RH specialise en gestion de carriere. Voici le profil d un employe :

Poste actuel : ${context.currentPositionTitle}

Competences actuelles :
${skillsText}

Historique d evaluations :
${evaluationsText}

Postes disponibles dans l entreprise (tu peux en proposer un, ou proposer un intitule de poste different s il n y en a pas d adapte) :
${positionsText}

Propose 1 a 2 recommandations d evolution de carriere realistes pour cette personne. Pour chaque recommandation, indique le poste vise et un plan de progression concret (etapes, formations necessaires, delai indicatif).

Reponds UNIQUEMENT au format JSON strict suivant, sans texte autour, sans markdown :
{
  "recommendations": [
    {
      "suggestedRole": "intitule du poste vise",
      "progressionPlan": "plan de progression detaille : etapes, formations recommandees, delai indicatif"
    }
  ]
}`;

    const parsed = await this.callGroqJson(prompt);
    const recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    return recommendations.map((r: any) => ({
      suggestedRole: r.suggestedRole ?? "Evolution a definir",
      progressionPlan: r.progressionPlan ?? "",
    }));
  }

  // 4.7 - Chatbot RH : repond en texte libre en se basant sur le contexte complet de l employe
  async generateChatReply(employeeContext: string, history: ChatHistoryItem[], userMessage: string): Promise<string> {
    const messages = [
      {
        role: "system",
        content: `Tu es l assistant RH virtuel intelligent de l entreprise. Tu reponds aux questions d un employe ou manager UNIQUEMENT a partir des informations ci-dessous concernant son profil.

DIRECTIVES RIGOUREUSES DE STRUCTURE ET DE FORMATAGE :
1. Organise TOUJOURS tes reponses avec des titres clairs en gras precedes d emojis (ex: 📌 **Synthese**, 💡 **Competences**, 🎯 **Objectifs SMART**, 📚 **Formations Recommandees**, 📈 **Plan de Carriere**).
2. Utilise des listes a puces (- ) ou numerotees (1. ) pour enumerer les points, competences, formations ou etapes. Ne fais JAMAIS de gros pates de texte indigeste.
3. Mets en valeur les mots-cles importants, notes (/20), intitulés de poste et formations en **gras**.
4. Si une information demandee n est pas presente dans le contexte ci-dessous, dis-le honnetement et courtoisement.
5. Garde un ton chaleureux, clair, tres professionnel et parfaitement structure.

CONTEXTE COMPLET DE L EMPLOYE :
${employeeContext}`,
      },
      ...history.map((m) => ({
        role: m.sender === "USER" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: userMessage },
    ];

    return this.callGroqChat(messages);
  }

  // Helper partage : appelle Groq et parse la reponse comme du JSON (pour les fonctionnalites structurees)
  private async callGroqJson(prompt: string): Promise<any> {
    const content = await this.callGroqChat([{ role: "user", content: prompt }], true);
    try {
      return JSON.parse(content);
    } catch {
      throw new InternalServerErrorException("Impossible de parser la reponse JSON de Groq");
    }
  }

  // Helper bas niveau : appelle Groq (compatible API OpenAI) et retourne le texte brut
  private async callGroqChat(messages: { role: string; content: string }[], jsonMode = false): Promise<string> {
    if (!this.apiKey) {
      throw new InternalServerErrorException("GROQ_API_KEY manquante dans les variables d environnement");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: jsonMode ? 0.4 : 0.5,
        ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new InternalServerErrorException(`Erreur API Groq: ${errorBody}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new InternalServerErrorException("Reponse Groq vide ou invalide");
    }
    return content;
  }
}