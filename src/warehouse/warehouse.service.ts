import { Injectable } from '@nestjs/common';
import { Warehouse } from './entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWarehouseInput } from './dto/create-warehouse.input';

@Injectable()
export class WarehouseService {
  constructor(@InjectRepository(Warehouse) private readonly warehouseRepository: Repository<Warehouse>) {
  }

  async createWarehouse(createWarehouseInput: CreateWarehouseInput): Promise<Warehouse> {
    return this.warehouseRepository.save(
      this.warehouseRepository.create(createWarehouseInput),
    );
  }

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find();
  }
}
