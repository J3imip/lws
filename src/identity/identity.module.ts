import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Identity } from './entities/identity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Identity])],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
