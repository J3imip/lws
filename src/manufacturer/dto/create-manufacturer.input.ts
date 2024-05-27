import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateManufacturerInput {
  @Field()
  name: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  city: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  logo: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  category: string;
}
