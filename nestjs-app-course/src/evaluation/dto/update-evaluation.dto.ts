import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluationDto } from './create-evaluation.dto';
import { EvaluationType } from "../entities/evaluation.entity";
import { IsString, IsOptional, IsNotEmpty, IsUUID, IsNumber, IsEnum } from 'class-validator';

export class UpdateEvaluationDto extends PartialType(CreateEvaluationDto) {
    @IsEnum(EvaluationType)
    @IsOptional()
    type?: EvaluationType;

    @IsNumber()
    @IsOptional()
    score?: Number;

    @IsOptional()
    @IsUUID()
    managerId?: String;

    @IsUUID()
    @IsOptional()
    campaignId?: String;

    @IsUUID()
    @IsOptional()
    employeeId?: String;

    @IsOptional()
    @IsString()
    managerComment?: String;

    @IsOptional()
    @IsString()
    aiSummary?: String;

    @IsOptional()
    @IsString()
    aiStrngths?: String;

    @IsOptional()
    @IsString()
    aiImprovementAreas?: String;
}
