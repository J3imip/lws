import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity, JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Warehouse } from './warehouse.entity';

@Entity()
@ObjectType()
export class WarehouseProduct {
  constructor(partial: Partial<WarehouseProduct>) {
    Object.assign(this, partial);
  }

  @PrimaryColumn({ type: 'bigint' })
  @ManyToOne(() => Warehouse, (warehouse) => warehouse.warehouseProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouse' })
  @Field(() => Warehouse)
  warehouse: Warehouse;

  @PrimaryColumn({ type: 'bigint' })
  @ManyToOne(() => Product, (product) => product.warehouseProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product' })
  @Field(() => Product)
  product: Product;

  @Column({ type: 'int', nullable: false })
  @Field(() => Int)
  productQuantity: number;
}
