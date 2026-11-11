import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrainingRecommendationService } from "./training-recommendation.service";
import { TrainingRecommendationController } from "./training-recommendation.controller";
import { TrainingRecommendation } from "./entities/training-recommendation.entity";
import { EmployeeModule } from "../employee/employee.module";
import { EmployeeSkillModule } from "../employee-skill/employee-skill.module";
import { PositionSkillModule } from "../position-skill/position-skill.module";
import { AiModule } from "../ai/ai.module";

@Module({
  controllers: [TrainingRecommendationController],
  providers: [TrainingRecommendationService],
  imports: [
    TypeOrmModule.forFeature([TrainingRecommendation]),
    EmployeeModule,
    EmployeeSkillModule,
    PositionSkillModule,
    AiModule,
  ],
  exports: [TrainingRecommendationService],
})
export class TrainingRecommendationModule {}