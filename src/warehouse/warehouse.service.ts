import { Injectable } from '@nestjs/common';
import { Warehouse } from './entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { PaginationInput } from '../dto/pagination.input';
import { WarehouseProduct } from './entities/warehouse-product.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class WarehouseService {
  constructor(@InjectRepository(Warehouse) private readonly warehouseRepository: Repository<Warehouse>) {
  }

  async createWarehouse(createWarehouseInput: CreateWarehouseInput): Promise<Warehouse> {
    const warehouse = this.warehouseRepository.create(createWarehouseInput);

    const warehouseProducts = createWarehouseInput.products.map((warehouseProductInput) => {
      return new WarehouseProduct({
        warehouse,
        product: {
          id: warehouseProductInput.productID,
        } as Product,
        productQuantity: warehouseProductInput.productQuantity,
      });
    });

    warehouse.warehouseProducts = warehouseProducts;

    const res = await this.warehouseRepository.save(warehouse);
    await this.warehouseRepository.manager.save(warehouseProducts);

    return res;
  }

  async findAll(paginationInput: PaginationInput): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      relations: ['warehouseProducts', 'warehouseProducts.product'],
      take: paginationInput.limit,
      skip: paginationInput.offset,
      order: {
        id: paginationInput.order,
      },
    });
  }
}
