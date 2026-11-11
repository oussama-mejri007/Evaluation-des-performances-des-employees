import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Evaluation } from "src/evaluation/entities/evaluation.entity";
export enum CampaignStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED'
}
@Entity()
export class EvaluationCampaign {
    @PrimaryGeneratedColumn('uuid')
    id: String;

    @Column()
    name: String

    @CreateDateColumn()
    createdAt: Date;
    @Column({ type: 'enum', enum: CampaignStatus, default: CampaignStatus.DRAFT})
    status: CampaignStatus;
    @OneToMany( () => Evaluation, (evaluation) => evaluation.campaign)
    evaluations: Evaluation[];
    @Column()
    startDate: Date;

    @Column()
    endDate: Date;
}
