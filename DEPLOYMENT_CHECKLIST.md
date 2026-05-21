# 🚀 Deployment Checklist

## Pre-Deployment

### 1. Backup Database ✅
```bash
# PostgreSQL backup
pg_dump -U your_username -d your_database > backup_$(date +%Y%m%d).sql

# Or use your hosting provider's backup feature
```

### 2. Review Changes ✅
- [ ] Read `IMPLEMENTATION_SUMMARY.md`
- [ ] Read `QUICK_START.md`
- [ ] Understand what changed

### 3. Test Locally (Optional but Recommended) ✅
```bash
# Run migration
cd server
npm run migrate

# Build server
npm run build

# Start server
npm run dev

# In another terminal, build client
cd client
npm run build
npm run dev
```

---

## Deployment Steps

### Step 1: Database Migration ✅

#### Option A: Local Database
```bash
cd server
npm run migrate
```

#### Option B: Railway Database
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migration
railway run npm run migrate
```

#### Option C: Render Database
```bash
# Go to Render Dashboard
# Open your service
# Click "Shell"
# Run:
npm run migrate
```

#### Option D: Manual SQL
```sql
-- Copy the contents of server/migrations/001_add_role_and_profile_columns.sql
-- Paste into your database client (pgAdmin, DBeaver, etc.)
-- Execute
```

**Verify Migration:**
```sql
-- Check role column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'role';

-- Should return: role | character varying
```

---

### Step 2: Promote Admin User ✅

```sql
-- Replace with your email
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

-- Verify
SELECT email, role FROM users WHERE role = 'admin';
```

**Important:** You must do this BEFORE deploying, or you won't be able to access the admin dashboard!

---

### Step 3: Deploy Backend ✅

#### Option A: Railway
```bash
# Push to GitHub
git add .
git commit -m "feat: implement admin security and fix missing data bug"
git push origin main

# Railway will auto-deploy
# Wait for deployment to complete
```

#### Option B: Render
```bash
# Push to GitHub
git add .
git commit -m "feat: implement admin security and fix missing data bug"
git push origin main

# Render will auto-deploy
# Wait for deployment to complete
```

#### Option C: Manual
```bash
cd server
npm run build
npm start
```

**Verify Backend:**
```bash
# Health check
curl https://your-backend-url.com/

# Should return: {"status":"CodLift API is running","timestamp":"..."}
```

---

### Step 4: Deploy Frontend ✅

#### Option A: Vercel
```bash
# Push to GitHub (if not already done)
git push origin main

# Vercel will auto-deploy
# Wait for deployment to complete
```

#### Option B: Manual
```bash
cd client
npm run build

# Upload dist/ folder to your hosting provider
```

**Verify Frontend:**
- Visit your frontend URL
- Should load without errors

---

## Post-Deployment Verification

### Test 1: Old Account Data ✅
- [ ] Login with an existing account
- [ ] Verify you can see:
  - [ ] Username
  - [ ] Level
  - [ ] XP Total
  - [ ] Avatar
  - [ ] Streak

**If data is missing:**
1. Check server logs for errors
2. Verify migration ran successfully
3. Check that latest code is deployed
4. Try clearing localStorage and re-login

---

### Test 2: Admin Access (Non-Admin User) ✅
- [ ] Login with a regular user account
- [ ] Try to navigate to `/admin`
- [ ] Should be redirected to `/dashboard`
- [ ] Open browser console, should see no errors

**If you can access admin page:**
1. Check that AdminRoute is implemented in App.jsx
2. Check that user.role is being returned from login
3. Clear cache and try again

---

### Test 3: Admin Access (Admin User) ✅
- [ ] Clear browser localStorage
- [ ] Login with your admin account
- [ ] Navigate to `/admin`
- [ ] Should see admin dashboard
- [ ] Verify real statistics are displayed:
  - [ ] Total Learners (should be a real number)
  - [ ] Active Users (should be a real number)
  - [ ] Completed Lessons (should be a real number)
  - [ ] Total XP Earned (should be a real number)
  - [ ] Daily activity chart (should show real data)

**If you see "Access Denied":**
1. Verify your role in database: `SELECT role FROM users WHERE email = 'your@email.com';`
2. If role is not 'admin', run: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com';`
3. Clear localStorage and re-login

**If you see fake/hardcoded data:**
1. Check browser console for errors
2. Check Network tab for failed API requests
3. Verify backend is deployed and running
4. Check that `/api/admin/stats` endpoint is accessible

---

### Test 4: Admin API Endpoints ✅

#### Get Admin Stats
```bash
# Get your JWT token from localStorage
# Then test the endpoint:

curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  https://your-backend-url.com/api/admin/stats
```

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 123,
    "activeUsers": 45,
    "completedLessons": 678,
    "totalXp": 12345,
    ...
  }
}
```

#### Get Users List
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  https://your-backend-url.com/api/admin/users?page=1&limit=10
```

