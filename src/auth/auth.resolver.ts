import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { RefreshTokenGuard } from './refresh-token.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginInput') _loginInput: LoginInput,
    @Context() context,
  ): Promise<LoginResponse> {
    return this.authService.login(context.user);
  }

  @Query(() => LoginResponse)
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Context() context): Promise<LoginResponse> {
    return this.authService.refreshToken(context.req.user);
  }
}
