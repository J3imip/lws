import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WarehouseModule } from './warehouse/warehouse.module';
import configuration from './config/configuration';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { IdentityService } from './identity/identity.service';
import { IdentityModule } from './identity/identity.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      load: [configuration],
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schemas/schema.gql'),
      driver: ApolloDriver,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    WarehouseModule,
    CustomerModule,
    AuthModule,
    IdentityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private readonly identityService: IdentityService) {
  }

  async onModuleInit() {
    await this.identityService.createMasterIdentity();
  }
}
