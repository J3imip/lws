import { Field, InputType, Int } from '@nestjs/graphql';
import { PaymentMethod } from '../entities/order.entity';

@InputType()
export class OrderProductInput {
  @Field(() => Int)
  productID: number;

  @Field(() => Int)
  productQuantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field()
  payment: PaymentMethod;

  @Field()
  receiptDate: Date;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  address: string;

  @Field(() => [OrderProductInput])
  products: OrderProductInput[];
}
