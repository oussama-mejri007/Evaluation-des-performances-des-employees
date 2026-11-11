import { IsNotEmpty, Min, Max, IsUUID, IsInt } from "class-validator";

export class CreatePositionSkillDto {
    @IsInt()
    @Min(1)
    @Max(5)
    levelRequired: Number;

    @IsNotEmpty()
    @IsUUID()
    skillId: String;

    @IsNotEmpty()
    @IsUUID()
    positionId: String;
}
