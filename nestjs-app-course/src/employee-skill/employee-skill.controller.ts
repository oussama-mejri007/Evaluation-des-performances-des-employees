import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeeSkillService } from './employee-skill.service';
import { CreateEmployeeSkillDto } from './dto/create-employee-skill.dto';
import { UpdateEmployeeSkillDto } from './dto/update-employee-skill.dto';

@Controller('employee-skill')
export class EmployeeSkillController {
  constructor(private readonly employeeSkillService: EmployeeSkillService) {}

  @Post()
  setEmployeeSkill(@Body() body: {employeeId: String; skillId: String; level: Number}) {
    return this.employeeSkillService.set(body);
  }

  @Get('employee/:employeeId')
  getSingleEmployee(@Param('employeeId') employeeId: string) {
    return this.employeeSkillService.getOneByEmployee(employeeId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeSkillService.delete(id);
  }
}
