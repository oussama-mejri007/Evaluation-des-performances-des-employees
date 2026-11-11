import { ManyToOne, PrimaryGeneratedColumn, Column, Entity, CreateDateColumn } from 'typeorm'; 
import { Employee } from '../../employee/entities/employee.entity';
@Entity()
export class CareerRecommendation {
    @PrimaryGeneratedColumn('uuid')
    id: String;
    @ManyToOne( () => Employee, (employee) => employee.careerRecs)
    employee: Employee[];
    
    @Column()
    suggestedRole: String;

    @Column({type: 'text'})
    progressionPlan: String;

    @CreateDateColumn()
    createdAt: Date;
}
