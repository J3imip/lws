import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Identity, IdentityRole } from './entities/identity.entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/configuration';

@Injectable()
export class IdentityService {
  constructor(
    @InjectRepository(Identity) private readonly identityRepository: Repository<Identity>,
    private readonly configService: ConfigService,
  ) {
  }

  findOne(options: FindOptionsWhere<Identity>[] | FindOptionsWhere<Identity>) {
    return this.identityRepository.findOne({ where: options });
  }

  async createMasterIdentity() {
    const primaryID = this.configService.get<AppConfig['init']>('init').admin.primaryID;

    const identityExists = await this.identityRepository.exists({
      where: {
        primaryID,
      },
    });

    if (identityExists) {
      return;
    }

    await this.identityRepository.save(new Identity({
      primaryID,
      role: IdentityRole.ADMIN,
      passwordHash: await bcrypt.hash(
        this.configService.get<AppConfig['init']>('init').admin.password,
        10,
      ),
    }));
  }
}
