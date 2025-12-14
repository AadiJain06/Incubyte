import { query } from './connection';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const initializeDatabase = async () => {
  try {
    // In production (dist), __dirname is dist/database, so we need to go up to src/database
    // In development, __dirname is src/database
    let schemaPath = path.join(__dirname, 'schema.sql');
    
    // If file doesn't exist in dist, try the source directory
    if (!fs.existsSync(schemaPath)) {
      // Try going up from dist/database to src/database
      schemaPath = path.join(__dirname, '../../src/database/schema.sql');
    }
    
    // If still not found, try relative to process.cwd()
    if (!fs.existsSync(schemaPath)) {
      schemaPath = path.join(process.cwd(), 'src/database/schema.sql');
    }
    
    // Final fallback: try in backend/src/database
    if (!fs.existsSync(schemaPath)) {
      schemaPath = path.join(process.cwd(), 'backend/src/database/schema.sql');
    }
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found. Tried: ${schemaPath}`);
    }
    
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

    // Create default admin user if it doesn't exist
    await createDefaultAdmin();

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    
    // Check if admin already exists
    const existingAdmin = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    if (existingAdmin.rows.length === 0) {
      // Hash password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminId = uuidv4();
      
      // Insert admin user
      await query(
        'INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)',
        [adminId, adminEmail, hashedPassword, 'admin']
      );
      
      console.log('Default admin user created:');
      console.log('  Email: admin@example.com');
      console.log('  Password: admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
    // Don't throw - allow app to continue even if admin creation fails
  }
};
