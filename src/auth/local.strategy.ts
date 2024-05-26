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
    const user = await this.authService.validateUser(primaryID, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
