import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { MessageSender } from "../entities/chat-message.entity";

export class CreateChatMessageDto {
    @IsUUID()
    @IsNotEmpty()
    chatConversationId: String;

    @IsString()
    @IsNotEmpty()
    content: String;

    @IsEnum(MessageSender)
    @IsNotEmpty()
    sender: MessageSender
}
