import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ChatConversationService } from './chat-conversation.service';
import { CreateChatConversationDto } from './dto/create-chat-conversation.dto';
import { UpdateChatConversationDto } from './dto/update-chat-conversation.dto';

@Controller('chat-conversation')
export class ChatConversationController {
  constructor(private readonly chatConversationService: ChatConversationService) {}

  @Post()
  createNewChatConversation(@Body() body: {employeeId: String}) {
    return this.chatConversationService.create(body);
  }

  @Get("employee/:employeeId")
  getByEmployee(@Param("employeeId")employeeId: String) {
    return this.chatConversationService.getByEmployee(employeeId);
  }

  @Get(':id')
  getSingleChatConversation(@Param('id') id: string) {
    return this.chatConversationService.getOneBy(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: {employeeId: String}) {
    return this.chatConversationService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatConversationService.delete(id);
  }
}
