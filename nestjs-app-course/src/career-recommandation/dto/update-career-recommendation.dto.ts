import { PartialType } from '@nestjs/mapped-types';
import { CreateCareerRecommendationDto } from './create-career-recommendation.dto';
import { IsString, IsOptional, IsUUID } from 'class-validator';
export class UpdateCareerRecommendationDto extends PartialType(CreateCareerRecommendationDto) {
    @IsString()
    @IsOptional()
    suggestedRole?: String;

    @IsString()
    @IsOptional()
    progressionPlan?: String;

    @IsUUID()
    @IsOptional()
    employeeId?: String;
}
