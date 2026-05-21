# System Architecture - Admin Security Implementation

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │  LoginPage   │───▶│ AuthContext  │───▶│  Dashboard   │    │
│  └──────────────┘    └──────────────┘    └──────────────┘    │
│                             │                                   │
│                             ▼                                   │
│                    ┌─────────────────┐                         │
│                    │  AdminRoute     │                         │
│                    │  (checks role)  │                         │
│                    └─────────────────┘                         │
│                             │                                   │
│                             ▼                                   │
│                    ┌─────────────────┐                         │
│                    │ AdminDashboard  │                         │
│                    │ (fetches stats) │                         │
│                    └─────────────────┘                         │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              │ HTTP + JWT Token
                              │
┌─────────────────────────────┼───────────────────────────────────┐
│                             ▼                                   │
│                    ┌─────────────────┐                         │
│                    │   API Gateway   │                         │
│                    │  (Express.js)   │                         │
│                    └─────────────────┘                         │
│                             │                                   │
│              ┌──────────────┼──────────────┐                   │
│              ▼              ▼              ▼                   │
│     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│     │ Auth Routes  │ │ User Routes  │ │ Admin Routes │       │
│     │ /api/auth/*  │ │ /api/user/*  │ │ /api/admin/* │       │
│     └──────────────┘ └──────────────┘ └──────────────┘       │
│              │              │              │                   │
│              ▼              ▼              ▼                   │
│     ┌──────────────────────────────────────────────┐          │
│     │           Middleware Layer                   │          │
│     │  ┌────────────────┐  ┌────────────────┐    │          │
│     │  │ authMiddleware │  │  isAdmin       │    │          │
│     │  │ (verify JWT)   │  │  (check role)  │    │          │
│     │  └────────────────┘  └────────────────┘    │          │
│     └──────────────────────────────────────────────┘          │
│              │              │              │                   │
│              ▼              ▼              ▼                   │
│     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│     │    Auth      │ │     User     │ │    Admin     │       │
│     │  Controller  │ │  Controller  │ │  Controller  │       │
│     └──────────────┘ └──────────────┘ └──────────────┘       │
│              │              │              │                   │
│              └──────────────┼──────────────┘                   │
│                             ▼                                   │
│                    ┌─────────────────┐                         │
│                    │  Database Pool  │                         │
│                    └─────────────────┘                         │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    └─────────────────┘
```

---

## 🔐 Authentication Flow

### Login Flow
```
User enters credentials
        │
        ▼
POST /api/auth/login
        │
        ▼
authController.login()
        │
        ├─▶ Query database for user
        ├─▶ Verify password (bcrypt)
        ├─▶ Generate JWT token (includes user.id)
        └─▶ Return token + user object
                │
                ▼
        Client stores token in localStorage
                │
                ▼
        Client includes token in all requests:
        Authorization: Bearer <token>
```

### Protected Route Flow
```
User navigates to /admin
        │
        ▼
AdminRoute component
        │
        ├─▶ Check if user exists (from AuthContext)
        ├─▶ Check if user.role === 'admin'
        │
        ├─▶ If not authenticated → redirect to /login
        ├─▶ If not admin → redirect to /dashboard
        └─▶ If admin → render AdminDashboard
```

### Admin API Request Flow
```
Client: GET /api/admin/stats
        │
        ▼
authMiddleware
        │
        ├─▶ Extract JWT from Authorization header
        ├─▶ Verify JWT signature
        ├─▶ Decode user.id from token
        ├─▶ Attach req.user = { id: user.id }
        │
        ├─▶ If invalid → 401 Unauthorized
        └─▶ If valid → next()
                │
                ▼
        isAdmin middleware
                │
                ├─▶ Query database: SELECT role FROM users WHERE id = req.user.id
                ├─▶ Check if role === 'admin'
                │
                ├─▶ If not admin → 403 Forbidden
                └─▶ If admin → next()
                        │
                        ▼
                adminController.getAdminStats()
                        │
                        ├─▶ Query database for statistics
                        ├─▶ Calculate metrics
                        └─▶ Return JSON response
```

---

## 🗄️ Database Schema

### Users Table
```sql
users
├── id (UUID, PK)
├── name (VARCHAR)
├── email (VARCHAR, UNIQUE)
├── password (VARCHAR, nullable)
├── username (VARCHAR, nullable)
├── address (TEXT)
├── profile_photo (TEXT)
├── avatar (TEXT)
├── role (VARCHAR) ◄── NEW: 'admin' or 'user'
├── level (VARCHAR)
├── xp (INTEGER)
├── xp_total (INTEGER)
├── streak (INTEGER)
├── longest_streak (INTEGER)
├── bio (TEXT)
├── github_username (VARCHAR)
├── linkedin_username (VARCHAR)
├── last_login (TIMESTAMPTZ)
├── google_id (VARCHAR, UNIQUE)
├── github_id (VARCHAR, UNIQUE)
├── is_admin (BOOLEAN) ◄── Legacy, synced with role
├── goal (VARCHAR)
├── notifications (BOOLEAN)
├── progress_data (JSONB)
└── created_at (TIMESTAMPTZ)

Indexes:
- idx_users_role (role)
- idx_users_last_login (last_login)
- idx_users_created_at (created_at)
```

### Progress Table
```sql
progress
├── id (SERIAL, PK)
├── user_id (UUID, FK → users.id)
├── lesson_id (VARCHAR)
├── exercise_id (VARCHAR)
├── code_content (TEXT)
├── xp_earned (INTEGER)
├── completed (BOOLEAN) ◄── NEW: Alias for is_completed
├── is_completed (BOOLEAN)
└── completed_at (TIMESTAMPTZ)

Unique: (user_id, lesson_id, exercise_id)
```

---

## 🔒 Security Layers

### Layer 1: Frontend Route Protection
```javascript
// AdminRoute component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  
  return children;
};
```

**Purpose:** Prevent unauthorized users from seeing admin UI
**Limitation:** Can be bypassed by modifying client code
**Why it's not enough:** Client-side security is not real security

### Layer 2: JWT Authentication
```typescript
// authMiddleware
const token = req.header('Authorization').split(' ')[1];
const decoded = jwt.verify(token, JWT_SECRET);
req.user = { id: decoded.id };
```

**Purpose:** Verify the user is authenticated
**Limitation:** Doesn't check if user is admin
**Why it's not enough:** Any authenticated user could access admin endpoints

### Layer 3: Role Verification (Database)
```typescript
// isAdmin middleware
const result = await db.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
if (result.rows[0].role !== 'admin') {
  return res.status(403).json({ error: 'Forbidden' });
}
```

**Purpose:** Verify the user has admin role in database
**Why it's secure:** 
- Role is stored in database (server-side)
- Cannot be modified by client
- Checked on every request
- Even if JWT is stolen, role is verified from database

---

## 📊 Admin Statistics Queries

### Total Users
```sql
SELECT COUNT(*) FROM users;
```

### Active Users (7 days)
```sql
SELECT COUNT(*) FROM users 
WHERE last_login >= NOW() - INTERVAL '7 days';
```

### Completed Lessons
```sql
SELECT COUNT(*) FROM progress 
WHERE completed = true;
```

### Total XP
```sql
SELECT SUM(xp_total) FROM users;
```

### New Users This Week
```sql
SELECT COUNT(*) FROM users 
WHERE created_at >= NOW() - INTERVAL '7 days';
```

### Daily Active Users
```sql
SELECT 
  DATE(last_login) as date,
  COUNT(*) as count
FROM users
WHERE last_login >= NOW() - INTERVAL '7 days'
GROUP BY DATE(last_login)
ORDER BY date ASC;
```

---

## 🚀 Request/Response Examples

### Login Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "Admin User",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "level": "advanced",
    "xp_total": 5000,
    "xp": 500,
    "streak": 10,
    "avatar": "https://...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Admin Stats Request
```http
GET /api/admin/stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Admin Stats Response
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1234,
    "activeUsers": 567,
    "completedLessons": 8901,
    "totalXp": 456789,
    "avgXp": 370,
    "newUsers": 45,
    "userGrowth": 12,
    "dailyActiveUsers": [
      { "date": "2024-01-15", "count": 120 },
      { "date": "2024-01-16", "count": 135 }
    ],
    "adminCount": 3
  }
}
```

---

## 🔄 Data Flow: User Login to Admin Dashboard

```
1. User enters credentials
   └─▶ POST /api/auth/login

2. Server verifies credentials
   ├─▶ Query database for user
   ├─▶ Verify password
   ├─▶ Generate JWT token
   └─▶ Return token + user object (includes role)

3. Client stores token and user
   ├─▶ localStorage.setItem('token', token)
   └─▶ AuthContext updates with user object

4. User navigates to /admin
   └─▶ AdminRoute checks user.role === 'admin'

5. AdminDashboard mounts
   └─▶ useEffect triggers

6. Fetch admin stats
   └─▶ GET /api/admin/stats (with JWT token)

7. Server validates request
   ├─▶ authMiddleware verifies JWT
   ├─▶ isAdmin checks role in database
   └─▶ adminController queries statistics

8. Server returns stats
   └─▶ Response with real data

9. Client updates UI
   └─▶ Display real statistics
```

---

## 🎯 Key Design Decisions

### Why JWT?
- Stateless authentication
- No session storage needed
- Scales horizontally
- Contains user.id for quick lookups

### Why Database Role Check?
- Cannot be tampered with by client
- Single source of truth
- Can be updated without re-login (after token expires)
- Supports role changes in real-time

### Why Both Frontend and Backend Protection?
- Frontend: Better UX (immediate redirect)
- Backend: Real security (cannot be bypassed)
- Defense in depth

### Why Migration System?
- Safe schema updates
- Idempotent (can run multiple times)
- Version controlled
- Rollback capability

---

## 📈 Performance Considerations

### Database Indexes
```sql
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_last_login ON users(last_login);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Impact:**
- Faster admin queries (role filtering)
- Faster active user queries (last_login filtering)
- Faster growth calculations (created_at filtering)

### Query Optimization
- Use COUNT(*) instead of fetching all rows
- Use aggregations (SUM, AVG) in database
- Pagination for user lists
- Date range filtering with indexes

### Caching Opportunities
- Admin stats can be cached (5-10 minute TTL)
- User list can be cached per page
- Role checks could be cached (short TTL)

---

## 🔮 Future Enhancements

### Planned Features
- [ ] User search and filtering
- [ ] Bulk user operations
- [ ] Audit log for admin actions
- [ ] Email notifications for role changes
- [ ] System health monitoring
- [ ] Database backup/restore UI
- [ ] Advanced analytics dashboard

### Scalability Improvements
- [ ] Redis caching for stats
- [ ] Read replicas for analytics
- [ ] Background jobs for heavy queries
- [ ] WebSocket for real-time updates
- [ ] GraphQL for flexible queries

---

This architecture provides a secure, scalable foundation for admin functionality while maintaining simplicity and clarity.
