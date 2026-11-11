import { Module } from '@nestjs/common';
import { EmployeeSkillService } from './employee-skill.service';
import { EmployeeSkillController } from './employee-skill.controller';
import { EmployeeSkill } from './entities/employee-skill.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EmployeeSkillController],
  providers: [EmployeeSkillService],
  imports: [TypeOrmModule.forFeature([EmployeeSkill])],
  exports: [EmployeeSkillService]
})
export class EmployeeSkillModule {}
