import { IsString, IsNotEmpty, Length, IsUUID } from 'class-validator';
export class CreatePositionDto {
    @IsString()
    @IsNotEmpty()
    @Length(2,150)
    title: String;
    
    @IsUUID()
    departementId: String;
}
