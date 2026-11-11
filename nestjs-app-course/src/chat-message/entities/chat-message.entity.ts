import { ChatConversation } from "src/chat-conversation/entities/chat-conversation.entity";
import { CreateDateColumn, Entity, ManyToOne, Column, PrimaryGeneratedColumn } from "typeorm";
export enum MessageSender {
    USER = 'USER',
    BOT = 'BOT'
}
@Entity()
export class ChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: String;

    @ManyToOne( () => ChatConversation, (chatConversation) => chatConversation.messages )
    chatConversation: ChatConversation;

    @Column({ type: 'enum', enum: MessageSender })
    sender: MessageSender;

    @Column({ type: 'text' })
    content: String;

    @CreateDateColumn()
    CreatedAt: Date;
}
