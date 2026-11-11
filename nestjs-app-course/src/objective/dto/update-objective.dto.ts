import { PartialType } from '@nestjs/mapped-types';
import { CreateObjectiveDto } from './create-objective.dto';
import { IsBoolean, IsNotEmpty, IsString, IsOptional, IsDateString, IsInt, IsUUID } from "class-validator";
export class UpdateObjectiveDto extends PartialType(CreateObjectiveDto) {
        @IsString()
        @IsOptional()
        title?: String;
    
        @IsString()
        @IsOptional()
        description?: String;
    
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
        @IsOptional()
        progress?: Number;
    
        @IsBoolean()
        @IsOptional()
        generatedByAi?: Boolean;
    
        @IsUUID()
        @IsOptional()
        employeeId?: String;
}
