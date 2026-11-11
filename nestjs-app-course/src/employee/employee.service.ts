import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';

interface CreateEmployeeInput{
  firstName: String;
  lastName: String;
  userId?: String;
  departementId: String;
  positionId: String;
  managerId?: String;
}
interface UpdateEmployeeInput{
  firstName?: String;
  lastName?: String;
  userId?: String;
  departementId?: String;
  positionId?: String;
  managerId?: String;
}
@Injectable()
export class EmployeeService {
constructor( 
  @InjectRepository(Employee)
  private readonly employeeRepository : Repository<Employee>
  ){}
  public create ( dto: CreateEmployeeInput){
    const employee = this.employeeRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      user: dto.userId?({ id: dto.userId} as any): undefined,
      departement: { id: dto.departementId} as any,
      position: { id: dto.positionId},
      manager:dto.managerId? ({ id: dto.managerId}): undefined,
    });
    return this.employeeRepository.save(employee);
  }
  public getAll(){
    return this.employeeRepository.find({ relations: [ "departement", "position","manager","reports","skills","skills.skill", "user"]});
  }
  public async getOneBy(id: String){
    const employee = await this.employeeRepository.findOne({where:{id}, relations: [ "departement", "position","manager","reports","skills","skills.skill", "user"]});
    if (!employee) { throw new NotFoundException ('employee pas trouve');};
    return employee;
  }
  public async update(id: string, dto: UpdateEmployeeInput) {
    const employee = await this.getOneBy(id);

    if (dto.firstName) {
      employee.firstName = dto.firstName;
    }

    if (dto.lastName) {
      employee.lastName = dto.lastName;
    }

    if (dto.departementId) {
      employee.departement = { id: dto.departementId } as any;
    }

    if (dto.positionId) {
      employee.position = { id: dto.positionId } as any;
    }

    if (dto.userId) {
      employee.user = { id: dto.userId } as any;
    }

    if (dto.managerId) {
      employee.manager = { id: dto.managerId } as any;
    }

    return this.employeeRepository.save(employee);
  }
  public async delete (id: String){
    const employee = await this.getOneBy(id);
    try {
      await this.employeeRepository.remove(employee);
    } catch (error: any) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'Impossible de supprimer cet employe : il est encore reference ailleurs (evaluations, objectifs, competences, conversations chatbot, formations, recommandations de carriere, ou en tant que manager d un autre employe). Retire d abord ces liens.'
        );
      }
      throw error;
    }
    return {message: 'employee supprime avec succees'};
  }
}