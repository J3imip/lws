import { Field, InputType } from '@nestjs/graphql';
import { PaymentMethod } from '../entities/order.entity';

@InputType()
export class OrderProductInput {
  @Field()
  productID: number;

  @Field()
  productQuantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field()
  payment: PaymentMethod;

  @Field()
  price: number;

  @Field()
  currency: string;

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
