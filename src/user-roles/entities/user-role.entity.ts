import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('user_roles', { schema: 'web_app' })
export class UserRole {
  @PrimaryColumn('uuid')
  user_id!: string;

  @PrimaryColumn('uuid')
  role_id!: string;

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role!: Role;
}
