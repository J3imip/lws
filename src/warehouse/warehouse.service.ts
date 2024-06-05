import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createWarehouseInput: CreateWarehouseInput): Promise<Warehouse> {
    const warehouse = this.warehouseRepository.create(createWarehouseInput);

    if (createWarehouseInput.products) {
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

      await this.warehouseRepository.manager.save(warehouseProducts);
    }

    const res = await this.warehouseRepository.save(warehouse);

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

  async delete(id: number) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id }, relations: ['warehouseProducts'] });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return await this.warehouseRepository.remove(warehouse);
  }

  // async update(id: number, updateWarehouseInput: UpdateWarehouseInput): Promise<Warehouse> {
  //   const warehouse = await this.warehouseRepository.findOne({ where: { id }, relations: ['warehouseProducts'] });
  //
  //   if (!warehouse) {
  //     throw new NotFoundException(`Warehouse with ID ${id} not found`);
  //   }
  //
  //   return await this.warehouseRepository.manager.transaction(async (manager) => {
  //     // Update warehouse properties
  //     Object.assign(warehouse, updateWarehouseInput);
  //
  //     if (updateWarehouseInput.products) {
  //       // Remove existing warehouseProducts
  //       await manager.delete(WarehouseProduct, { warehouse: { id: warehouse.id } });
  //
  //       // Create new warehouseProducts
  //       const warehouseProducts = updateWarehouseInput.products.map((warehouseProductInput) => {
  //         const product = new Product();
  //         product.id = warehouseProductInput.productID;
  //
  //         let warehouseProduct = {} as WarehouseProduct;
  //         warehouseProduct.warehouse = warehouse;
  //         warehouseProduct.product = product;
  //         warehouseProduct.productQuantity = warehouseProductInput.productQuantity;
  //
  //         return warehouseProduct;
  //       });
  //
  //       warehouse.warehouseProducts = warehouseProducts;
  //
  //       // Save new warehouseProducts
  //       await manager.save(WarehouseProduct, warehouseProducts);
  //     }
  //
  //     // Save updated warehouse
  //     return manager.save(Warehouse, warehouse);
  //   });
  // }
}
