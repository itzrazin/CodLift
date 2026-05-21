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
    
    // Read migration file
    const migrationPath = path.resolve(__dirname, '../../migrations/001_add_role_and_profile_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // Execute migration
    await client.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('   - Added role column to users table');
    console.log('   - Added profile columns (name, address, profile_photo, bio, etc.)');
    console.log('   - Made password and username nullable for OAuth users');
    console.log('   - Synced is_admin with role column');
    console.log('   - Added completed column to progress table');
    console.log('   - Created performance indexes');
    console.log('');
    console.log('🔐 To make a user an admin, run:');
    console.log('   UPDATE users SET role = \'admin\' WHERE email = \'your-email@example.com\';');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
