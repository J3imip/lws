import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Warehouse {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(() => Int)
  id: number;

  @Column({ type: 'numeric', nullable: true })
  @Field(() => Float, { nullable: true })
  capacity?: number;

  @Column({ type: 'varchar', length: 2 })
  @Field({ nullable: true })
  country?: string;

  @Column({ type: 'varchar', length: 255 })
  @Field({ nullable: true })
  city?: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  @Field()
  firstName: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  @Field()
  lastName: string;

  @Column({ type: 'varchar', length: 16 })
  @Field()
  phone: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  @Field()
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Field()
  updatedAt: Date;
}
