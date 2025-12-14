# Quick Setup Guide

## Prerequisites
- Node.js (v18+)
- PostgreSQL (v12+)
- npm (v9+)

## Step-by-Step Setup

### 1. Database Setup
```bash
# Create database
createdb sweet_shop_db

# Or using psql
psql -c "CREATE DATABASE sweet_shop_db;"

# Run schema (from project root)
psql -d sweet_shop_db -f backend/src/database/schema.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your database credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Access Application
Open http://localhost:3000 in your browser

## Environment Variables

### Backend (.env)
```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/sweet_shop_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (.env - optional)
```
VITE_API_URL=http://localhost:3001/api
```

## Creating Admin User

After registering a user, update the role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

