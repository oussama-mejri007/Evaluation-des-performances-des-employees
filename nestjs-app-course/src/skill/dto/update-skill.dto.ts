import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillDto } from './create-skill.dto';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {
        @IsString()
        @IsOptional()
        name?: String;
    
        @IsString()
        @IsOptional()
        category?: String;
}
