import { EvaluationType } from "../entities/evaluation.entity";
import { IsString, IsOptional, IsNotEmpty, IsUUID, IsNumber, IsEnum } from 'class-validator';
export class CreateEvaluationDto {
    @IsEnum(EvaluationType)
    @IsNotEmpty()
    type: EvaluationType;

    @IsNumber()
    @IsNotEmpty()
    score: Number;

    @IsOptional()
    @IsUUID()
    managerId?: String;

    @IsNotEmpty()
    @IsUUID()
    campaignId: String;

    @IsNotEmpty()
    @IsUUID()
    employeeId: String;

    @IsOptional()
    @IsString()
    managerComment?: String;

    @IsOptional()
    @IsString()
    aiSummary?: String;

    @IsOptional()
    @IsString()
    aiStrengths?: String;

    @IsOptional()
    @IsString()
    aiImprovementAreas?: String;
}
