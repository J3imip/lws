import { Field, InputType } from '@nestjs/graphql';
import { PaymentMethod } from '../entities/product.entity';

@InputType()
export class CreateProductInput {
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
}
