import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartementDto } from './create-departement.dto';
import {IsString, IsNotEmpty, Length, IsOptional} from 'class-validator'

export class UpdateDepartementDto extends PartialType(CreateDepartementDto) {
    @IsString()
    @Length(2,150)
    @IsOptional()
    name?: String;
}
