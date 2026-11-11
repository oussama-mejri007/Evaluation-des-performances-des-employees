import { Module } from '@nestjs/common';
import { EvaluationCampaignService } from './evaluation-campaign.service';
import { EvaluationCampaignController } from './evaluation-campaign.controller';
import { EvaluationCampaign } from './entities/evaluation-campaign.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  controllers: [EvaluationCampaignController],
  providers: [EvaluationCampaignService],
  imports: [TypeOrmModule.forFeature([EvaluationCampaign])]
})
export class EvaluationCampaignModule {}
