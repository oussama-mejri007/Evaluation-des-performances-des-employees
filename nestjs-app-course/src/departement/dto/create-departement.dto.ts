import { IsString, IsNotEmpty, Length } from 'class-validator';
export class CreateDepartementDto {
    @IsString()
    @IsNotEmpty()
    @Length(2,150)
    name: String;
}
