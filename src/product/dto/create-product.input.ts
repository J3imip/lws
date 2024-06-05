import { Field, InputType, Int } from '@nestjs/graphql';


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

  @Field(() => Int)
  price: number;

  @Field(()=>Int)
  manufacturerId: number;
}
