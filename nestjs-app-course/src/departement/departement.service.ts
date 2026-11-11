import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { UpdateDepartementDto } from './dto/update-departement.dto';
import { Departement } from './entities/departement.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface CreateDepartementInput {
  name: String;
}
interface UpdateDepartementInput{
  name?: String;
}
@Injectable()
export class DepartementService {
  constructor(
    @InjectRepository(Departement)
    private readonly departementRepository: Repository<Departement>
  ){}
  public createDepartement (dto: CreateDepartementInput){
    const newDepartement = this.departementRepository.create(dto);
    return this.departementRepository.save(newDepartement);
  }

  public getAll(){
    return this.departementRepository.find({relations: ["employees", "positions"]});
  }

  public async getOneBy(id: String) {
    const departement = await this.departementRepository.findOne({ where: {id}, relations: ["employees", "positions"]});
    if (!departement) { throw new NotFoundException ('departement not found');}
    return departement;
  }

  public async update (id: String, dto: UpdateDepartementInput){
    const departement = await this.getOneBy(id);

    departement.name = dto.name ?? departement.name;
    return this.departementRepository.save(departement);
  }
  public async delete (id: String) {
    const departement = await this.getOneBy(id);
    // Correction : "await" manquant ici avant, ce qui transformait l erreur
    // de contrainte FK en unhandled rejection et faisait planter tout le serveur.
    try {
      await this.departementRepository.remove(departement);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'Impossible de supprimer ce departement : il est encore utilise par un ou plusieurs postes ou employes. Supprime-les d abord, ou reassigne-les a un autre departement.'
        );
      }
      throw error;
    }
    return { message: 'departement delete succefully'};
  }
}