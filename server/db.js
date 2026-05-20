const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from parent directory (for Railway/Render deployments)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // also try local

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
pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully at:', res.rows[0].now);
    
    // Auto-migration: Ensure schema matches requirements
    try {
      await pool.query(`
        -- Add OAuth and Progress columns if missing
        ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS github_id VARCHAR(255) UNIQUE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS level VARCHAR(20) DEFAULT 'beginner';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS xp_total INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS progress_data JSONB DEFAULT '{"completed_lessons": [], "current_xp": 0}';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Building the future, one semi-colon at a time. Full-stack enthusiast and CSS wizard in training.';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username VARCHAR(100);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_username VARCHAR(100);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(100) DEFAULT 'User:purple';
        
        -- Create progress table if missing (with VARCHAR lesson_id)
        CREATE TABLE IF NOT EXISTS progress (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          lesson_id VARCHAR(255),
          exercise_id VARCHAR(255),
          code_content TEXT,
          xp_earned INTEGER DEFAULT 0,
          is_completed BOOLEAN DEFAULT false,
          completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, lesson_id, exercise_id)
        );

        -- Ensure columns exist in case table already existed
        ALTER TABLE progress ADD COLUMN IF NOT EXISTS code_content TEXT;
        ALTER TABLE progress ADD COLUMN IF NOT EXISTS xp_earned INTEGER DEFAULT 0;
        ALTER TABLE progress ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;
        ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_lesson_id_fkey;
        ALTER TABLE progress ALTER COLUMN lesson_id TYPE VARCHAR(255);
        ALTER TABLE progress ALTER COLUMN exercise_id TYPE VARCHAR(255);
        
        -- Crucial fix: Add UNIQUE constraint so ON CONFLICT works in UPSERTs
        ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_user_lesson_exercise_key;
        ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_user_id_lesson_id_exercise_id_key;
        ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_user_id_lesson_id_key;
        ALTER TABLE progress ADD CONSTRAINT progress_user_lesson_exercise_key UNIQUE(user_id, lesson_id, exercise_id);
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
