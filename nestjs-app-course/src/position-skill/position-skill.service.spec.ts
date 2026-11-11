import { Test, TestingModule } from '@nestjs/testing';
import { PositionSkillService } from './position-skill.service';

describe('PositionSkillService', () => {
  let service: PositionSkillService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositionSkillService],
    }).compile();

    service = module.get<PositionSkillService>(PositionSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
