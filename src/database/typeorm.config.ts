import { join } from 'path';
import * as config from 'config';

const dbConfig = config.get('db');

const typeOrmConfig = {
  type: process.env.DB_TYPE || dbConfig.type,
  host: process.env.DB_HOST || dbConfig.host,
  port: process.env.DB_PORT || dbConfig.port,
  username: process.env.DB_USER || dbConfig.username,
  password: process.env.DB_PASS || dbConfig.password,
  database: process.env.DB_NAME || dbConfig.database,
  entities: [join(__dirname, '..', 'modules', '**', '*.entity.{js,ts}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  cli: {
    migrationsDir: join('src', 'database', 'migrations'),
  },
};

module.exports = typeOrmConfig;
