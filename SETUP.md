# Quick Setup Guide

## Prerequisites
- Node.js (v18+)
- npm (v9+)

**Note**: SQLite is included - no database server installation needed!

## Step-by-Step Setup

### 1. Database Setup
**No setup required!** The SQLite database will be automatically created when you start the backend server.

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
# Windows PowerShell:
Copy-Item env.example .env

# Linux/Mac:
cp env.example .env

# Edit .env file with your preferences (defaults work fine for development)
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
DATABASE_PATH=./sweet_shop.db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Note**: The database file will be created automatically at the `DATABASE_PATH` location.

### Frontend (.env - optional)
```
VITE_API_URL=http://localhost:3001/api
```

## Creating Admin User

After registering a user, update the role in the database:

**Using SQLite CLI:**
```bash
sqlite3 backend/sweet_shop.db
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
.quit
```

**Or using a SQLite GUI tool** (DB Browser for SQLite, etc.)

## Troubleshooting

### Database file not created
- Make sure the backend directory has write permissions
- Check that the `DATABASE_PATH` in `.env` is correct
- The database will be created automatically on first server start

### Port already in use
- Backend (3001): Change PORT in `backend/.env`
- Frontend (3000): Vite will automatically use the next available port
