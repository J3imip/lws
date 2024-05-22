import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default () => {
  return yaml.load(readFileSync(join(process.env.KV_FILE || 'config.yaml'), 'utf8')) as AppConfig;
};

export type AppConfig = {
  db: TypeOrmModuleOptions
  jwt: {
    secret: string
    expiresIn: string
  }
  init: {
    admin: {
      primaryID: string
      password: string
    }
  }
};
