import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateOrderInput } from './create-order.input';
import { PaymentMethod } from '../entities/order.entity';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @Field({ nullable: true })
  payment?: PaymentMethod;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  receiptDate?: Date;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  address?: string;
}
