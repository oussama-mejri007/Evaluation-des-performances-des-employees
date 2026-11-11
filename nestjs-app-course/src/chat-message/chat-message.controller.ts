import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ChatMessageService } from "./chat-message.service";

@Controller("chat-message")
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Post(":conversationId")
  public addMessage(@Param("conversationId") conversationId: String, @Body() body: { content: String }) {
    return this.chatMessageService.addMessage(conversationId, body.content);
  }

  // Bug corrige : la route utilisait ":id" mais lisait "conversationId", le param etait toujours undefined
  @Get(":conversationId")
  public getByConversation(@Param("conversationId") conversationId: String) {
    return this.chatMessageService.getByConversation(conversationId);
  }
}