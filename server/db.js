const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from parent directory (for Railway/Render deployments)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // also try local

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
