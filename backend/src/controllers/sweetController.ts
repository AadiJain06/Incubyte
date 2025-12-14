import { Request, Response } from 'express';
import { SweetService } from '../services/sweetService';
import { PurchaseService } from '../services/purchaseService';
import { CreateSweetRequest, UpdateSweetRequest, SearchSweetsQuery } from '../types';
import { z } from 'zod';

const createSweetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
});

const updateSweetSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().min(0).optional(),
});

export class SweetController {
  private sweetService: SweetService;
  private purchaseService: PurchaseService;

  constructor() {
    this.sweetService = new SweetService();
    this.purchaseService = new PurchaseService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createSweetSchema.parse(req.body) as CreateSweetRequest;
      const sweet = await this.sweetService.create(validatedData);
      res.status(201).json(sweet);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const sweets = await this.sweetService.findAll();
      res.status(200).json(sweets);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  search = async (req: Request, res: Response): Promise<void> => {
    try {
      const queryParams = req.query as SearchSweetsQuery;
      const sweets = await this.sweetService.search(queryParams);
      res.status(200).json(sweets);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const sweet = await this.sweetService.findById(id);
      if (!sweet) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }
      res.status(200).json(sweet);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData = updateSweetSchema.parse(req.body) as UpdateSweetRequest;
      
      // Check if sweet exists first
      const existingSweet = await this.sweetService.findById(id);
      if (!existingSweet) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }

      const sweet = await this.sweetService.update(id, validatedData);
      if (!sweet) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }
      res.status(200).json(sweet);
    } catch (error: any) {
      console.error('Update error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors[0].message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await this.sweetService.delete(id);
      if (!deleted) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  purchase = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({ error: 'Valid quantity is required' });
        return;
      }

      // Get sweet details before purchase
      const sweet = await this.sweetService.findById(id);
      if (!sweet) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }

      if (sweet.quantity < quantity) {
        res.status(400).json({ error: 'Insufficient stock' });
        return;
      }

      // Calculate total price
      const totalPrice = sweet.price * quantity;

      // Record purchase
      await this.purchaseService.createPurchase(
        req.user.id,
        id,
        quantity,
        totalPrice
      );

      // Update sweet quantity
      const updatedSweet = await this.sweetService.purchase(id, quantity);
      if (!updatedSweet) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }

      res.status(200).json(updatedSweet);
    } catch (error: any) {
      if (error.message === 'Insufficient stock') {
        res.status(400).json({ error: error.message });
        return;
      }
      console.error('Purchase error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  restock = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        res.status(400).json({ error: 'Valid quantity is required' });
        return;
      }

      const sweet = await this.sweetService.restock(id, quantity);
      if (!sweet) {
        res.status(404).json({ error: 'Sweet not found' });
        return;
      }
      res.status(200).json(sweet);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

