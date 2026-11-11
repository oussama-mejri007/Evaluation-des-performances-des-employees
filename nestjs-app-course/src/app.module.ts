import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';


import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EmployeeModule } from './employee/employee.module';
import { DepartementModule } from './departement/departement.module';
import { PositionModule } from './position/position.module';
import { SkillModule } from './skill/skill.module';
import { EmployeeSkillModule } from './employee-skill/employee-skill.module';
import { PositionSkillModule } from './position-skill/position-skill.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { EvaluationCampaignModule } from './evaluation-campaign/evaluation-campaign.module';
import { ObjectiveModule } from './objective/objective.module';
import { TrainingRecommendationModule } from './training-recommandation/training-recommendation.module';
import { CareerRecommendationModule } from './career-recommandation/career-recommendation.module';
import { ChatConversationModule } from './chat-conversation/chat-conversation.module';
import { ChatMessageModule } from './chat-message/chat-message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'rh_db',
      synchronize: process.env.NODE_ENV !== 'production',
      autoLoadEntities: true,
    }),

    EmployeeModule,
    DepartementModule,
    PositionModule,
    SkillModule,
    EmployeeSkillModule,
    PositionSkillModule,
    EvaluationModule,
    EvaluationCampaignModule,
    ObjectiveModule,
    TrainingRecommendationModule,
    CareerRecommendationModule,
    ChatConversationModule,
    ChatMessageModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
