import { IsString, IsNotEmpty } from 'class-validator';
export class CreateSkillDto {
    @IsString()
    @IsNotEmpty()
    name: String;

    @IsString()
    category: String;
}
