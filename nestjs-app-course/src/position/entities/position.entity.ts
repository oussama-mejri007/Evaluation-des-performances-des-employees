import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Departement } from '../../departement/entities/departement.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { PositionSkill } from '../../position-skill/entities/position-skill.entity';
@Entity()
export class Position {
    @PrimaryGeneratedColumn('uuid')
    id: String;
    @Column()
    title: String;
    @ManyToOne( () => Departement, (departement) => departement.positions)
    departement: Departement;
    @OneToMany( () => Employee , (employee) => employee.position)
    employees: Employee[];
    @OneToMany( () => PositionSkill, (positionskill) => positionskill.position)
    expectedSkills: PositionSkill[];
    @CreateDateColumn()
    createdAt: Date;
}
