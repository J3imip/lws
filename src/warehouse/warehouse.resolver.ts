import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Warehouse)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {
  }

  @Query(() => [Warehouse])
  @UseGuards(JwtAuthGuard)
  warehouses() {
    return this.warehouseService.findAll();
  }

  @Mutation(() => Warehouse)
  createWarehouse(@Args('createWarehouseInput') createWarehouseInput: CreateWarehouseInput) {
    return this.warehouseService.createWarehouse(createWarehouseInput);
  }
}
