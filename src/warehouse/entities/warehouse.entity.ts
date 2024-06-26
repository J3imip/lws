import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { WarehouseProduct } from './warehouse-product.entity';

@Index(['country', 'city', 'address'], { unique: true })
@Entity()
@ObjectType()
export class Warehouse {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(() => Int, {nullable: true})
  id: number;

  @Column({ type: 'numeric', nullable: true })
  @Field(() => Float, { nullable: true })
  capacity?: number;

  @Column({ type: 'varchar', length: 2 })
  @Field()
  country: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  city: string;

  @Column({ type: 'text' })
  @Field()
  address: string;

  @Expose({ name: 'postal_code' })
  @Column({ type: 'varchar', length: 255, name: 'first_name' })
  @Field()
  firstName: string;

  @Expose({ name: 'last_name' })
  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  @Field()
  lastName: string;

  @Column({ type: 'varchar', length: 16 })
  @Field()
  phone: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  @Field({ nullable: true })
  email?: string;

  @OneToMany(() => WarehouseProduct, (warehouseProduct) => warehouseProduct.warehouse)
  @Field(() => [WarehouseProduct])
  warehouseProducts: WarehouseProduct[];

  @Expose({ name: 'created_at' })
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  @Field()
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  @Field()
  updatedAt: Date;
}
