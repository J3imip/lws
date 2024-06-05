import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProductFilter {
  @Field({ nullable: true })
  onlyStored?: boolean
}
