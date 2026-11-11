import { Test, TestingModule } from '@nestjs/testing';
import { TrainingRecommendationController } from './training-recommendation.controller';
import { TrainingRecommendationService } from './training-recommendation.service';

describe('TrainingRecommendationController', () => {
  let controller: TrainingRecommendationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingRecommedationController],
      providers: [TrainingRecommendationService],
    }).compile();

    controller = module.get<TrainingRecommendationController>(TrainingRecommendationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
