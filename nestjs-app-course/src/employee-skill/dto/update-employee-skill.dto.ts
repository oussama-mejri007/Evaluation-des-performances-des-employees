import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeSkillDto } from './create-employee-skill.dto';
import { IsNotEmpty, Min, Max, IsUUID, IsInt, IsOptional } from "class-validator";

export class UpdateEmployeeSkillDto extends PartialType(CreateEmployeeSkillDto) {
    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    level?: Number;

    @IsUUID()
    @IsOptional()
    employeeId?: String;

    @IsUUID()
    @IsOptional()
    skillId?: String;
}
