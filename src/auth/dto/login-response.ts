import { Field, ObjectType } from '@nestjs/graphql';
import { Customer } from '../../customer/entities/customer.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;

  @Field()
  customer: Customer;
}
