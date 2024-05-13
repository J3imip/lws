import { CreateCustomerInput } from './create-customer.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CustomerStatus } from '../entities/customer.entity';

@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  @Field({ nullable: true })
  companyName?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  postal?: string;

  @Field({ nullable: true })
  photo?: string;

  @Field({ nullable: true })
  status?: CustomerStatus;
}
