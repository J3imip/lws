import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

export enum IdentityRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

@Entity()
@ObjectType()
export class Identity {
  constructor(partial: Partial<Identity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(() => Int)
  id: number;

  @Expose({ name: 'primary_id' })
  @Column({ type: 'varchar', length: 16, name: 'primary_id', unique: true })
  @Field()
  primaryID: string; // for now, only phone

  @Expose({ name: 'password_hash' })
  @Column({ type: 'varchar', length: 72, name: 'password_hash' })
  @Field()
  passwordHash: string;

  @Column({ type: 'enum', enum: IdentityRole, default: IdentityRole.CUSTOMER })
  @Field()
  role: IdentityRole;

  @Expose({ name: 'created_at' })
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  @Field()
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  @Field()
  updatedAt: Date;
}
