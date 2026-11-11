import { Controller, Get, Post, Body, Put, Param, Delete } from "@nestjs/common";
import { EvaluationService } from "./evaluation.service";
import { EvaluationType } from "./entities/evaluation.entity";

@Controller("evaluation")
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  createNewEvaluation(@Body() body: { type: EvaluationType; managerComment?: String; score?: Number; managerId?: String; employeeId: String; campaignId: String }) {
    return this.evaluationService.create(body);
  }

  @Get()
  getAllEvaluation() {
    return this.evaluationService.getAll();
  }

  @Get(":id")
  getSingleEvaluation(@Param("id") id: string) {
    return this.evaluationService.getOneBy(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: { managerComment?: String; score?: Number; aiSummary?: String; aiStrengths?: String; aiImprovementAreas?: String }) {
    return this.evaluationService.update(id, body);
  }

  // 4.3 - Genere le resume IA a partir du commentaire manager deja enregistre
  @Post(":id/generate-ai")
  generateAi(@Param("id") id: string) {
    return this.evaluationService.generateAiAssessment(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.evaluationService.delete(id);
  }
}
