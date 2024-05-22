import { SetMetadata } from '@nestjs/common';
import { IdentityRole } from '../identity/entities/identity.entity';

export const Roles = (...roles: IdentityRole[]) => SetMetadata('roles', roles);
