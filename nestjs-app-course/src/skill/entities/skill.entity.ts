import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EmployeeSkill } from 'src/employee-skill/entities/employee-skill.entity';
import { PositionSkill } from 'src/position-skill/entities/position-skill.entity';
@Entity()
export class Skill {
    @PrimaryGeneratedColumn('uuid')
    id: String;
    @Column({unique:true})
    name: String;
    @Column()
    category: String;
    @OneToMany( () => EmployeeSkill, (employeeSkill) => employeeSkill.employee)
    employeeSkills: EmployeeSkill[];
    @OneToMany( () => PositionSkill, (positionSkill) => positionSkill.skill)
    positionSkills: PositionSkill[];
}
