import { Controller, Get, Post, Body, Put, Param, Delete } from "@nestjs/common";
import { TrainingRecommendationService } from "./training-recommendation.service";
import { CreateTrainingRecommendationDto } from "./dto/create-training-recommendation.dto";
import { UpdateTrainingRecommendationDto } from "./dto/update-training-recommendation.dto";

@Controller("training-recommendation")
export class TrainingRecommendationController {
  constructor(private readonly trainingRecommendationService: TrainingRecommendationService) {}

  @Post()
  create(@Body() body: CreateTrainingRecommendationDto) {
    return this.trainingRecommendationService.create(body);
  }

  // 4.4 - Genere automatiquement des recommandations a partir de l ecart de competences
  @Post("generate/:employeeId")
  generate(@Param("employeeId") employeeId: string) {
    return this.trainingRecommendationService.generateForEmployee(employeeId);
  }

  @Get()
  findAll() {
    return this.trainingRecommendationService.getAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.trainingRecommendationService.getOneBy(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: UpdateTrainingRecommendationDto) {
    return this.trainingRecommendationService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.trainingRecommendationService.delete(id);
  }
}