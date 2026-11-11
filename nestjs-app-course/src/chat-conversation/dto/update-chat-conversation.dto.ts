import { PartialType } from '@nestjs/mapped-types';
import { CreateChatConversationDto } from './create-chat-conversation.dto';
import { IsUUID, IsOptional } from 'class-validator';
export class UpdateChatConversationDto extends PartialType(CreateChatConversationDto) {
        @IsUUID()
        @IsOptional()
        employeeId?: String;
}
