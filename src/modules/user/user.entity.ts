import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  name: string

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'reset_token' })
  @Exclude()
  resetToken: string;

  @Column({ name: 'expires_token' })
  @Exclude()
  expiresToken: Date;

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 8);
  }
}
