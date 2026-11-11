import { Entity, Unique, Column, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Employee } from '../../employee/entities/employee.entity';
import { Skill } from "src/skill/entities/skill.entity";
@Unique(['employee', 'skill'])
@Entity()
export class EmployeeSkill {
    @PrimaryGeneratedColumn('uuid')
    id: String;
    @Column({ type: 'int'})
    level: Number;
    @ManyToOne( () => Employee, (employee) => employee.skills )
    employee: Employee[]
    @ManyToOne( () => Skill, (skill) => skill.employeeSkills)
    skill: Skill;
    @UpdateDateColumn()
    updatedAt: Date;
}
