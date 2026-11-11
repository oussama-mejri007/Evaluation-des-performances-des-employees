import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationCampaignService } from './evaluation-campaign.service';

describe('EvaluationCampaignService', () => {
  let service: EvaluationCampaignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaluationCampaignService],
    }).compile();

    service = module.get<EvaluationCampaignService>(EvaluationCampaignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
