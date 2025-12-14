import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

// Type definitions for query results
export interface QueryResult {
  rows: any[];
  rowCount: number;
  lastInsertRowid?: number;
}

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../sweet_shop.db');

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Helper functions to promisify sqlite3 callbacks
const dbAll = (sql: string, params: any[]): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const dbRun = (sql: string, params: any[]): Promise<{ changes: number; lastID: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ changes: this.changes, lastID: this.lastID });
    });
  });
};

// Wrapper to make query interface similar to PostgreSQL
export const query = async (text: string, params: any[] = []): Promise<QueryResult> => {
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
      const rows: any[] = await dbAll(sql, sqliteParams);
      const duration = Date.now() - start;
      console.log('Executed query', { text: sql, duration, rows: rows.length });
      return { rows, rowCount: rows.length };
    } else {
      const result = await dbRun(sql, sqliteParams);
      const duration = Date.now() - start;
      const changes = result.changes || 0;
      console.log('Executed query', { text: sql, duration, changes });
      return { 
        rows: [], 
        rowCount: changes,
        lastInsertRowid: result.lastID 
      };
    }
  } catch (error) {
    console.error('Database query error', { text, error });
    throw error;
  }
};

// Synchronous query for initialization (using callback-based API)
export const querySync = (text: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
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
      
      if (isSelect) {
        db.all(sql, sqliteParams, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows, rowCount: rows?.length || 0 });
        });
      } else {
        db.run(sql, sqliteParams, function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes, lastID: this.lastID });
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const getClient = () => {
  return db;
};

export default db;
