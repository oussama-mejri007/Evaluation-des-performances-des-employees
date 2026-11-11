import { Injectable } from '@nestjs/common';
import { CreateEvaluationCampaignDto } from './dto/create-evaluation-campaign.dto';
import { UpdateEvaluationCampaignDto } from './dto/update-evaluation-campaign.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CampaignStatus, EvaluationCampaign } from './entities/evaluation-campaign.entity';

interface CreateEvaluationCampaignInput{
  name: String;
  startDate: Date;
  endDate: Date;
  status?: CampaignStatus;
}
interface UpdateEvaluationCampaignInput{
  name?: String;
  startDate?: Date;
  endDate?: Date;
  status?: CampaignStatus;
}
@Injectable()
export class EvaluationCampaignService {
  constructor (
    @InjectRepository(EvaluationCampaign)
    private readonly evaluationCampaignRepository: Repository<EvaluationCampaign>
  ){}
  public create (dto: CreateEvaluationCampaignInput){
    const evaluationCampaign = this.evaluationCampaignRepository.create({
      name: dto.name,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: dto.status,
  });
    return this.evaluationCampaignRepository.save(evaluationCampaign);
  }
  public getAll(){
    return this.evaluationCampaignRepository.find({relations: ["evaluations"]});
  }
  public async getOneBy(id: String){
    const evaluationCampaign = await this.evaluationCampaignRepository.findOne({where:{id},
    relations: ["evaluations","evaluations.employee","evaluations.manager"] });
    if(!evaluationCampaign){ throw new NotFoundException ('evaluationCampaign non trouve')};
    return evaluationCampaign;
  }
  public async update (id: String, dto: UpdateEvaluationCampaignInput){
    const evaluationCampaign = await this.getOneBy(id);
    evaluationCampaign.name = dto.name ?? evaluationCampaign.name;
    evaluationCampaign.startDate = dto.startDate ?? evaluationCampaign.startDate;
    evaluationCampaign.endDate = dto.endDate ?? evaluationCampaign.endDate;
    evaluationCampaign.status = dto.status ?? evaluationCampaign.status;
    return this.evaluationCampaignRepository.save(evaluationCampaign);
  }
  public async delete ( id: String){
    const evaluationCampaign = await this.getOneBy(id);
    await this.evaluationCampaignRepository.remove(evaluationCampaign);
    return {message: 'evaluation-Campaign supprime avec succes'};
  }
}
