import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

let dbUrl = process.env.DATABASE_URL || '';
// Render's new postgres connections trigger a pg-connection-string warning.
if (dbUrl.includes('sslmode=require') && !dbUrl.includes('uselibpqcompat=1')) {
  dbUrl = dbUrl.replace('sslmode=require', 'sslmode=require&uselibpqcompat=1');
}

const pool = new Pool({
  connectionString: dbUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Diagnostic log to verify DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully at:', res.rows[0].now);
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export { pool };
