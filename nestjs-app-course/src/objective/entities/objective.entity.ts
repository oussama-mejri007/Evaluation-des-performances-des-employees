import { CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';
@Entity()
export class Objective {
    @PrimaryGeneratedColumn('uuid')
    id: String;

    @Column()
    title: String;

    @Column ({ type: 'text' })
    description: String;

    @Column({ type: 'text', nullable: true })
    specific: String;

    @Column({ type: 'text', nullable: true })
    measurable: String;

    @Column({ type: 'text', nullable: true })
    achievable: String;

    @Column({ type: 'text', nullable: true })
    relevant: String;

    @ManyToOne( () => Employee, (employee) => employee.objectives )
    employee: Employee;

    @Column({ type: 'timestamp', nullable: true})
    timeBound: Date;

    @Column({ type: 'int', default: 0})
    progress: Number;

    @Column({ default: false })
    generatedByAi: Boolean;

    @CreateDateColumn()
    CreatedAt: Date;
}
