-- Migration: 002_admin_panel_tables.sql
-- Description: Add columns for banning and create tables for audit logs, inquiry replies, and announcements.

-- 1. Add ban columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_reason TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;

-- 2. Create inquiry_replies table
CREATE TABLE IF NOT EXISTS inquiry_replies (
  id SERIAL PRIMARY KEY,
  inquiry_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  replied_by_admin_id UUID REFERENCES users(id),
  replied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ
);

-- 4. Create admin_audit_log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id SERIAL PRIMARY KEY,
  admin_id UUID REFERENCES users(id),
  admin_email VARCHAR(255),
  action VARCHAR(255) NOT NULL,
  target_type VARCHAR(100),
  target_id VARCHAR(255),
  details JSONB,
  performed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create platform_settings table
CREATE TABLE IF NOT EXISTS platform_settings (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
