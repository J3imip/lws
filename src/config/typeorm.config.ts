import configuration from './configuration';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = configuration();

const dataSourceOptions: DataSourceOptions = {
  ...config.db as DataSourceOptions,
  entities: ['./**/*.entity.ts'],
  migrations: ['./migrations/**/*.ts']
};

export default new DataSource(dataSourceOptions);
