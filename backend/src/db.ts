import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'uxlab_db',
  password: '1720',
  port: 5432,
});