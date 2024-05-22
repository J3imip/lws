import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Identity } from '../identity/entities/identity.entity';
import { IdentityService } from '../identity/identity.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly identityService: IdentityService,
    private readonly jwtService: JwtService,
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
    return {
      token: this.jwtService.sign({
        primaryID: identity.primaryID,
        role: identity.role,
        sub: identity.id,
      }),
      identity,
    };
  }
}
