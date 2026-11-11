import { Injectable, Put, BadRequestException } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

interface CreatePositionInput {
  title: String;
  departementId: String;
}
interface UpdatePositionInput {
  title?: String;
  departementId?: String;
}
@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>
  ){}

  public createPosition(dto: CreatePositionInput){
    const newPosition = this.positionRepository.create({
      title: dto.title,
      departement: { id: dto.departementId } as any,
    });
    return this.positionRepository.save(newPosition)
  }

  public getAll(){
    return this.positionRepository.find({ relations: ["departement", "expectedSkills", "expectedSkills.skill"]});
  }

  public async getOneBy(id: String ){
    const position = await this.positionRepository.findOne({where: {id}, relations:  ["departement", "expectedSkills","expectedSkills.skill"]});
    if(!position) { throw new NotFoundException ('position pas trouve');};
    return position;
  }

  public async  update (id: String, dto: UpdatePositionInput){
    const position = await this.getOneBy(id);

    position.title = dto.title ?? position.title;
    if (dto.departementId) position.departement = { id: dto.departementId} as any;
    return this.positionRepository.save(position);
  }

  public async delete (id: String){
    const position = await this.getOneBy(id);
    try {
      await this.positionRepository.remove(position);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'Impossible de supprimer ce poste : il est encore utilise par un ou plusieurs employes, ou a des competences attendues associees. Retire-le d abord de "Employes" et "Competences attendues (postes)".'
        );
      }
      throw error;
    }
    return { message: 'position supprimee avec succee'};
  }
}