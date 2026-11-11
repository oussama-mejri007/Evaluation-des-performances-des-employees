import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateTrainingRecommendationDto } from "./dto/create-training-recommendation.dto";
import { UpdateTrainingRecommendationDto } from "./dto/update-training-recommendation.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { TrainingRecommendation } from "./entities/training-recommendation.entity";
import { Repository } from "typeorm";
import { EmployeeService } from "../employee/employee.service";
import { EmployeeSkillService } from "../employee-skill/employee-skill.service";
import { PositionSkillService } from "../position-skill/position-skill.service";
import { AiService } from "../ai/ai.service";

@Injectable()
export class TrainingRecommendationService {
  constructor(
    @InjectRepository(TrainingRecommendation)
    private readonly trainingRecommendationRepository: Repository<TrainingRecommendation>,
    private readonly employeeService: EmployeeService,
    private readonly employeeSkillService: EmployeeSkillService,
    private readonly positionSkillService: PositionSkillService,
    private readonly aiService: AiService,
  ) {}

  public create(dto: CreateTrainingRecommendationDto) {
  const trainingRecommendation = this.trainingRecommendationRepository.create({
    title: dto.title,
    reason: dto.reason,
    employee: { id: (dto as any).employeeId } as any,
  });
  return this.trainingRecommendationRepository.save(trainingRecommendation);
  }

  public getAll() {
  return this.trainingRecommendationRepository.find({ relations: ["employee"] });
  }

  public async getOneBy(id: string) {
    const trainingRecommendation = await this.trainingRecommendationRepository.findOne({ where: { id } });
    if (!trainingRecommendation) {
      throw new NotFoundException("Training recommendation not found");
    }
    return trainingRecommendation;
  }

  public async update(id: string, dto: UpdateTrainingRecommendationDto) {
    const trainingRecommendation = await this.getOneBy(id);
    trainingRecommendation.title = dto.title ?? trainingRecommendation.title;
    trainingRecommendation.reason = dto.reason ?? trainingRecommendation.reason;
    return this.trainingRecommendationRepository.save(trainingRecommendation);
  }

  public async delete(id: string) {
    const trainingRecommendation = await this.getOneBy(id);
    await this.trainingRecommendationRepository.remove(trainingRecommendation);
    return { message: "Training recommandation deleted successfully" };
  }

  // 4.4 - Analyse des competences actuelles vs attendues + generation de formations via IA
  public async generateForEmployee(employeeId: string) {
    const employee = await this.employeeService.getOneBy(employeeId as any);
    if (!employee.position) {
      throw new BadRequestException("Cet employe n a pas de poste assigne, impossible de comparer les competences");
    }

    const currentSkills = await this.employeeSkillService.getOneByEmployee(employeeId as any);
    const expectedSkills = await this.positionSkillService.getOneByPosition(employee.position.id as any);

    const currentLevelBySkill = new Map<string, number>();
    currentSkills.forEach((es: any) => currentLevelBySkill.set(es.skill.name, es.level));

    const gaps = expectedSkills
      .map((ps: any) => ({
        skillName: ps.skill.name,
        currentLevel: currentLevelBySkill.get(ps.skill.name) ?? 0,
        expectedLevel: ps.levelRequired,
      }))
      .filter((gap: any) => gap.currentLevel < gap.expectedLevel);

    if (gaps.length === 0) {
      return {
        message: "Aucun ecart de competence detecte, aucune formation necessaire pour l instant.",
        gaps: [],
        created: [],
      };
    }

    const suggestions = await this.aiService.generateTrainingSuggestions(gaps);

    const created: TrainingRecommendation[] = [];
    for (const suggestion of suggestions) {
      const rec = await this.create({
        employeeId,
        title: suggestion.title,
        reason: suggestion.reason,
      } as any);
      created.push(rec);
    }

    return { gaps, created };
  }
}