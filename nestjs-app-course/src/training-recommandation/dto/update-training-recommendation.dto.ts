import { PartialType } from '@nestjs/mapped-types';
import { CreateTrainingRecommendationDto } from './create-training-recommendation.dto';
import { IsOptional, IsUUID, IsNotEmpty, IsString } from 'class-validator';
export class UpdateTrainingRecommendationDto extends PartialType(CreateTrainingRecommendationDto) {
    @IsUUID()
    @IsOptional()
    employeeId?: String;

    @IsString()
    @IsOptional()
    title?: String;

    @IsString()
    @IsOptional()
    reason?: String;
}
