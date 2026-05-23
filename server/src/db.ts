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
      // Run each ALTER TABLE separately — PostgreSQL doesn't support batching them
      const migrations = [
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255)`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(500)`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100)`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS level VARCHAR(20) DEFAULT 'beginner'`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS xp_total INTEGER DEFAULT 0`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS progress_data JSONB DEFAULT '{"completed_lessons": [], "current_xp": 0}'`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Building the future, one semi-colon at a time.'`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username VARCHAR(100)`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_username VARCHAR(100)`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(100) DEFAULT 'User:purple'`,
        // Sync role for any users who don't have it set yet
        `UPDATE users SET role = 'user' WHERE role IS NULL`,
      ];

      for (const sql of migrations) {
        try {
          await pool.query(sql);
        } catch (colErr: any) {
          // Ignore "already exists" errors, log anything else
          if (!colErr.message?.includes('already exists')) {
            console.warn('⚠️  Migration step warning:', colErr.message);
          }
        }
      }

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
        )
      `);

      // ── inquiries table ─────────────────────────────────────────────────────
      await pool.query(`
        CREATE TABLE IF NOT EXISTS inquiries (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255) DEFAULT 'General Inquiry',
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'Pending',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const progressMigrations = [
        `ALTER TABLE progress ADD COLUMN IF NOT EXISTS code_content TEXT`,
        `ALTER TABLE progress ADD COLUMN IF NOT EXISTS xp_earned INTEGER DEFAULT 0`,
        `ALTER TABLE progress ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false`,
        `ALTER TABLE progress ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false`,
        `ALTER TABLE progress ALTER COLUMN lesson_id TYPE VARCHAR(255)`,
        `ALTER TABLE progress ALTER COLUMN exercise_id TYPE VARCHAR(255)`,
        `UPDATE progress SET completed = is_completed WHERE completed IS NULL OR completed != is_completed`,
      ];

      for (const sql of progressMigrations) {
        try {
          await pool.query(sql);
        } catch (colErr: any) {
          if (!colErr.message?.includes('already exists')) {
            console.warn('⚠️  Progress migration warning:', colErr.message);
          }
        }
      }

      // Re-add unique constraint safely
      try {
        await pool.query(`ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_user_lesson_exercise_key`);
        await pool.query(`ALTER TABLE progress ADD CONSTRAINT progress_user_lesson_exercise_key UNIQUE(user_id, lesson_id, exercise_id)`);
      } catch (_) {}

      console.log('✅ Database schema verified/updated.');
    } catch (migrateErr: any) {
      console.error('⚠️  Schema migration warning:', migrateErr.message);
    }
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export { pool };
