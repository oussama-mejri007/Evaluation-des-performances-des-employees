import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('position')
export class PositionController {
  constructor ( private readonly positionService: PositionService){}
  @Post()
  public createNewPosition (@Body() body: { title: String; departementId: String }){
    return this.positionService.createPosition(body);
  }
  @Get()
  public getAllPosition (){
    return this.positionService.getAll();
  }
  @Get(":id")
  public getSinglePosition(@Param("id") id: String) {
    return this.positionService.getOneBy(id);
  }
  @Put(":id")
  public update (@Param("id") id: String, @Body() body: { title?: String, depatementId?: String}){
    return this.positionService.update(id,body);
  }

  @Delete(":id")
  public delete (@Param("id") id: String){
    return this.positionService.delete(id);
  }
}

