import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  category: string;

  @Field()
  volume: number;

  @Field()
  price: number;

  @Field()
  manufacturerId: number;
}
