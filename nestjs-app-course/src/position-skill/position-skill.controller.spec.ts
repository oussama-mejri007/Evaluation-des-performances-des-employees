import { Test, TestingModule } from '@nestjs/testing';
import { PositionSkillController } from './position-skill.controller';
import { PositionSkillService } from './position-skill.service';

describe('PositionSkillController', () => {
  let controller: PositionSkillController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionSkillController],
      providers: [PositionSkillService],
    }).compile();

    controller = module.get<PositionSkillController>(PositionSkillController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
