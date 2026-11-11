import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Evaluation, EvaluationType } from "./entities/evaluation.entity";
import { AiService } from "../ai/ai.service";

interface CreateEvaluationInput {
  campaignId: String;
  employeeId: String;
  managerId?: String;
  type: EvaluationType;
  score?: Number;
  managerComment?: String;
}
interface UpdateEvaluationInput {
  type?: EvaluationType;
  score?: Number;
  managerComment?: String;
  aiSummary?: String;
  aiStrengths?: String;
  aiImprovementAreas?: String;
}

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    private readonly aiService: AiService,
  ) {}

  public create(dto: CreateEvaluationInput) {
    const evaluation = this.evaluationRepository.create({
      campaign: { id: dto.campaignId } as any,
      employee: { id: dto.employeeId } as any,
      manager: dto.managerId ? ({ id: dto.managerId } as any) : undefined,
      type: dto.type,
      score: dto.score,
      managerComment: dto.managerComment,
    });
    return this.evaluationRepository.save(evaluation);
  }

  public getAll() {
    return this.evaluationRepository.find({ relations: ["campaign", "employee", "manager"] });
  }

  public async getOneBy(id: String) {
    const evaluation = await this.evaluationRepository.findOne({ where: { id }, relations: ["campaign", "manager", "employee"] });
    if (!evaluation) { throw new NotFoundException(" evaluation non trouve"); }
    return evaluation;
  }

  public async update(id: String, dto: UpdateEvaluationInput) {
    const evaluation = await this.getOneBy(id);
    evaluation.score = dto.score ?? evaluation.score;
    evaluation.type = dto.type ?? evaluation.type;
    evaluation.managerComment = dto.managerComment ?? evaluation.managerComment;
    return this.evaluationRepository.save(evaluation);
  }

  public async updateFields(id: String, fields: { aiSummary?: String; aiStrengths?: String; aiImprovementAreas?: String }) {
    const evaluation = await this.getOneBy(id);
    Object.assign(evaluation, fields);
    return this.evaluationRepository.save(evaluation);
  }

  // 4.3 - Assistant devaluation IA : genere resume + points forts + axes damelioration
  public async generateAiAssessment(id: String) {
    const evaluation = await this.getOneBy(id);

    if (!evaluation.managerComment) {
      throw new BadRequestException("Un commentaire manager est requis avant de generer l evaluation IA");
    }

    const result = await this.aiService.generateEvaluationAssessment(evaluation.managerComment as unknown as string);

    return this.updateFields(id, {
      aiSummary: result.summary as any,
      aiStrengths: result.strengths as any,
      aiImprovementAreas: result.improvementAreas as any,
    });
  }

  public async delete(id: String) {
    const evaluation = await this.getOneBy(id);
    await this.evaluationRepository.remove(evaluation);
    return { message: " evaluation supprime" };
  }
}