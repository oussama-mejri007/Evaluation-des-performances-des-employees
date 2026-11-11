import { Module } from "@nestjs/common";
import { ObjectiveService } from "./objective.service";
import { ObjectiveController } from "./objective.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Objective } from "./entities/objective.entity";
import { EmployeeModule } from "../employee/employee.module";
import { EvaluationModule } from "../evaluation/evaluation.module";
import { AiModule } from "../ai/ai.module";

@Module({
  controllers: [ObjectiveController],
  providers: [ObjectiveService],
  imports: [TypeOrmModule.forFeature([Objective]), EmployeeModule, EvaluationModule, AiModule],
  exports: [ObjectiveService],
})
export class ObjectiveModule {}