import { Module } from '@nestjs/common';
import { PositionSkillService } from './position-skill.service';
import { PositionSkillController } from './position-skill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionSkill } from './entities/position-skill.entity';
@Module({
  controllers: [PositionSkillController],
  providers: [PositionSkillService],
  imports: [ TypeOrmModule.forFeature([PositionSkill])],
  exports: [PositionSkillService]
})
export class PositionSkillModule {}
