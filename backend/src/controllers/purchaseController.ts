import { Request, Response } from 'express';
import { PurchaseService } from '../services/purchaseService';

export class PurchaseController {
  private purchaseService: PurchaseService;

  constructor() {
    this.purchaseService = new PurchaseService();
  }

  getHistory = async (req: Request & { user?: { id: string } }, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const purchases = await this.purchaseService.getPurchaseHistory(req.user.id);
      res.status(200).json(purchases);
    } catch (error) {
      console.error('Get purchase history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

