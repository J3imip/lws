import { Field, ObjectType } from '@nestjs/graphql';
import { Identity } from '../../identity/entities/identity.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken?: string;

  @Field()
  identity?: Identity;
}
