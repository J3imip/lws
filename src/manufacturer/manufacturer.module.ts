import { Module } from '@nestjs/common';
import { ManufacturerResolver } from './manufacturer.resolver';
import { ManufacturerService } from './manufacturer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from './entities/manufacturer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer])],
  providers: [ManufacturerResolver, ManufacturerService],
})
export class ManufacturerModule {
}
