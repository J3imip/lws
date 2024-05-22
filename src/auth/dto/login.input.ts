import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  primaryID: string;

  @Field()
  password: string;
}
