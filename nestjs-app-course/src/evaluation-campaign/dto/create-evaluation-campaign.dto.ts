import { IsNotEmpty, IsString, IsDateString, IsEnum, IsOptional } from "class-validator";
import { CampaignStatus } from "../entities/evaluation-campaign.entity";
export class CreateEvaluationCampaignDto {
    @IsString()
    @IsNotEmpty()
    name: String;

    @IsDateString()
    endDate: Date; 

    @IsDateString()
    startDate: Date;

    @IsEnum(CampaignStatus)
    @IsOptional()
    status?: CampaignStatus;
}
