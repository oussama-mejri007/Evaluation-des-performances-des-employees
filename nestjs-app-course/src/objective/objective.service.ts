import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateObjectiveDto } from "./dto/create-objective.dto";
import { UpdateObjectiveDto } from "./dto/update-objective.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Objective } from "./entities/objective.entity";
import { Repository } from "typeorm";
import { EmployeeService } from "../employee/employee.service";
import { EvaluationService } from "../evaluation/evaluation.service";
import { AiService } from "../ai/ai.service";

interface CreateObjectiveInput {
  employeeId: String;
  title: String;
  description: String;
  progress?: Number;
  generatedByAi?: Boolean;
  timeBound?: Date;
  specific?: String;
  measurable?: String;
  achievable?: String;
  relevant?: String;
}
interface UpdateObjectiveInput extends Partial<CreateObjectiveInput> {}

@Injectable()
export class ObjectiveService {
  constructor(
    @InjectRepository(Objective)
    private readonly objectiveRepository: Repository<Objective>,
    private readonly employeeService: EmployeeService,
    private readonly evaluationService: EvaluationService,
    private readonly aiService: AiService,
  ) {}

  public create(dto: CreateObjectiveInput) {
    const objective = this.objectiveRepository.create({
      employee: { id: dto.employeeId } as any,
      title: dto.title,
      description: dto.description,
      specific: dto.specific ? dto.specific : undefined,
      measurable: dto.measurable ? dto.measurable : undefined,
      achievable: dto.achievable ? dto.achievable : undefined,
      relevant: dto.relevant ? dto.relevant : undefined,
      timeBound: dto.timeBound ? dto.timeBound : undefined,
      progress: dto.progress,
      generatedByAi: dto.generatedByAi,
    });
    return this.objectiveRepository.save(objective);
  }

  public getByEmployee(employeeId: String) {
    return this.objectiveRepository.find({ where: { employee: { id: employeeId } as any } });
  }

  public async getOneBy(id: String) {
    const objective = await this.objectiveRepository.findOne({ where: { id }, relations: ["employee"] });
    if (!objective) {
      throw new NotFoundException(" objective non trouvee");
    }
    return objective;
  }

  public async update(id: String, dto: UpdateObjectiveInput) {
    const objective = await this.getOneBy(id);
    objective.title = dto.title ?? objective.title;
    objective.description = dto.description ?? objective.description;
    objective.specific = dto.specific ?? objective.specific;
    objective.measurable = dto.measurable ?? objective.measurable;
    objective.achievable = dto.achievable ?? objective.achievable;
    objective.relevant = dto.relevant ?? objective.relevant;
    objective.timeBound = dto.timeBound ?? objective.timeBound;
    objective.generatedByAi = dto.generatedByAi ?? objective.generatedByAi;
    return this.objectiveRepository.save(objective);
  }

  public async delete(id: String) {
    const objective = await this.getOneBy(id);
    await this.objectiveRepository.remove(objective);
    return { message: "objective supprime avec succee" };
  }

  // 4.5 - Genere des objectifs SMART a partir du poste, des competences et des evaluations passees
  public async generateForEmployee(employeeId: string) {
    const employee = await this.employeeService.getOneBy(employeeId as any);
    if (!employee.position) {
      throw new BadRequestException("Cet employe n a pas de poste assigne");
    }

    const allEvaluations = await this.evaluationService.getAll();
    const employeeEvaluations = (allEvaluations as any[])
      .filter((ev) => ev.employee?.id === employeeId)
      .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
      .slice(0, 3);

    const currentSkills = ((employee as any).skills || []).map((es: any) => ({
      name: es.skill?.name,
      level: es.level,
    }));

    const context = {
      positionTitle: (employee as any).position.title,
      currentSkills,
      recentEvaluations: employeeEvaluations.map((ev) => ({
        score: ev.score,
        managerComment: ev.managerComment,
        aiSummary: ev.aiSummary,
      })),
    };

    const suggestions = await this.aiService.generateSmartObjectives(context);

    const created: Objective[] = [];
    for (const suggestion of suggestions) {
      const obj = await this.create({
        employeeId: employeeId as any,
        title: suggestion.title as any,
        description: suggestion.description as any,
        specific: suggestion.specific as any,
        measurable: suggestion.measurable as any,
        achievable: suggestion.achievable as any,
        relevant: suggestion.relevant as any,
        timeBound: suggestion.timeBound ? (new Date(suggestion.timeBound) as any) : undefined,
        generatedByAi: true as any,
      });
      created.push(obj);
    }

    return { context, created };
  }
}