import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMessageDto } from './create-chat-message.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { MessageSender } from "../entities/chat-message.entity";

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {
    @IsUUID()
    @IsOptional()
    chatConversationId?: String;

    @IsString()
    @IsOptional()
    content?: String;

    @IsEnum(MessageSender)
    @IsOptional()
    sender?: MessageSender
}
