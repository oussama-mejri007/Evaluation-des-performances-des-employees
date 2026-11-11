import { CreateDateColumn, ManyToOne, UpdateDateColumn, PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity'
import { EvaluationCampaign } from 'src/evaluation-campaign/entities/evaluation-campaign.entity';
export enum EvaluationType {
   SELF = 'SELF',
   MANAGER = 'MANAGER'
}
@Entity()
export class Evaluation {
   @PrimaryGeneratedColumn('uuid')
   id: String;
   @Column({ type: 'enum', enum: EvaluationType })
   type: EvaluationType;
   @Column({ type: 'float', nullable: true })
   score: Number;


   @ManyToOne( () => Employee, (employee) => employee.evaluationAsManager, { nullable:true } )
   employee: Employee;
   @ManyToOne( () => Employee, (employee) => employee.evaluationAsEmployee)
   manager: Employee;
   @ManyToOne( () => EvaluationCampaign, (evaluationCampaign) => evaluationCampaign.evaluations)
   campaign: EvaluationCampaign;
   @Column({ type: 'text', nullable: true})
   managerComment: String;
   @Column({ type: 'text', nullable: true})
   aiSummary: String;
   @Column({ type: 'text', nullable: true})
   aiStrengths: String;
   @Column({ type: 'text', nullable: true})
   aiImprovementAreas: String;

   @CreateDateColumn()
   CreatedAt: Date;
   @UpdateDateColumn()
   UpdatedAt: Date;

}

