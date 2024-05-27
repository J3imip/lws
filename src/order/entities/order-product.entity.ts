import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Order } from './order.entity';

@Entity()
@ObjectType()
export class OrderProduct {
  constructor(partial: Partial<OrderProduct>) {
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'bigint' })
  @ManyToOne(() => Order, (order) => order.orderProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order' })
  @Field(() => Order)
  order: Order;

  @PrimaryColumn({ type: 'bigint' })
  @ManyToOne(() => Product, (product) => product.orderProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product' })
  @Field(() => Product)
  product: Product;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int)
  productQuantity: number;
}
