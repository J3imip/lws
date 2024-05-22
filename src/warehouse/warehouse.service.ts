import { Injectable } from '@nestjs/common';
import { Warehouse } from './entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { PaginationInput } from '../dto/pagination.input';

@Injectable()
export class WarehouseService {
  constructor(@InjectRepository(Warehouse) private readonly warehouseRepository: Repository<Warehouse>) {
  }

  async createWarehouse(createWarehouseInput: CreateWarehouseInput): Promise<Warehouse> {
    return this.warehouseRepository.save(
      this.warehouseRepository.create(createWarehouseInput),
    );
  }

  async findAll(paginationInput: PaginationInput): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      take: paginationInput.limit,
      skip: paginationInput.offset,
      order: {
        id: paginationInput.order,
      },
    });
  }
}
