# Deployment Guide

## Quick Start

### 1. Run Database Migration
```bash
cd server
npm run migrate
```

### 2. Promote Your Account to Admin
```sql
-- Connect to your database and run:
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 3. Rebuild and Deploy

#### Backend (Railway/Render)
```bash
cd server
npm run build
npm start
```

#### Frontend (Vercel)
```bash
cd client
npm run build
```

### 4. Test Admin Access
1. Clear browser localStorage
2. Login with your admin account
3. Navigate to `/admin`
4. You should see real statistics from your database

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database
# Or individual variables:
PGHOST=your-host
PGPORT=5432
PGUSER=your-user
PGPASSWORD=your-password
PGDATABASE=your-database

# JWT
JWT_SECRET=your-secret-key

# Client URL
CLIENT_URL=https://your-frontend-url.com

# OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend-url.com/api/auth/google/callback
```

### Frontend (.env.local)
```env
VITE_API_URL=https://your-backend-url.com
```

## Deployment Platforms

### Railway (Backend)
1. Push changes to GitHub
2. Railway will auto-deploy
3. Run migration manually:
   - Go to Railway dashboard
   - Open your service
   - Go to "Settings" → "Variables"
   - Add a new deployment trigger or use the CLI:
   ```bash
   railway run npm run migrate
   ```

### Render (Backend)
1. Push changes to GitHub
2. Render will auto-deploy
3. Run migration via Shell:
   - Go to Render dashboard
   - Open your service
   - Click "Shell"
   - Run: `npm run migrate`

### Vercel (Frontend)
1. Push changes to GitHub
2. Vercel will auto-deploy
3. No additional steps needed

## Post-Deployment Checklist

- [ ] Migration completed successfully
- [ ] At least one admin user exists
- [ ] Backend health check works: `GET /`
- [ ] Admin stats endpoint works: `GET /api/admin/stats` (with admin token)
- [ ] Frontend loads without errors
- [ ] Login works and returns all user data
- [ ] Admin dashboard shows real statistics
- [ ] Non-admin users cannot access `/admin`

## Rollback Plan

If something goes wrong:

1. **Revert Code Changes**
   ```bash
   git revert HEAD
   git push
   ```

2. **Rollback Database** (if needed)
   ```bash
   psql -U your_username -d your_database < backup_YYYYMMDD.sql
   ```

3. **Clear Caches**
   - Clear Vercel cache
   - Clear Railway/Render cache
   - Clear browser localStorage

## Monitoring

### Check Backend Health
```bash
curl https://your-backend-url.com/
```

### Check Admin Endpoint
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  https://your-backend-url.com/api/admin/stats
```

### Check Database
```sql
-- Verify role column
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'role';

-- Check admin users
SELECT email, role FROM users WHERE role = 'admin';

-- Check user counts
SELECT COUNT(*) FROM users;
```

## Common Issues

### Issue: "column role does not exist"
**Cause:** Migration not run
**Solution:** Run `npm run migrate` in server directory

### Issue: "Access Denied" on admin dashboard
**Cause:** User role not set to admin
**Solution:** 
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```
Then clear localStorage and re-login.

### Issue: Old data still missing
**Cause:** Auth endpoints not returning all columns
**Solution:** Verify the latest code is deployed and restart the server

### Issue: Migration fails on Railway/Render
**Cause:** Database connection issues
**Solution:** 
1. Check DATABASE_URL is set correctly
2. Check database is accessible from the platform
3. Try running migration locally first to test

## Support

If you encounter issues:
1. Check server logs for errors
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure database migration completed
5. Try clearing all caches and re-deploying
