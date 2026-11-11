import { Module } from '@nestjs/common';
import { ChatConversationService } from './chat-conversation.service';
import { ChatConversationController } from './chat-conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatConversation } from './entities/chat-conversation.entity';
import { Employee } from 'src/employee/entities/employee.entity';

@Module({
  controllers: [ChatConversationController],
  providers: [ChatConversationService],
  imports: [ TypeOrmModule.forFeature([ChatConversation, Employee])]
})
export class ChatConversationModule {}
