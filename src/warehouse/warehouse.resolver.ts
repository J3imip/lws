import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { IdentityRole } from '../identity/entities/identity.entity';
import { RolesGuard } from '../auth/roles.guard';

@Resolver(() => Warehouse)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(IdentityRole.ADMIN)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {
  }

  @Query(() => [Warehouse])
  warehouses() {
    return this.warehouseService.findAll();
  }

  @Mutation(() => Warehouse)
  createWarehouse(@Args('createWarehouseInput') createWarehouseInput: CreateWarehouseInput) {
    return this.warehouseService.createWarehouse(createWarehouseInput);
  }
}
