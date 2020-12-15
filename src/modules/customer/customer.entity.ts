import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ name: 'hotmart_email', unique: true })
  hotmartEmail: string;

  @Column({ name: 'pagex_email', nullable: true })
  pagexEmail: string;

  @Column({ name: 'pagex_id', nullable: true })
  pagexId: string;

  @Column()
  active: boolean;

  @Column({ name: 'reset_token', nullable: true })
  @Exclude()
  resetToken: string;
}
