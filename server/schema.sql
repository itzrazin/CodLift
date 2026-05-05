-- Users Table (extended)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255),
  avatar VARCHAR(500),
  level VARCHAR(20) DEFAULT NULL,
  xp_total INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  google_id VARCHAR(255) UNIQUE,
  github_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress Table (exercise-level granularity)
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(50) NOT NULL,
  exercise_id INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  attempts INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  code_submitted TEXT,
  completed_at TIMESTAMP,
  UNIQUE(user_id, lesson_id, exercise_id)
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  badge_name VARCHAR(100) NOT NULL,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_name)
);

-- Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(50) NOT NULL,
  exercise_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id, exercise_id)
);
