import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { Product } from '../../product/entities/product.entity';

@Entity()
@ObjectType()
export class Manufacturer {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Expose({ name: 'first_name' })
  @Column({ type: 'varchar', length: 255, name: 'first_name'})
  @Field()
  firstName: string;

  @Expose({ name: 'last_name' })
  @Column({ type: 'varchar', length: 255, name: 'last_name'})
  @Field()
  lastName: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  @Field({ nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  logo: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  @Field({ nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  @Field({ nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  category: string;

  @OneToMany(() => Product, (product) => product.manufacturer)
  @Field(() => [Product], { nullable: true })
  products: Product[];

  @Expose({ name: 'created_at' })
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  @Field()
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  @Field()
  updatedAt: Date;
}
