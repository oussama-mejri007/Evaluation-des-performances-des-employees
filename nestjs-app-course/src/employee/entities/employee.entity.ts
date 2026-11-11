import { Entity, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Departement } from '../../departement/entities/departement.entity';
import { Position } from '../../position/entities/position.entity';
import { EmployeeSkill } from '../../employee-skill/entities/employee-skill.entity';
import { Objective } from '../../objective/entities/objective.entity';
import { TrainingRecommendation } from '../../training-recommandation/entities/training-recommendation.entity';
import { CareerRecommendation } from '../../career-recommandation/entities/career-recommendation.entity';
import { ChatConversation } from '../../chat-conversation/entities/chat-conversation.entity';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';
@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: String;
    @Column()
    firstName: String;
    @Column()
    lastName: String;
    @OneToOne( () => User, (user) => user.employee)
    @JoinColumn()
    user: User;
    @ManyToOne( () => Departement, (departement) => departement.employees )
    departement: Departement;
    @ManyToOne ( () => Position, (position) => position.employees)
    position: Position;
    @OneToMany( () => EmployeeSkill, (employeeSkill) => employeeSkill.employee)
    skills: EmployeeSkill[];
    @OneToMany( () => Objective, (objective) => objective.employee)
    objectives: Objective[];  
    @OneToMany( () => TrainingRecommendation, (trainingRecommendation) => trainingRecommendation.employee)
    trainingRecs: TrainingRecommendation[];  
    @OneToMany( () => CareerRecommendation, (careerRecommendation) => careerRecommendation.employee)
    careerRecs: CareerRecommendation[];
    @OneToMany( () => ChatConversation, (chatConversation) => chatConversation.employee)
    conversations: ChatConversation[];
    @ManyToOne( () => Employee, (employee) => employee.reports, { nullable: true })
    manager: Employee;
    @OneToMany( () => Employee, (employee) => employee.manager)
    reports: Employee[];
    @OneToMany( () => Evaluation, (evaluation) => evaluation.employee)
    evaluationAsEmployee: Evaluation[];
    @OneToMany( () => Evaluation, (evaluation) => evaluation.manager)
    evaluationAsManager: Evaluation[];
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    UpdatedAt: Date;
}
