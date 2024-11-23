import { Knex } from 'knex';
import path from 'path';


export const development: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname,'..', 'db', 'routes.db'),
  },
  migrations: {
    directory: path.resolve(__dirname, 'database', 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, 'database', 'seeds'),
  },
  useNullAsDefault: true,
};


