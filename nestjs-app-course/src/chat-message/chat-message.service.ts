import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatMessage, MessageSender } from "./entities/chat-message.entity";
import { ChatConversation } from "../chat-conversation/entities/chat-conversation.entity";
import { EmployeeService } from "../employee/employee.service";
import { ObjectiveService } from "../objective/objective.service";
import { EvaluationService } from "../evaluation/evaluation.service";
import { TrainingRecommendationService } from "../training-recommandation/training-recommendation.service";
import { CareerRecommendationService } from "../career-recommandation/career-recommendation.service";
import { AiService } from "../ai/ai.service";

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(ChatConversation)
    private readonly conversationRepository: Repository<ChatConversation>,
    private readonly employeeService: EmployeeService,
    private readonly objectiveService: ObjectiveService,
    private readonly evaluationService: EvaluationService,
    private readonly trainingRecommendationService: TrainingRecommendationService,
    private readonly careerRecommendationService: CareerRecommendationService,
    private readonly aiService: AiService,
  ) {}

  public async addMessage(conversationId: String, content: String) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId as any },
      relations: ["employee"],
    });
    if (!conversation) {
      throw new NotFoundException("conversation non trouvee");
    }

    const userMessage = this.chatMessageRepository.create({
      chatConversation: conversation,
      sender: MessageSender.USER,
      content,
    });
    await this.chatMessageRepository.save(userMessage);

    const employeeId = conversation.employee.id as any;
    const employee: any = await this.employeeService.getOneBy(employeeId);

    const [objectives, allEvaluations, allTrainingRecs, careerRecs] = await Promise.all([
      this.objectiveService.getByEmployee(employeeId),
      this.evaluationService.getAll(),
      this.trainingRecommendationService.getAll(),
      this.careerRecommendationService.getByEmployee(employeeId),
    ]);

    const evaluations = (allEvaluations as any[])
      .filter((ev) => ev.employee?.id === employeeId)
      .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
      .slice(0, 3);

    const trainingRecs = (allTrainingRecs as any[]).filter((t) => t.employee?.id === employeeId);

    const employeeContext = this.buildEmployeeContext(employee, objectives as any[], evaluations, trainingRecs, careerRecs as any[]);

    const history = await this.chatMessageRepository.find({
      where: { chatConversation: { id: conversationId as any } as any },
      order: { CreatedAt: "ASC" },
    });

    const botReplyContent = await this.aiService.generateChatReply(
      employeeContext,
      history.map((m) => ({ sender: m.sender as any, content: m.content as any })),
      content as any,
    );

    const botMessage = this.chatMessageRepository.create({
      chatConversation: { id: conversationId } as any,
      sender: MessageSender.BOT,
      content: botReplyContent as any,
    });
    await this.chatMessageRepository.save(botMessage);

    return { userMessage, botMessage };
  }

  public getByConversation(conversationId: String) {
    return this.chatMessageRepository.find({
      where: { chatConversation: { id: conversationId as any } as any },
      order: { CreatedAt: "ASC" },
    });
  }

  private buildEmployeeContext(employee: any, objectives: any[], evaluations: any[], trainingRecs: any[], careerRecs: any[]): string {
    const skillsText =
      (employee.skills || []).map((es: any) => `${es.skill?.name} (niveau ${es.level}/5)`).join(", ") || "Aucune";

    const objectivesText = objectives.length
      ? objectives
          .map((o) => `- ${o.title} (progression ${o.progress}%)${o.description ? ` : ${o.description}` : ""}`)
          .join("\n")
      : "Aucun objectif enregistre.";

    const evaluationsText = evaluations.length
      ? evaluations
          .map((ev, i) => {
            const parts = [`Evaluation ${i + 1} (${ev.type}) : note ${ev.score ?? "N/A"}/20.`];
            if (ev.aiSummary) parts.push(`Resume : ${ev.aiSummary}`);
            if (ev.aiStrengths) parts.push(`Points forts : ${ev.aiStrengths}`);
            if (ev.aiImprovementAreas) parts.push(`Axes d amelioration : ${ev.aiImprovementAreas}`);
            return parts.join(" ");
          })
          .join("\n")
      : "Aucune evaluation enregistree.";

    const trainingText = trainingRecs.length
      ? trainingRecs.map((t) => `- ${t.title} : ${t.reason}`).join("\n")
      : "Aucune formation recommandee pour l instant.";

    const careerText = careerRecs.length
      ? careerRecs.map((c) => `- Poste vise : ${c.suggestedRole}. Plan : ${c.progressionPlan}`).join("\n")
      : "Aucune recommandation de carriere pour l instant.";

    return `Nom : ${employee.firstName} ${employee.lastName}
Poste actuel : ${employee.position?.title ?? "Non renseigne"}

Competences actuelles : ${skillsText}

Objectifs :
${objectivesText}

Evaluations recentes :
${evaluationsText}

Formations recommandees :
${trainingText}

Recommandations de carriere :
${careerText}`;
  }
}