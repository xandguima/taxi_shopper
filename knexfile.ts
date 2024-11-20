import  { Knex } from 'knex';
import path from 'path';

export const development: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: path.resolve(__dirname,'src', 'database', 'routes.db')
  },
  migrations: {
    directory: path.resolve(__dirname,'src', 'database', 'migrations')
  },
  useNullAsDefault: true
};


