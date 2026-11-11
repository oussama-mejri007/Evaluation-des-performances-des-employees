import { Injectable } from '@nestjs/common';
import { CreateEmployeeSkillDto } from './dto/create-employee-skill.dto';
import { UpdateEmployeeSkillDto } from './dto/update-employee-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { EmployeeSkill } from './entities/employee-skill.entity';
import { Repository } from 'typeorm';

interface SetEmployeeSkillInput {
  level: Number;
  skillId: String;
  employeeId: String;
}
@Injectable()
export class EmployeeSkillService {
  constructor ( 
    @InjectRepository(EmployeeSkill)
    private readonly employeeSkillRepository: Repository<EmployeeSkill>
  ){}
  public async set(dto: SetEmployeeSkillInput){
    let employeeSkill = await this.employeeSkillRepository.findOne({where:{
      employee: {id: dto.employeeId},
      skill: { id: dto.skillId},
    }});
    if(employeeSkill){
      employeeSkill.level = dto.level;
    }
    else{
      employeeSkill = await this.employeeSkillRepository.create({
        level: dto.level,
        employee: {id: dto.employeeId} as any,
        skill: {id: dto.skillId} as any,
      })
    }
    return this.employeeSkillRepository.save(employeeSkill);
  }
   
  public getOneByEmployee(employeeId: String){
    return this.employeeSkillRepository.find({where:{
      employee: {id: employeeId},
    },
     relations: ["skill"]});
  }

  public async delete (id: String){
    const employeeSkill = await this.employeeSkillRepository.findOne({where: { id }});
    if(!employeeSkill){ throw new NotFoundException ('employeeskill non trouve')};
    await this.employeeSkillRepository.remove(employeeSkill);
    return { message: 'employeeSkill supprime'};
  }
}
