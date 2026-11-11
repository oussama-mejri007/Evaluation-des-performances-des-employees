import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionDto } from './create-position.dto';
import { IsString, IsOptional, Length, IsNotEmpty, IsUUID } from 'class-validator';
export class UpdatePositionDto extends PartialType(CreatePositionDto) {
    @IsString()
    @Length(2,150)
    @IsOptional()
    title?: String;

    @IsUUID()
    @IsOptional()
    departementId?: String;
}
