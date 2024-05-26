import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Identity } from '../identity/entities/identity.entity';
import { IdentityService } from '../identity/identity.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/configuration';
import { LoginResponse } from './dto/login-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly identityService: IdentityService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
  }

  async validateUser(primaryID: string, password: string) {
    const identity = await this.identityService.findOne({ primaryID });

    if (identity && await compare(password, identity.passwordHash)) {
      return identity;
    }

    return null;
  }

  async login(identity: Identity) {
    return this.getTokens(identity);
  }

  async refreshToken(identity: Identity): Promise<LoginResponse> {
    return {
      accessToken: await this.getAccessToken(identity),
      identity,
    }
  }

  async getAccessToken(identity: Identity) {
    return this.jwtService.signAsync({
      sub: identity.id,
      primaryID: identity.primaryID,
      role: identity.role,
    }, {
      secret: this.configService.get<AppConfig['jwt']>('jwt').accessSecret,
      expiresIn: this.configService.get<AppConfig['jwt']>('jwt').accessExpiresIn,
    });
  }

  async getTokens(identity: Identity) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(identity),
      this.jwtService.signAsync({
        sub: identity.id,
        primaryID: identity.primaryID,
        role: identity.role,
      }, {
        secret: this.configService.get<AppConfig['jwt']>('jwt').refreshSecret,
        expiresIn: this.configService.get<AppConfig['jwt']>('jwt').refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      identity,
    };
  }
}
