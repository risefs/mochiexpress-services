import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Check,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../../user-roles/entities/user-role.entity';

@Entity('roles', { schema: 'web_app' })
@Check(`"name" IN ('buyer', 'traveler')`)
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { unique: true })
  name!: 'buyer' | 'traveler';

  @Column('text', { nullable: true })
  description!: string;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles!: UserRole[];
}
