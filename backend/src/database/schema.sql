-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create sweets table
CREATE TABLE IF NOT EXISTS sweets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sweets_category ON sweets(category);
CREATE INDEX IF NOT EXISTS idx_sweets_name ON sweets(name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
