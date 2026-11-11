import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from "class-validator";

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
    @IsString()
    @IsOptional()
    firstName?: String;


    @IsString()
    @IsOptional()
    lastName?: String;

    @IsUUID()
    @IsOptional()
    userId?: String;

    @IsUUID()
    @IsOptional()
    departementId?: String;

    @IsUUID()
    @IsOptional()
    positionId?: String;
    
    @IsUUID()
    @IsOptional()
    managerId?: String;    
}
