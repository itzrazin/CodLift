-- Users Table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  username VARCHAR(50) UNIQUE,
  address TEXT,
  profile_photo TEXT,
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'user',
  level VARCHAR(20) DEFAULT 'beginner',
  xp INTEGER DEFAULT 0,
  xp_total INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  bio TEXT,
  github_username VARCHAR(100),
  linkedin_username VARCHAR(100),
  last_login TIMESTAMPTZ,
  google_id VARCHAR(255) UNIQUE,
  github_id VARCHAR(255) UNIQUE,
  is_admin BOOLEAN DEFAULT false,
  goal VARCHAR(50),
  notifications BOOLEAN DEFAULT true,
  progress_data JSONB DEFAULT '{"completed_lessons": [], "current_xp": 0}',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  tier INTEGER NOT NULL,
  content TEXT NOT NULL,
  task TEXT NOT NULL,
  test_cases JSONB NOT NULL,
  order_index INTEGER NOT NULL
);

-- Progress Table
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(255), -- Slug from curriculum
  exercise_id VARCHAR(255),
  code_content TEXT,
  xp_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id, exercise_id)
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

