import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

interface CreateSkillInput{
  name: String;
  category?: String;
}
interface UpdateSkillInput{
  name?: String;
  category?: String;
}
@Injectable()
export class SkillService {
  constructor (
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>
  ){}
  public create(dto: CreateSkillInput){
    const skill = this.skillRepository.create(dto);
    return this.skillRepository.save(skill);
  }
  public getAll(){
    return this.skillRepository.find();
  }
  public async getOneBy(id: String){
    const skill = await this.skillRepository.findOne({where:{id}});
    if (!skill) { throw new NotFoundException ('pas de skill')}
    return skill;
  }
  public async update (id: String, dto: UpdateSkillDto){
    const skill = await this.getOneBy(id);
    skill.name = dto.name ?? skill.name;
    return this.skillRepository.save(skill);
  }
  public async delete (id: String){
    const skill = await this.getOneBy(id);
    try {
      await this.skillRepository.remove(skill);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'Impossible de supprimer cette competence : elle est encore utilisee par un ou plusieurs postes ou employes. Retire-la d abord de "Competences des employes" et "Competences attendues (postes)".'
        );
      }
      throw error;
    }
    return {message: 'skill supprime avec succee'};
  }
}