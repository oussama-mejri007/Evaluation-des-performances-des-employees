import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
export class CreateCareerRecommendationDto {
    @IsString()
    @IsNotEmpty()
    suggestedRole: String;

    @IsString()
    @IsNotEmpty()
    progressionPlan: String;

    @IsUUID()
    @IsNotEmpty()
    employeeId: String;
}
