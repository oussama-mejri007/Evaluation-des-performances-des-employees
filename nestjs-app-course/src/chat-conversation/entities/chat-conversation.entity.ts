import { ManyToOne, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';
import { ChatMessage } from '../../chat-message/entities/chat-message.entity';
@Entity()
export class ChatConversation {
    @PrimaryGeneratedColumn('uuid')
    id: String;
    @ManyToOne( () => Employee, (employee) => employee.conversations)
    employee: Employee;

    @OneToMany( () => ChatMessage, (chatMessage) => chatMessage.chatConversation)
    messages: ChatMessage[];

    @CreateDateColumn()
    createdAt: Date;
}
