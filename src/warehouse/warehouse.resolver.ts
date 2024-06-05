import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { AccessTokenGuard } from '../auth/access-token.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { IdentityRole } from '../identity/entities/identity.entity';
import { RolesGuard } from '../auth/roles.guard';
import { PaginationInput } from '../dto/pagination.input';

@Resolver(() => Warehouse)
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(IdentityRole.ADMIN)
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {
  }

  @Query(() => [Warehouse])
  warehouses(@Args('paginationInput', { nullable: true }) paginationInput: PaginationInput) {
    return this.warehouseService.findAll(paginationInput);
  }

  @Mutation(() => Warehouse)
  createWarehouse(@Args('createWarehouseInput') createWarehouseInput: CreateWarehouseInput) {
    return this.warehouseService.create(createWarehouseInput);
  }

  // @Mutation(() => Warehouse)
  // updateWarehouse(
  //   @Args('id') id: number,
  //   @Args('updateWarehouseInput') updateWarehouseInput: UpdateWarehouseInput
  // ) {
  //   return this.warehouseService.update(id, updateWarehouseInput);
  // }
}
