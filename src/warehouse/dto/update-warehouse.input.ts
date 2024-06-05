import { Field, InputType } from '@nestjs/graphql';
import { WarehouseProductInput } from './create-warehouse.input';

@InputType()
export class UpdateWarehouseInput {
  @Field({ nullable: true })
  capacity?: number;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true})
  firstName?: string;

  @Field({ nullable: true})
  lastName?: string;

  @Field({ nullable: true})
  phone?: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => [WarehouseProductInput], { nullable: true })
  products: WarehouseProductInput[];
}

