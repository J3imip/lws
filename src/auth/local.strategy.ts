import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phone',
      passwordField: 'password',
    });
  }

  async validate(phone: string, password: string): Promise<any> {
    const customer = await this.authService.validateUser(phone, password);
    // TODO: Add identity table, add identity to customer and admin to consider the role
    if (!customer) {
      throw new UnauthorizedException();
    }

    return customer;
  }
}
