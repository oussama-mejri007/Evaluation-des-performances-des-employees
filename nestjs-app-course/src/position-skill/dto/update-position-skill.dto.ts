import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionSkillDto } from './create-position-skill.dto';
import { IsNotEmpty, Min, Max, IsUUID, IsInt, IsOptional } from "class-validator";

export class UpdatePositionSkillDto extends PartialType(CreatePositionSkillDto) {
    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    levelRequired?: Number;

    @IsUUID()
    @IsOptional()
    skillId?: String;

    @IsUUID()
    @IsOptional()
    positionId?: String;
}
