import { Test, TestingModule } from '@nestjs/testing';
import { ChatConversationController } from './chat-conversation.controller';
import { ChatConversationService } from './chat-conversation.service';

describe('ChatConversationController', () => {
  let controller: ChatConversationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatConversationController],
      providers: [ChatConversationService],
    }).compile();

    controller = module.get<ChatConversationController>(ChatConversationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
