import { AuthService } from '../authService';
import { query } from '../../database/connection';
import bcrypt from 'bcryptjs';

jest.mock('../../database/connection');
jest.mock('bcryptjs');

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockQuery.mockResolvedValueOnce({ rows: [] } as any); // Check existing user
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'user-id',
          email,
          role: 'user',
          created_at: new Date(),
        }],
      } as any);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await authService.register({ email, password });

      expect(result.user.email).toBe(email);
      expect(result.user.role).toBe('user');
      expect(result.token).toBeDefined();
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should throw error if user already exists', async () => {
      const email = 'existing@example.com';
      const password = 'password123';

      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'existing-id' }],
      } as any);

      await expect(authService.register({ email, password })).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashed-password';

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'user-id',
          email,
          password: hashedPassword,
          role: 'user',
          created_at: new Date(),
        }],
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({ email, password });

      expect(result.user.email).toBe(email);
      expect(result.token).toBeDefined();
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should throw error with invalid email', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      await expect(
        authService.login({ email: 'wrong@example.com', password: 'password123' })
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw error with invalid password', async () => {
      const email = 'test@example.com';
      const password = 'wrong-password';

      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 'user-id',
          email,
          password: 'hashed-password',
          role: 'user',
          created_at: new Date(),
        }],
      } as any);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login({ email, password })).rejects.toThrow(
        'Invalid email or password'
      );
    });
  });
});

