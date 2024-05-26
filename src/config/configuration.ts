import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as session from 'express-session';

export default () => {
  const configFilePath = join(process.env.KV_FILE || 'config.yaml');
  return yaml.load(readFileSync(configFilePath, 'utf8')) as AppConfig;
};

export type AppConfig = {
  db: TypeOrmModuleOptions
  session: session.SessionOptions
  jwt: {
    accessSecret: string
    refreshSecret: string
    accessExpiresIn: string
    refreshExpiresIn: string
  }
  init: {
    admin: {
      primaryID: string
      password: string
    }
  }
};
