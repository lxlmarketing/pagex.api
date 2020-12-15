import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'unapproved_payments' })
export class UnapprovedPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_id'})
  customerId: string;

  @Column({ name: 'pagex_id'})
  pagexId: string;

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date
  
}
