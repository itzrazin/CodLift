-- Users Table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar TEXT,
  level VARCHAR(20) DEFAULT 'beginner',
  xp INTEGER DEFAULT 0,
  xp_total INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_login TIMESTAMPTZ,
  google_id VARCHAR(255) UNIQUE,
  github_id VARCHAR(255) UNIQUE,
  is_admin BOOLEAN DEFAULT false,
  goal VARCHAR(50),
  notifications BOOLEAN DEFAULT true,
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
  lesson_id INTEGER, -- Can be linked to lessons table or internal ID
  exercise_id VARCHAR(255),
  xp_earned INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id, exercise_id)
);

