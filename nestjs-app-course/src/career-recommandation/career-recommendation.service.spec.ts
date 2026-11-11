import { Test, TestingModule } from '@nestjs/testing';
import { CareerRecommendationService } from './career-recommendation.service';

describe('CareerRecommendationService', () => {
  let service: CareerRecommandationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CareerRecommendationService],
    }).compile();

    service = module.get<CareerRecommendationService>(CareerRecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
