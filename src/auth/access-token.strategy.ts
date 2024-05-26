import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/configuration';
import { Identity } from '../identity/entities/identity.entity';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<AppConfig['jwt']>('jwt').accessSecret,
    });
  }

  async validate(payload: any): Promise<Partial<Identity>> {
    return {
      id: payload.sub,
      primaryID: payload.primaryID,
      role: payload.role,
    };
  }
}
