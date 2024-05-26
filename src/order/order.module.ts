import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { CustomerModule } from '../customer/customer.module';
import { IntervalScalar } from '../dto/interval.scalar';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    CustomerModule,
  ],
  providers: [OrderResolver, OrderService, IntervalScalar],
})
export class OrderModule {
}
