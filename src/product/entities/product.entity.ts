import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { Manufacturer } from '../../manufacturer/entities/manufacturer.entity';
import { OrderProduct } from '../../order/entities/order-product.entity';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { WarehouseProduct } from '../../warehouse/entities/warehouse-product.entity';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(() => Int)
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  name: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  @Field({ nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Field({ nullable: true })
  category: string;

  @Column({ type: 'numeric' })
  @Field()
  volume: number;

  @Column({ type: 'bigint' })
  @Field()
  price: number;

  @Column({ type: 'varchar', length: 3 })
  @Field()
  currency: string;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products, { nullable: false })
  @JoinColumn({ name: 'manufacturer' })
  @Field(() => Manufacturer)
  manufacturer: Manufacturer;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  @Field(() => [OrderProduct], { nullable: true })
  orderProducts: OrderProduct[];

  @OneToMany(() => WarehouseProduct, (warehouseProduct) => warehouseProduct.product)
  @Field(() => [WarehouseProduct], { nullable: true })
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
