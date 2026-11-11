import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "../../employee/entities/employee.entity";

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: String;
    @Column({ unique: true })
    email: String;
    @Column()
    passwordHash: String;
    @Column({ type: "enum", enum: Role, default: Role.EMPLOYEE })
    role: Role;
    @Column({ nullable: true })
    firstName: String;
    @Column({ nullable: true })
    lastName: String;
    @OneToOne(() => Employee, (employee) => employee.user)
    employee: Employee;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}