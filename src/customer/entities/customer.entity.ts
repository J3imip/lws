import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { Identity } from '../../identity/entities/identity.entity';

export enum CustomerStatus {
  KYC_PENDING = 'kyc_pending',
  KYC_APPROVED = 'kyc_approved',
  KYC_REJECTED = 'kyc_rejected',
  BANNED = 'banned',
}

@Entity()
@ObjectType()
export class Customer {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(() => Int)
  id: number;

  @Expose({ name: 'company_name' })
  @Column({ type: 'varchar', length: 255, name: 'company_name', nullable: true })
  @Field({ nullable: true })
  companyName: string;

  @Expose({ name: 'first_name' })
  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  @Field()
  firstName: string;

  @Expose({ name: 'last_name' })
  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  @Field()
  lastName: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 2 })
  @Field()
  country: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  city: string;

  @Column({ type: 'text' })
  @Field()
  address: string;

  @Column({ type: 'varchar', length: 16 })
  @Field()
  postal: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  photo: string;

  @Column({ type: 'enum', enum: ['kyc_pending', 'kyc_approved', 'kyc_rejected', 'banned'], default: 'kyc_pending' })
  @Field()
  status: CustomerStatus;

  @OneToOne(() => Identity, (identity) => identity.id)
  @JoinColumn({ name: 'identity' })
  identity: Identity;

  @Expose({ name: 'created_at' })
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  @Field()
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  @Field()
  updatedAt: Date;
}
