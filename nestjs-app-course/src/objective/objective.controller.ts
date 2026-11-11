import { Controller, Query, Get, Post, Body, Put, Param, Delete, BadRequestException } from "@nestjs/common";
import { ObjectiveService } from "./objective.service";
import { CreateObjectiveDto } from "./dto/create-objective.dto";
import { UpdateObjectiveDto } from "./dto/update-objective.dto";

@Controller("objective")
export class ObjectiveController {
  constructor(private readonly objectiveService: ObjectiveService) {}

  @Post()
  createNewObjective(
    @Body()
    body: {
      employeeId: String;
      title: String;
      description: String;
      specific?: String;
      measurable?: String;
      achievable?: String;
      relevant?: String;
      timeBound?: Date;
      generatedByAI?: Boolean;
    },
  ) {
    return this.objectiveService.create(body);
  }

  // 4.5 - Genere des objectifs SMART automatiquement pour un employe
  @Post("generate/:employeeId")
  generate(@Param("employeeId") employeeId: string) {
    return this.objectiveService.generateForEmployee(employeeId);
  }

  @Get()
  getByEmployee(@Query("employeeId") employeeId: String) {
    if (!employeeId) {
      throw new BadRequestException("employeeId query param is required");
    }
    return this.objectiveService.getByEmployee(employeeId);
  }

  @Get(":id")
  public getSingleObjective(@Param("id") id: String) {
    return this.objectiveService.getOneBy(id);
  }

  @Put(":id")
  update(@Param("id") id: String, @Body() body: any) {
    return this.objectiveService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: String) {
    return this.objectiveService.delete(id);
  }
}