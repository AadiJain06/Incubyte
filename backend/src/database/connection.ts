import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../sweet_shop.db');

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Wrapper to make query interface similar to PostgreSQL
export const query = async (text: string, params: any[] = []) => {
  const start = Date.now();
  try {
    // SQLite uses ? placeholders, but we'll support both $1 and ? for compatibility
    let sql = text;
    const sqliteParams: any[] = [];
    
    // Convert PostgreSQL-style $1, $2, etc. to SQLite ? placeholders
    if (text.includes('$')) {
      sql = text.replace(/\$(\d+)/g, (match, num) => {
        const index = parseInt(num) - 1;
        if (index >= 0 && index < params.length) {
          sqliteParams.push(params[index]);
        }
        return '?';
      });
    } else {
      sqliteParams.push(...params);
    }

    // Determine if it's a SELECT query
    const trimmedSql = sql.trim().toUpperCase();
    const isSelect = trimmedSql.startsWith('SELECT');
    
    if (isSelect) {
      const stmt = db.prepare(sql);
      const rows = stmt.all(...sqliteParams);
      const duration = Date.now() - start;
      console.log('Executed query', { text: sql, duration, rows: rows.length });
      return { rows, rowCount: rows.length };
    } else {
      const stmt = db.prepare(sql);
      const result = stmt.run(...sqliteParams);
      const duration = Date.now() - start;
      console.log('Executed query', { text: sql, duration, changes: result.changes });
      return { 
        rows: [], 
        rowCount: result.changes || 0,
        lastInsertRowid: result.lastInsertRowid 
      };
    }
  } catch (error) {
    console.error('Database query error', { text, error });
    throw error;
  }
};

// Synchronous query for initialization
export const querySync = (text: string, params: any[] = []) => {
  try {
    let sql = text;
    const sqliteParams: any[] = [];
    
    if (text.includes('$')) {
      sql = text.replace(/\$(\d+)/g, (match, num) => {
        const index = parseInt(num) - 1;
        if (index >= 0 && index < params.length) {
          sqliteParams.push(params[index]);
        }
        return '?';
      });
    } else {
      sqliteParams.push(...params);
    }

    const trimmedSql = sql.trim().toUpperCase();
    const isSelect = trimmedSql.startsWith('SELECT');
    const stmt = db.prepare(sql);
    
    if (isSelect) {
      return { rows: stmt.all(...sqliteParams), rowCount: 0 };
    } else {
      return stmt.run(...sqliteParams);
    }
  } catch (error) {
    console.error('Database query error', { text, error });
    throw error;
  }
};

export const getClient = () => {
  return db;
};

export default db;
