import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationCampaignController } from './evaluation-campaign.controller';
import { EvaluationCampaignService } from './evaluation-campaign.service';

describe('EvaluationCampaignController', () => {
  let controller: EvaluationCampaignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationCampaignController],
      providers: [EvaluationCampaignService],
    }).compile();

    controller = module.get<EvaluationCampaignController>(EvaluationCampaignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
