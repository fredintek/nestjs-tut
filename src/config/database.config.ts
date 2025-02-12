import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'alfred',
  database: process.env.DATABASE_NAME || 'nestjs-blog',
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoloadEntities:
    process.env.DATABASE_AUTOLOAD_ENTITIES === 'true' ? true : false,
}));
