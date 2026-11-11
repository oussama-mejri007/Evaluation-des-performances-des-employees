import { Controller, Query, Get, Post, Body, Put, Param, Delete } from "@nestjs/common";
import { CareerRecommendationService } from "./career-recommendation.service";
import { UpdateCareerRecommendationDto } from "./dto/update-career-recommendation.dto";

@Controller("career-recommendation")
export class CareerRecommendationController {
  constructor(private readonly careerRecommendationService: CareerRecommendationService) {}

  @Post()
  create(@Body() body: { employeeId: String; suggestedRole: String; progressionPlan: String }) {
    return this.careerRecommendationService.create(body);
  }

  // 4.6 - Genere des recommandations de carriere automatiquement pour un employe
  @Post("generate/:employeeId")
  generate(@Param("employeeId") employeeId: string) {
    return this.careerRecommendationService.generateForEmployee(employeeId);
  }

  @Get()
  getAll(@Query("employeeId") employeeId: String) {
    return this.careerRecommendationService.getByEmployee(employeeId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.careerRecommendationService.getOneBy(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: UpdateCareerRecommendationDto) {
    return this.careerRecommendationService.update(id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.careerRecommendationService.delete(id);
  }
}