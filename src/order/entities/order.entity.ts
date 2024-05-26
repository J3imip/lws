import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { Customer } from '../../customer/entities/customer.entity';
import { IPostgresInterval } from 'postgres-interval';
import { IntervalScalar } from '../../dto/interval.scalar';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  SHIPPED = 'shipped',

  // finite states
  REJECTED = 'rejected',
  DELIVERED = 'delivered',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CARDS = 'cards',
  CRYPTO = 'crypto',
  CASH = 'cash',
}

@Entity()
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Field(() => Int)
  id: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  @Field()
  status: OrderStatus;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: false })
  @Field()
  payment: PaymentMethod;

  @Column({ type: 'bigint', nullable: false })
  @Field(() => Int)
  @Check(`price > 0`)
  price: number;

  @Column({ type: 'varchar', length: 6, nullable: false })
  @Field()
  currency: string;

  @Expose({ name: 'delivery_period' })
  @Column({ type: 'interval', nullable: true, name: 'delivery_period' })
  @Field(() => IntervalScalar)
  deliveryPeriod: IPostgresInterval;

  @Expose({ name: 'actual_delivery_period' })
  @Column({ type: 'interval', nullable: true, name: 'actual_delivery_period' })
  @Field(() => IntervalScalar)
  @Check(`actual_delivery_period > interval '0 days'`)
  actualDeliveryPeriod: IPostgresInterval;

  @Expose({ name: 'receipt_date' })
  @Column({ type: 'timestamp with time zone', nullable: false, name: 'receipt_date' })
  @Field()
  receiptDate: Date;

  @Expose({ name: 'refund_amount' })
  @Column({ type: 'bigint', nullable: true, name: 'refund_amount' })
  @Field(() => Int)
  @Check(`refund_amount >= 0`)
  refundAmount: number;

  @Column({ type: 'varchar', length: 2, nullable: false })
  @Field()
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  city: string;

  @Column({ type: 'text', nullable: false })
  @Field()
  address: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  @Field(() => Customer)
  customer: Customer;

  @Expose({ name: 'created_at' })
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  @Field()
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  @Field()
  updatedAt: Date;
}
