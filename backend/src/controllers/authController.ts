import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { RegisterRequest, LoginRequest } from '../types';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = registerSchema.parse(req.body) as RegisterRequest;
      const result = await this.authService.register(validatedData);
      res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      if (error.message === 'User with this email already exists') {
        res.status(409).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body) as LoginRequest;
      const result = await this.authService.login(validatedData);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      if (error.message === 'Invalid email or password') {
        res.status(401).json({ error: error.message });
        return;
      }
      // Log the actual error for debugging
      console.error('Login internal error:', error.message || error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };
}

