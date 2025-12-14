import { SweetService } from '../sweetService';
import { query } from '../../database/connection';

jest.mock('../../database/connection');

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('SweetService', () => {
  let sweetService: SweetService;

  beforeEach(() => {
    sweetService = new SweetService();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new sweet', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5.99,
        quantity: 100,
      };

      const mockSweet = {
        id: 'sweet-id',
        ...sweetData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({
        rows: [mockSweet],
      } as any);

      const result = await sweetService.create(sweetData);

      expect(result.name).toBe(sweetData.name);
      expect(result.category).toBe(sweetData.category);
      expect(result.price).toBe(sweetData.price);
      expect(result.quantity).toBe(sweetData.quantity);
    });
  });

  describe('findAll', () => {
    it('should return all sweets', async () => {
      const mockSweets = [
        { id: '1', name: 'Sweet 1', category: 'Category 1', price: 10, quantity: 50, created_at: new Date(), updated_at: new Date() },
        { id: '2', name: 'Sweet 2', category: 'Category 2', price: 20, quantity: 30, created_at: new Date(), updated_at: new Date() },
      ];

      mockQuery.mockResolvedValueOnce({
        rows: mockSweets,
      } as any);

      const result = await sweetService.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Sweet 1');
    });
  });

  describe('findById', () => {
    it('should return sweet by id', async () => {
      const mockSweet = {
        id: 'sweet-id',
        name: 'Test Sweet',
        category: 'Test',
        price: 15,
        quantity: 25,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({
        rows: [mockSweet],
      } as any);

      const result = await sweetService.findById('sweet-id');

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Test Sweet');
    });

    it('should return null if sweet not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const result = await sweetService.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('search', () => {
    it('should search sweets by name', async () => {
      const mockSweets = [
        { id: '1', name: 'Chocolate Bar', category: 'Chocolate', price: 10, quantity: 50, created_at: new Date(), updated_at: new Date() },
      ];

      mockQuery.mockResolvedValueOnce({
        rows: mockSweets,
      } as any);

      const result = await sweetService.search({ name: 'Chocolate' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Chocolate Bar');
    });

    it('should search sweets by category', async () => {
      const mockSweets = [
        { id: '1', name: 'Sweet 1', category: 'Candy', price: 10, quantity: 50, created_at: new Date(), updated_at: new Date() },
      ];

      mockQuery.mockResolvedValueOnce({
        rows: mockSweets,
      } as any);

      const result = await sweetService.search({ category: 'Candy' });

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('Candy');
    });

    it('should search sweets by price range', async () => {
      const mockSweets = [
        { id: '1', name: 'Sweet 1', category: 'Test', price: 15, quantity: 50, created_at: new Date(), updated_at: new Date() },
      ];

      mockQuery.mockResolvedValueOnce({
        rows: mockSweets,
      } as any);

      const result = await sweetService.search({ minPrice: '10', maxPrice: '20' });

      expect(result).toHaveLength(1);
      expect(result[0].price).toBe(15);
    });
  });

  describe('update', () => {
    it('should update sweet details', async () => {
      const updatedSweet = {
        id: 'sweet-id',
        name: 'Updated Name',
        category: 'Updated Category',
        price: 25,
        quantity: 75,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({
        rows: [updatedSweet],
      } as any);

      const result = await sweetService.update('sweet-id', {
        name: 'Updated Name',
        price: 25,
      });

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Updated Name');
      expect(result?.price).toBe(25);
    });
  });

  describe('delete', () => {
    it('should delete sweet by id', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 'sweet-id' }],
      } as any);

      const result = await sweetService.delete('sweet-id');

      expect(result).toBe(true);
    });

    it('should return false if sweet not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] } as any);

      const result = await sweetService.delete('non-existent-id');

      expect(result).toBe(false);
    });
  });

  describe('purchase', () => {
    it('should decrease quantity when purchasing', async () => {
      const existingSweet = {
        id: 'sweet-id',
        name: 'Test Sweet',
        category: 'Test',
        price: 10,
        quantity: 100,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({
        rows: [existingSweet],
      } as any);

      const updatedSweet = {
        ...existingSweet,
        quantity: 90,
      };

      mockQuery.mockResolvedValueOnce({
        rows: [updatedSweet],
      } as any);

      const result = await sweetService.purchase('sweet-id', 10);

      expect(result).not.toBeNull();
      expect(result?.quantity).toBe(90);
    });

    it('should throw error if insufficient stock', async () => {
      const existingSweet = {
        id: 'sweet-id',
        name: 'Test Sweet',
        category: 'Test',
        price: 10,
        quantity: 5,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({
        rows: [existingSweet],
      } as any);

      await expect(sweetService.purchase('sweet-id', 10)).rejects.toThrow(
        'Insufficient stock'
      );
    });
  });

  describe('restock', () => {
    it('should increase quantity when restocking', async () => {
      const existingSweet = {
        id: 'sweet-id',
        name: 'Test Sweet',
        category: 'Test',
        price: 10,
        quantity: 50,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({
        rows: [existingSweet],
      } as any);

      const updatedSweet = {
        ...existingSweet,
        quantity: 100,
      };

      mockQuery.mockResolvedValueOnce({
        rows: [updatedSweet],
      } as any);

      const result = await sweetService.restock('sweet-id', 50);

      expect(result).not.toBeNull();
      expect(result?.quantity).toBe(100);
    });
  });
});

