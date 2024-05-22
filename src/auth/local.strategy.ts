import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'primaryID',
      passwordField: 'password',
    });
  }

  async validate(primaryID: string, password: string): Promise<any> {
    const customer = await this.authService.validateUser(primaryID, password);
    if (!customer) {
      throw new UnauthorizedException();
    }

    return customer;
  }
}
