import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    firstName: String;

    @IsString()
    @IsNotEmpty()
    lastName: String;

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
