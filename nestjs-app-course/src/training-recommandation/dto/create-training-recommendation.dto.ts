import{ IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTrainingRecommendationDto {
    @IsUUID()
    @IsNotEmpty()
    employeeId: String;

    @IsString()
    @IsNotEmpty()
    title: String;

    @IsString()
    @IsNotEmpty()
    reason: String;
}
