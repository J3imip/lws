import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginInput } from './dto/login.input';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './refresh-token.guard';
import { IdentityRole } from '../identity/entities/identity.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }

  @Mutation(() => LoginResponse)
  async userLogin(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    const identity = await this.authService.validateUser(loginInput.primaryID, loginInput.password);
    if (!identity || identity.role !== IdentityRole.CUSTOMER) {
      throw new Error('Invalid credentials or unauthorized access');
    }
    return this.authService.login(identity);
  }

  @Mutation(() => LoginResponse)
  async adminLogin(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<LoginResponse> {
    const identity = await this.authService.validateUser(loginInput.primaryID, loginInput.password);
    if (!identity || identity.role !== IdentityRole.ADMIN) {
      throw new Error('Invalid credentials or unauthorized access');
    }
    return this.authService.login(identity);
  }

  @Query(() => LoginResponse)
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Context() context): Promise<LoginResponse> {
    return this.authService.refreshToken(context.req.user);
  }
}
