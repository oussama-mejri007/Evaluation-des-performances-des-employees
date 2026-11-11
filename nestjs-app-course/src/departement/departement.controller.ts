import { DepartementService } from './departement.service';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { UpdateDepartementDto } from './dto/update-departement.dto';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';

@Controller('api/departements')
export class DepartementController {
constructor ( private readonly departementService: DepartementService ){}

@Post()
public createNewDepartement (@Body() body: { name: String} ){
  return this.departementService.createDepartement(body);
}

@Get()
public getAllDepartement(){
  return this.departementService.getAll();
}

@Get(":id")
public getSingleDepartement (@Param("id") id: String){
  return this.departementService.getOneBy(id);
}

@Put(":id")
public updateDepartement (@Param("id") id: String, @Body() body: { name?: String}){
  return this.departementService.update(id,body);
}

@Delete(":id")
public delete (@Param("id") id: String){
  return this.departementService.delete(id);
}

}
