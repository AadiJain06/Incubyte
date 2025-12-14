import { query } from './connection';
import fs from 'fs';
import path from 'path';

export const initializeDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Remove comments and split by semicolon
    const lines = schema.split('\n');
    const cleanedLines = lines
      .map(line => {
        // Remove inline comments
        const commentIndex = line.indexOf('--');
        if (commentIndex >= 0) {
          return line.substring(0, commentIndex).trim();
        }
        return line.trim();
      })
      .filter(line => line.length > 0);
    
    const fullSchema = cleanedLines.join(' ');
    
    // Split by semicolon and filter empty statements
    const statements = fullSchema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Execute statements sequentially
    for (const statement of statements) {
      if (statement) {
        try {
          await query(statement);
        } catch (error: any) {
          // Ignore "already exists" errors
          if (error.code === 'SQLITE_ERROR' && 
              (error.message.includes('already exists') || 
               error.message.includes('duplicate column name'))) {
            continue;
          }
          // Re-throw other errors
          throw error;
        }
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
