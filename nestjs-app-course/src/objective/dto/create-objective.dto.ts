import { IsBoolean, IsNotEmpty, IsString, IsOptional, IsDateString, IsInt, IsUUID } from "class-validator";

export class CreateObjectiveDto {
    @IsString()
    @IsNotEmpty()
    title: String;

    @IsString()
    @IsNotEmpty()
    description: String;

    @IsString()
    @IsOptional()
    measurable?: String;

    @IsString()
    @IsOptional()
    specific?: String;

    @IsString()
    @IsOptional()
    achievable?: String;

    @IsString()
    @IsOptional()
    relevant?: String;

    @IsDateString()
    @IsOptional()
    timeBound?: Date;

    @IsInt()
    @IsNotEmpty()
    progress: Number;

    @IsBoolean()
    @IsNotEmpty()
    generatedByAi: Boolean;

    @IsUUID()
    @IsNotEmpty()
    employeeId: String;
}
