import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/connection';
import { User, RegisterRequest, LoginRequest } from '../types';

export class AuthService {
  async register(data: RegisterRequest): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, password } = data;

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate UUID for user
    const userId = uuidv4();

    // Insert user
    await query(
      'INSERT INTO users (id, email, password, role) VALUES ($1, $2, $3, $4)',
      [userId, email, hashedPassword, 'user']
    );

    // Fetch the created user
    const result = await query(
      'SELECT id, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
      token,
    };
  }

  async login(data: LoginRequest): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, password } = data;

    // Find user
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
      token,
    };
  }

  private generateToken(id: string, email: string, role: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
      throw new Error('JWT secret not configured');
    }

    // Use type assertion to bypass strict type checking for JWT sign
    return (jwt.sign as any)(
      { id, email, role },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );
  }
}

