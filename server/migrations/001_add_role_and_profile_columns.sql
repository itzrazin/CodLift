-- Migration: Add role column and missing profile columns to users table
-- This migration adds the new columns needed for the updated schema

-- Add role column (defaults to 'user', admins will need to be set manually)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Add missing profile columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_username VARCHAR(100);

-- Make password and username nullable (for OAuth users)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
ALTER TABLE users ALTER COLUMN username DROP NOT NULL;

-- Update existing users: set role to 'admin' where is_admin is true
UPDATE users SET role = 'admin' WHERE is_admin = true;

-- Add completed column to progress table (alias for is_completed)
ALTER TABLE progress ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT false;

-- Sync completed with is_completed for existing records
UPDATE progress SET completed = is_completed WHERE completed IS NULL;

-- Create index on role for faster admin queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create index on last_login for active user queries
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);

-- Create index on created_at for new user queries
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);