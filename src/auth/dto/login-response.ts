import { Field, ObjectType } from '@nestjs/graphql';
import { Identity } from '../../identity/entities/identity.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;

  @Field()
  identity: Identity;
}
