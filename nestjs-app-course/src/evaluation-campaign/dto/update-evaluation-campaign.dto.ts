import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluationCampaignDto } from './create-evaluation-campaign.dto';
import { IsNotEmpty, IsString, IsDateString, IsEnum, IsOptional } from "class-validator";
import { CampaignStatus } from '../entities/evaluation-campaign.entity';
export class UpdateEvaluationCampaignDto extends PartialType(CreateEvaluationCampaignDto) {
    @IsString()
    @IsOptional()
    name?: String;

    @IsDateString()
    @IsOptional()
    endDate?: Date; 

    @IsDateString()
    @IsOptional()
    startDate?: Date;

    @IsEnum(CampaignStatus)
    @IsOptional()
    status?: CampaignStatus;
}
