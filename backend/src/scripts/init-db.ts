import dotenv from 'dotenv';
import { initializeDatabase } from '../database/init';

dotenv.config();

const run = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

run();

