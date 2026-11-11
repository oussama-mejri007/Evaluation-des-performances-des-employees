import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
@Controller('employee')
export class EmployeeController {
 constructor ( private readonly employeeService: EmployeeService){}
 @Post()
 public createNewEmployee(@Body() body: {firstName: String, lastName: String, userId:String, departementId:String, positionId: String, managerId: String}){
  return this.employeeService.create(body);
 }
 @Get()
 public getAllEmployee(){
  return this.employeeService.getAll();
 }
 @Get(":id")
 public getSingleEmployee(@Param("id") id: String){
  return this.employeeService.getOneBy(id)
 }
 @Put(":id")
 public update(@Param("id") id: string, @Body() body: {firstName?: String, lastName?: String, userId?:String, departementId?:String, positionId?: String, managerId?: String}){
  return this.employeeService.update(id,body);
 }
 @Delete(":id")
 public delete (@Param("id") id: String){
  return this.employeeService.delete(id);
 }
}
