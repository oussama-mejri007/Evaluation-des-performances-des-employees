import { ManyToOne, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';
@Entity()
export class TrainingRecommendation {
    @PrimaryGeneratedColumn('uuid')
    id: String;

    @ManyToOne( () => Employee, (employee) => employee.trainingRecs )
    employee: Employee;
    
    @Column()
    title: String;
    
    @Column({ type: 'text'})
    reason: String;

    @CreateDateColumn()
    createdAt: Date;
}
