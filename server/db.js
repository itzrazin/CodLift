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
pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully at:', res.rows[0].now);
    
    // Auto-migration: Ensure OAuth columns exist
    try {
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id VARCHAR(255) UNIQUE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS xp_total INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
      `);
      console.log('✅ Database schema verified/updated.');
    } catch (migrateErr) {
      console.error('⚠️ Schema migration warning:', migrateErr.message);
    }
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
