import { Entity, OneToMany, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm"
import { Employee } from '../../employee/entities/employee.entity';
import { Position } from '../../position/entities/position.entity';
@Entity()
export class Departement {
    @PrimaryGeneratedColumn('uuid')
    id: String;
    @Column({ unique: true })
    name: String;
    @OneToMany( () => Employee, (employee) => employee.departement)
    employees: Employee[];
    @OneToMany( () => Position, (position) => position.departement )
    positions: Position[];
    @CreateDateColumn()
    createdAt: Date;
}
