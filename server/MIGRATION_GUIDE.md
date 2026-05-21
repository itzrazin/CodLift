# Database Migration Guide

## Overview
This guide explains how to update your database schema to support the new features:
- User roles (admin/user)
- Extended profile fields (name, address, profile_photo, bio, social links)
- Fixed missing account data (username, level, xp_total, avatar)

## Running the Migration

### Step 1: Backup Your Database (Recommended)
Before running any migration, backup your database:
```bash
# For PostgreSQL
pg_dump -U your_username -d your_database > backup_$(date +%Y%m%d).sql
```

### Step 2: Run the Migration Script
From the `server` directory, run:
```bash
npm run migrate
```

This will:
- Add the `role` column to the users table (defaults to 'user')
- Add missing profile columns (name, address, profile_photo, bio, github_username, linkedin_username)
- Make password and username nullable (for OAuth users)
- Sync existing `is_admin` values to the new `role` column
- Add the `completed` column to the progress table
- Create performance indexes for faster queries

### Step 3: Verify the Migration
Check that the migration was successful:
```sql
-- Check if role column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'role';

-- Check existing users
SELECT id, email, username, role, level, xp_total FROM users LIMIT 5;
```

### Step 4: Promote Users to Admin
To make a user an admin, run this SQL query:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Or use the admin API endpoint (requires existing admin access):
```bash
curl -X PUT http://localhost:5000/api/admin/users/{userId}/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

## What Changed

### Users Table
**New Columns:**
- `role` VARCHAR(20) DEFAULT 'user' - User role (admin/user)
- `name` VARCHAR(255) - Full name
- `address` TEXT - User address
- `profile_photo` TEXT - Profile photo URL
- `bio` TEXT - User biography
- `github_username` VARCHAR(100) - GitHub username
- `linkedin_username` VARCHAR(100) - LinkedIn username

**Modified Columns:**
- `password` - Now nullable (for OAuth users)
- `username` - Now nullable (for OAuth users)

**New Indexes:**
- `idx_users_role` - Faster admin queries
- `idx_users_last_login` - Faster active user queries
- `idx_users_created_at` - Faster new user queries

### Progress Table
**New Columns:**
- `completed` BOOLEAN DEFAULT false - Alias for is_completed

## API Changes

### Authentication Endpoints
All auth endpoints now return the full user object including:
- `id`, `name`, `username`, `email`
- `address`, `profile_photo`, `avatar`
- `role`, `level`, `xp_total`, `xp`
- `streak`, `longest_streak`
- `bio`, `github_username`, `linkedin_username`
- `created_at`, `last_login`

### New Admin Endpoints
**GET /api/admin/stats** (Admin only)
- Returns real-time dashboard statistics
- Total users, active users, completed lessons, total XP
- Daily active users for the last 7 days
- User growth percentage

**GET /api/admin/users** (Admin only)
- Returns paginated list of all users
- Query params: `page` (default: 1), `limit` (default: 20)

**PUT /api/admin/users/:userId/role** (Admin only)
- Update a user's role
- Body: `{ "role": "admin" | "user" }`

## Frontend Changes

### Admin Dashboard
- Now fetches real data from `/api/admin/stats`
- Shows loading state while fetching
- Shows error state if access is denied
- Displays real user counts, XP totals, and activity charts

### Route Protection
- New `AdminRoute` component checks `user.role === 'admin'`
- Non-admin users are redirected to `/dashboard`
- Unauthenticated users are redirected to `/login`

## Troubleshooting

### Migration Fails
If the migration fails, check:
1. Database connection is working
2. User has ALTER TABLE permissions
3. No conflicting column names exist

### Users Can't See Their Data
If users see missing data after login:
1. Check that the migration ran successfully
2. Verify the auth endpoints return all columns
3. Clear browser localStorage and re-login

### Admin Access Denied
If you can't access the admin dashboard:
1. Verify your user's role: `SELECT role FROM users WHERE email = 'your-email@example.com';`
2. Update role if needed: `UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';`
3. Clear browser cache and re-login to get a new JWT token

## Rollback (If Needed)

If you need to rollback the migration:
```sql
-- Remove new columns
ALTER TABLE users DROP COLUMN IF EXISTS role;
ALTER TABLE users DROP COLUMN IF EXISTS name;
ALTER TABLE users DROP COLUMN IF EXISTS address;
ALTER TABLE users DROP COLUMN IF EXISTS profile_photo;
ALTER TABLE users DROP COLUMN IF EXISTS bio;
ALTER TABLE users DROP COLUMN IF EXISTS github_username;
ALTER TABLE users DROP COLUMN IF EXISTS linkedin_username;

-- Restore NOT NULL constraints
ALTER TABLE users ALTER COLUMN password SET NOT NULL;
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Remove indexes
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_last_login;
DROP INDEX IF EXISTS idx_users_created_at;

-- Remove progress column
ALTER TABLE progress DROP COLUMN IF EXISTS completed;
```

Then restore from your backup:
```bash
psql -U your_username -d your_database < backup_YYYYMMDD.sql
```
