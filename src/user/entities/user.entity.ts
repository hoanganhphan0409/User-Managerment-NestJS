import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ nullable: true })
  full_name: string;
  
  @Column({ default: '' })
  username: string;
  
  @Column({ default: '' })
  email: string;
  
  @Exclude()
  @Column()
  password: string;

  @Column({ default: '' })
  avatar?: string;

  @Column({ nullable: true })
  phone_number?: string;

  @Column({ default: Role.USER })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deleted_at?: Date;
}
