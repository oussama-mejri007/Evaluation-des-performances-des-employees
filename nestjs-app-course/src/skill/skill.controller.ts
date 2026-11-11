import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  public createNewSkill(@Body() body: {name: String, category: String}) {
    return this.skillService.create(body);
  }

  @Get()
  getAllSkill() {
    return this.skillService.getAll();
  }

  @Get(':id')
  getSingleSkill(@Param('id') id: string) {
    return this.skillService.getOneBy(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: {name?: String, category?: String}) {
    return this.skillService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillService.delete(id);
  }
}
