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
pool.query('SELECT NOW()', async (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully at:', res.rows[0].now);

    try {
      // ── users table ────────────────────────────────────────────────────────
      // Core identity columns
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(500);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

        -- role: 'user' (default) or 'admin'
        ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

        -- Legacy columns kept for backward compatibility with existing data
        ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS level VARCHAR(20) DEFAULT 'beginner';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS xp_total INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS progress_data JSONB DEFAULT '{"completed_lessons": [], "current_xp": 0}';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Building the future, one semi-colon at a time.';
        ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username VARCHAR(100);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_username VARCHAR(100);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(100) DEFAULT 'User:purple';
      `);

      // ── progress table ─────────────────────────────────────────────────────
      await pool.query(`
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

        ALTER TABLE progress ADD COLUMN IF NOT EXISTS code_content TEXT;
        ALTER TABLE progress ADD COLUMN IF NOT EXISTS xp_earned INTEGER DEFAULT 0;
        ALTER TABLE progress ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;
        ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_lesson_id_fkey;
        ALTER TABLE progress ALTER COLUMN lesson_id TYPE VARCHAR(255);
        ALTER TABLE progress ALTER COLUMN exercise_id TYPE VARCHAR(255);

        ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_user_lesson_exercise_key;
        ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_user_id_lesson_id_exercise_id_key;
        ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_user_id_lesson_id_key;
        ALTER TABLE progress ADD CONSTRAINT progress_user_lesson_exercise_key UNIQUE(user_id, lesson_id, exercise_id);
      `);

      console.log('✅ Database schema verified/updated.');
    } catch (migrateErr: any) {
      console.error('⚠️  Schema migration warning:', migrateErr.message);
    }
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export { pool };
