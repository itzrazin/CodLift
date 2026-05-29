import { pool } from '../db';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database migrations...');
    
    // 1. Create migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Get all migration files
    const migrationsDir = path.resolve(__dirname, '../../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    // 3. Get already applied migrations
    const { rows: appliedMigrations } = await client.query('SELECT filename FROM migrations');
    const appliedFiles = new Set(appliedMigrations.map(m => m.filename));

    // 4. Run pending migrations
    for (const file of files) {
      if (appliedFiles.has(file)) {
        console.log(`⏩ Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`🚀 Applying ${file}...`);
      const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      
      await client.query('BEGIN');
      try {
        await client.query(migrationSQL);
        await client.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`✅ ${file} applied successfully!`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`❌ Error applying ${file}:`, err);
        throw err;
      }
    }
    
    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration process failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

runMigrations()
  .then(() => {
    pool.end();
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    pool.end().finally(() => process.exit(1));
  });
