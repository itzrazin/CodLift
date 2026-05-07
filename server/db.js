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

// Diagnostic log to verify DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully at:', res.rows[0].now);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
