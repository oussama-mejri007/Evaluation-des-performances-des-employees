import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PositionSkillService } from './position-skill.service';
import { CreatePositionSkillDto } from './dto/create-position-skill.dto';
import { UpdatePositionSkillDto } from './dto/update-position-skill.dto';

@Controller('position-skill')
export class PositionSkillController {
  constructor(private readonly positionSkillService: PositionSkillService) {}

  @Post()
  setPositionSkill(@Body() body: {positionId: String; skillId: String; levelRequired: Number}) {
    return this.positionSkillService.set(body);
  }

  @Get('position/:positionId')
  getSinglePositionSkill(@Param('positionId') positionId: String) {
    return this.positionSkillService.getOneByPosition(positionId);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionSkillService.delete(id);
  }
}