**Expected Response:**
```json
{
  "success": true,
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalUsers": 123,
    "totalPages": 13
  }
}
```

---

### Test 5: Security ✅

#### Test Non-Admin Access to API
```bash
# Login as regular user, get token
# Try to access admin endpoint:

curl -H "Authorization: Bearer REGULAR_USER_TOKEN" \
  https://your-backend-url.com/api/admin/stats
```

**Expected Response:**
```json
{
  "error": "Forbidden: Admin access required"
}
```

**Status Code:** 403

#### Test Unauthenticated Access
```bash
curl https://your-backend-url.com/api/admin/stats
```

**Expected Response:**
```json
{
  "error": "Unauthorized"
}
```

**Status Code:** 401

---

## Troubleshooting

### Issue: Migration fails
**Symptoms:** Error when running `npm run migrate`

**Solutions:**
1. Check database connection:
   ```bash
   # Test connection
   psql $DATABASE_URL
   ```
2. Check environment variables are set
3. Check database user has ALTER TABLE permissions
4. Try running migration SQL manually

---

### Issue: "Column role does not exist"
**Symptoms:** Server error: `column "role" does not exist`

**Solutions:**
1. Migration didn't run successfully
2. Run migration again: `npm run migrate`
3. Verify column exists: `\d users` in psql

---

### Issue: Admin dashboard shows "Access Denied"
**Symptoms:** Admin user sees "Access Denied" message

**Solutions:**
1. Check user role:
   ```sql
   SELECT email, role FROM users WHERE email = 'your@email.com';
   ```
2. Update role if needed:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```
3. Clear localStorage
4. Re-login to get new token with updated role

---

### Issue: Old account data still missing
**Symptoms:** Username, level, XP not showing after login

**Solutions:**
1. Check server logs for errors
2. Verify latest code is deployed
3. Test login endpoint manually:
   ```bash
   curl -X POST https://your-backend-url.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```
4. Check response includes all fields
5. Clear browser cache and localStorage
6. Re-login

---

### Issue: Admin dashboard shows fake data
**Symptoms:** Dashboard shows hardcoded numbers like "12,402" instead of real data

**Solutions:**
1. Check browser console for errors
2. Check Network tab for failed API requests
3. Verify `/api/admin/stats` endpoint is accessible
4. Check server logs for errors
5. Verify admin routes are registered in server/src/index.ts
6. Restart server

---

### Issue: Can't access admin page as admin
**Symptoms:** Admin user is redirected to /dashboard

**Solutions:**
1. Check that user.role is 'admin' in database
2. Clear localStorage
3. Re-login to get fresh token
4. Check browser console for errors
5. Verify AdminRoute component is implemented

---

## Success Criteria

All checks must pass:

### Backend ✅
- [ ] Migration completed without errors
- [ ] At least one admin user exists
- [ ] Server starts without errors
- [ ] Health check endpoint works
- [ ] Admin stats endpoint works (with admin token)
- [ ] Admin stats endpoint returns 403 (with regular user token)
- [ ] Admin stats endpoint returns 401 (without token)

### Frontend ✅
- [ ] Frontend loads without errors
- [ ] Login works
- [ ] Old accounts show username/level/XP
- [ ] Regular users cannot access /admin
- [ ] Admin users can access /admin
- [ ] Admin dashboard shows real data
- [ ] No console errors

### Database ✅
- [ ] role column exists
- [ ] name, address, profile_photo columns exist
- [ ] bio, github_username, linkedin_username columns exist
- [ ] completed column exists in progress table
- [ ] Indexes created (idx_users_role, etc.)
- [ ] At least one user has role='admin'

---

## Rollback Plan

If something goes wrong and you need to rollback:

### 1. Revert Code
```bash
git revert HEAD
git push origin main
```

### 2. Rollback Database (if needed)
```bash
# Restore from backup
psql -U your_username -d your_database < backup_YYYYMMDD.sql
```

### 3. Clear Caches
- Clear Vercel cache
- Clear Railway/Render cache
- Clear browser localStorage
- Restart all services

---

## Final Checklist

Before marking as complete:

- [ ] Database migration successful
- [ ] At least one admin user exists
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Old accounts show all data
- [ ] Admin dashboard shows real data
- [ ] Security tests pass
- [ ] No errors in logs
- [ ] Documentation reviewed
- [ ] Team notified (if applicable)

---

## 🎉 Deployment Complete!

If all checks pass, your deployment is successful!

**What's Next?**
- Monitor server logs for errors
- Monitor user feedback
- Check admin dashboard regularly
- Plan future enhancements

**Need Help?**
- Check `IMPLEMENTATION_SUMMARY.md` for overview
- Check `BUG_FIX_IMPLEMENTATION.md` for details
- Check `server/MIGRATION_GUIDE.md` for migration help
- Check `ARCHITECTURE.md` for system design

---

**Deployed by:** _________________  
**Date:** _________________  
**Time:** _________________  
**Status:** ☐ Success  ☐ Failed  ☐ Partial
