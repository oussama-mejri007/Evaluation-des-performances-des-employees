import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateCareerRecommendationDto } from "./dto/create-career-recommendation.dto";
import { UpdateCareerRecommendationDto } from "./dto/update-career-recommendation.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CareerRecommendation } from "./entities/career-recommendation.entity";
import { Repository } from "typeorm";
import { EmployeeService } from "../employee/employee.service";
import { EvaluationService } from "../evaluation/evaluation.service";
import { PositionService } from "../position/position.service";
import { AiService } from "../ai/ai.service";

interface CreateCareerRecommendationInput {
  employeeId: String;
  suggestedRole: String;
  progressionPlan: String;
}
interface UpdateCareerRecommendationInput {
  employeeId?: String;
  suggestedRole?: String;
  progressionPlan?: String;
}

@Injectable()
export class CareerRecommendationService {
  constructor(
    @InjectRepository(CareerRecommendation)
    private readonly CareerRecommendationRepository: Repository<CareerRecommendation>,
    private readonly employeeService: EmployeeService,
    private readonly evaluationService: EvaluationService,
    private readonly positionService: PositionService,
    private readonly aiService: AiService,
  ) {}

  public create(dto: CreateCareerRecommendationInput) {
    const careerRecommendation = this.CareerRecommendationRepository.create({
      employee: { id: dto.employeeId } as any,
      suggestedRole: dto.suggestedRole,
      progressionPlan: dto.progressionPlan,
    });
    return this.CareerRecommendationRepository.save(careerRecommendation);
  }

  public getByEmployee(employeeId: String) {
    // Correction : le filtre precedent ({ employee: { employeeId } }) etait incorrect,
    // TypeORM attend la cle primaire de la relation via "id".
    return this.CareerRecommendationRepository.find({
      where: { employee: { id: employeeId } as any },
      relations: ["employee"],
    });
  }

  public async getOneBy(id: String) {
    const careerRecommendation = await this.CareerRecommendationRepository.findOne({ where: { id }, relations: ["employee"] });
    if (!careerRecommendation) {
      throw new NotFoundException("career recommendation non trouve");
    }
    return careerRecommendation;
  }

  public async update(id: String, dto: UpdateCareerRecommendationInput) {
    const careerRecommendation = await this.getOneBy(id);
    careerRecommendation.suggestedRole = dto.suggestedRole ?? careerRecommendation.suggestedRole;
    careerRecommendation.progressionPlan = dto.progressionPlan ?? careerRecommendation.progressionPlan;
    return this.CareerRecommendationRepository.save(careerRecommendation);
  }

  public async delete(id: String) {
    const careerRecommendation = await this.getOneBy(id);
    await this.CareerRecommendationRepository.remove(careerRecommendation);
    return { message: "career recommendation supprime avec succes " };
  }

  // 4.6 - Genere des recommandations de carriere a partir des evaluations de l employe
  public async generateForEmployee(employeeId: string) {
    const employee = await this.employeeService.getOneBy(employeeId as any);
    if (!employee.position) {
      throw new BadRequestException("Cet employe n a pas de poste assigne");
    }

    const [allEvaluations, allPositions] = await Promise.all([
      this.evaluationService.getAll(),
      this.positionService.getAll(),
    ]);

    const employeeEvaluations = (allEvaluations as any[])
      .filter((ev) => ev.employee?.id === employeeId)
      .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
      .slice(0, 5);

    const currentSkills = ((employee as any).skills || []).map((es: any) => ({
      name: es.skill?.name,
      level: es.level,
    }));

    const availablePositions = (allPositions as any[])
      .map((p) => p.title)
      .filter((title) => title !== (employee as any).position.title);

    const context = {
      currentPositionTitle: (employee as any).position.title,
      availablePositions,
      currentSkills,
      recentEvaluations: employeeEvaluations.map((ev) => ({
        score: ev.score,
        managerComment: ev.managerComment,
        aiSummary: ev.aiSummary,
        aiStrengths: ev.aiStrengths,
        aiImprovementAreas: ev.aiImprovementAreas,
      })),
    };

    const suggestions = await this.aiService.generateCareerRecommendations(context);

    const created: CareerRecommendation[] = [];
    for (const suggestion of suggestions) {
      const rec = await this.create({
        employeeId: employeeId as any,
        suggestedRole: suggestion.suggestedRole as any,
        progressionPlan: suggestion.progressionPlan as any,
      });
      created.push(rec);
    }

    return { context, created };
  }
}