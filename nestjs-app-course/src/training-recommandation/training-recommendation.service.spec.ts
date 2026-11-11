import { Test, TestingModule } from '@nestjs/testing';
import { TrainingRecommendationService } from './training-recommendation.service';

describe('TrainingRecommendationService', () => {
  let service: TrainingRecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingRecommendationService],
    }).compile();

    service = module.get<TrainingRecommendationService>(TrainingRecommandationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
