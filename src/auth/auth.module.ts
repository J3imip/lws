import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/configuration';
import { JwtStrategy } from './jwt.strategy';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [
    PassportModule,
    IdentityModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<AppConfig['jwt']>('jwt').secret,
        signOptions: { expiresIn: configService.get<AppConfig['jwt']>('jwt').expiresIn },
      }),
    })],
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
})
export class AuthModule {
}
