import { IsNotEmpty, Min, Max, IsUUID, IsInt } from "class-validator";

export class CreateEmployeeSkillDto {
    @IsInt()
    @Min(1)
    @Max(5)
    level: Number;

    @IsUUID()
    @IsNotEmpty()
    employeeId: String;

    @IsUUID()
    @IsNotEmpty()
    skillId: String;
}
