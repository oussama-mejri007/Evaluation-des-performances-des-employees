import { IsUUID, IsNotEmpty } from "class-validator";

export class CreateChatConversationDto {
    @IsUUID()
    @IsNotEmpty()
    employeeId: String;
}
