import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { EvaluationCampaignService } from './evaluation-campaign.service';
import { CreateEvaluationCampaignDto } from './dto/create-evaluation-campaign.dto';
import { UpdateEvaluationCampaignDto } from './dto/update-evaluation-campaign.dto';
import { CampaignStatus } from './entities/evaluation-campaign.entity';

@Controller('evaluation-campaign')
export class EvaluationCampaignController {
  constructor(private readonly evaluationCampaignService: EvaluationCampaignService) {}

  @Post()
  createNewEvaluationCampaign(@Body() body: {name: String; endDate: Date; startDate: Date; status?: CampaignStatus}) {
    return this.evaluationCampaignService.create(body);
  }

  @Get()
  getAllEvaluationCampaign() {
    return this.evaluationCampaignService.getAll();
  }

  @Get(':id')
  getSingleEvaluationCampaign(@Param('id') id: string) {
    return this.evaluationCampaignService.getOneBy(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: {name?: String; endDate?: Date; startDate?: Date; status?: CampaignStatus}) {
    return this.evaluationCampaignService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evaluationCampaignService.delete(id);
  }
}
