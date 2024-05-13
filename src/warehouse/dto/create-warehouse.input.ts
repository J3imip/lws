import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateWarehouseInput {
  @Field({ nullable: true })
  capacity?: number;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  address?: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  email?: string;
}

