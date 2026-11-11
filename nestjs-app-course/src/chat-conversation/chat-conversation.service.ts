import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatConversationDto } from './dto/create-chat-conversation.dto';
import { UpdateChatConversationDto } from './dto/update-chat-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/employee/entities/employee.entity';
import { ChatConversation } from './entities/chat-conversation.entity';

@Injectable()
export class ChatConversationService {
constructor (
  @InjectRepository(ChatConversation)
  private readonly chatConversationRepository: Repository <ChatConversation>,
  @InjectRepository(Employee)
  private readonly employeeRepository: Repository<Employee>
){}

public create(dto: { employeeId: String}) {
  const chatConversation = this.chatConversationRepository.create(
    { employee: { id: dto.employeeId, },}
  );

  return this.chatConversationRepository.save(chatConversation);
}
public getByEmployee (employeeId: String){
  return this.chatConversationRepository.find({where:{ employee: {id: employeeId} as any}, relations: [ "employee", "messages"]});
}
public async getOneBy(id: String){
  const chatConversation = await this.chatConversationRepository.findOne({ where: {id}, relations: ["employee", "messages"]});
  if (!chatConversation) { throw new NotFoundException ('pas de chat conversation trouve ')};
  return chatConversation;
}
public async update (id: String, dto: {employeeId: String}){
  const chatConversation = await this.getOneBy(id);
  const employee = await this.employeeRepository.findOne({where:{id: dto.employeeId}});
  if (!employee){ throw new NotFoundException ('pas demployee')};
  chatConversation.employee = employee ;
  return this.chatConversationRepository.save(chatConversation);
}
public async delete (id: String){
  const chatConversation = await this.getOneBy(id);
  await this.chatConversationRepository.remove(chatConversation);
  return { message: 'chat conversation supprime avec succee'};
}
}
