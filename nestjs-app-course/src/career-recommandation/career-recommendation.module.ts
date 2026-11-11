import { Module } from "@nestjs/common";
import { CareerRecommendationService } from "./career-recommendation.service";
import { CareerRecommendationController } from "./career-recommendation.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CareerRecommendation } from "./entities/career-recommendation.entity";
import { EmployeeModule } from "../employee/employee.module";
import { EvaluationModule } from "../evaluation/evaluation.module";
import { PositionModule } from "../position/position.module";
import { AiModule } from "../ai/ai.module";

@Module({
  controllers: [CareerRecommendationController],
  providers: [CareerRecommendationService],
  imports: [
    TypeOrmModule.forFeature([CareerRecommendation]),
    EmployeeModule,
    EvaluationModule,
    PositionModule,
    AiModule,
  ],
  exports: [CareerRecommendationService],
})
export class CareerRecommendationModule {}