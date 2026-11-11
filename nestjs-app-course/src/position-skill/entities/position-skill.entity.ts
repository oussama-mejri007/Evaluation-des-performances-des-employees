import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany  } from 'typeorm';
import { Position } from '../../position/entities/position.entity';
import { Skill } from 'src/skill/entities/skill.entity';
@Unique(['position', 'skill'])
@Entity()
export class PositionSkill {
    @PrimaryGeneratedColumn('uuid')
    id: String;
    @Column({ type: 'int'})
    levelRequired: Number;
    @ManyToOne( () => Position, (position) => position.expectedSkills)
    position: Position;
    @ManyToOne( () => Skill, (skill) => skill.positionSkills)
    skill: Skill;
}
