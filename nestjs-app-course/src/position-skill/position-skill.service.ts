import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePositionSkillDto } from './dto/create-position-skill.dto';
import { UpdatePositionSkillDto } from './dto/update-position-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionSkill } from './entities/position-skill.entity';

interface SetPositionSkillInput {
  positionId: String,
  skillId: String,
  levelRequired: Number,
}
@Injectable()
export class PositionSkillService {
  constructor (
    @InjectRepository(PositionSkill)
    private readonly positionSkillRepository: Repository<PositionSkill>
  ){}
  public async set (dto: SetPositionSkillInput){
    let positionSkill = await this.positionSkillRepository.findOne({where:{
      position: { id: dto.positionId},
      skill: {id: dto.skillId},
    }
    });
    if (positionSkill){
      positionSkill.levelRequired = dto.levelRequired;
    }
    else{
      positionSkill = await this.positionSkillRepository.create({
        levelRequired: dto.levelRequired,
        position: { id: dto.positionId} as any,
        skill: { id: dto.skillId} as any,
      })
    }
    return this.positionSkillRepository.save(positionSkill);
  }
  public async getOneByPosition(positionId: String){
    return this.positionSkillRepository.find({where: {
      position: {id: positionId},
    },
    relations: ["skill"]});
  }
  
  public async delete (id: String) {
    const positionSkill = await this.positionSkillRepository.findOne({where: {id}});
    if (!positionSkill) { throw new NotFoundException ('positionSkill non trouve')}
    await this.positionSkillRepository.remove(positionSkill);
    return { message: 'positionSkill supprime avec succes '};
  }
}
