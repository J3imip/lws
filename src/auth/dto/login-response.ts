import { Field, ObjectType } from '@nestjs/graphql';
import { Identity } from '../../identity/entities/identity.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true})
  identity?: Identity;
}
