import { Test, TestingModule } from '@nestjs/testing';
import { CareerRecommendationController } from './career-recommendation.controller';
import { CareerRecommendationService } from './career-recommendation.service';

describe('CareerRecommendationController', () => {
  let controller: CareerRecommandationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CareerRecommandationController],
      providers: [CareerRecommandationService],
    }).compile();

    controller = module.get<CareerRecommendationController>(CareerRecommendationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
