import { Module } from "@nestjs/common";
import { ChatMessageService } from "./chat-message.service";
import { ChatMessageController } from "./chat-message.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatMessage } from "./entities/chat-message.entity";
import { ChatConversation } from "../chat-conversation/entities/chat-conversation.entity";
import { EmployeeModule } from "../employee/employee.module";
import { ObjectiveModule } from "../objective/objective.module";
import { EvaluationModule } from "../evaluation/evaluation.module";
import { TrainingRecommendationModule } from "../training-recommandation/training-recommendation.module";
import { CareerRecommendationModule } from "../career-recommandation/career-recommendation.module";
import { AiModule } from "../ai/ai.module";

@Module({
  controllers: [ChatMessageController],
  providers: [ChatMessageService],
  imports: [
    TypeOrmModule.forFeature([ChatMessage, ChatConversation]),
    EmployeeModule,
    ObjectiveModule,
    EvaluationModule,
    TrainingRecommendationModule,
    CareerRecommendationModule,
    AiModule,
  ],
})
export class ChatMessageModule {}