import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateOrderInput } from './create-order.input';
import { OrderStatus, PaymentMethod } from '../entities/order.entity';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @Field({ nullable: true })
  payment?: PaymentMethod;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  status?: OrderStatus;

  @Field({ nullable: true })
  receiptDate?: Date;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  address?: string;
}
