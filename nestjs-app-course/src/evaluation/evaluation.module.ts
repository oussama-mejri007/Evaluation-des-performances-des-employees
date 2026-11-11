import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EvaluationService } from "./evaluation.service";
import { EvaluationController } from "./evaluation.controller";
import { Evaluation } from "./entities/evaluation.entity";
import { AiModule } from "../ai/ai.module";

@Module({
  controllers: [EvaluationController],
  providers: [EvaluationService],
  imports: [TypeOrmModule.forFeature([Evaluation]), AiModule],
  exports: [EvaluationService],   // <-- ligne a ajouter
})
export class EvaluationModule {}