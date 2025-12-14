import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/connection';
import { Purchase, PurchaseWithSweet } from '../types';

export class PurchaseService {
  async createPurchase(
    userId: string,
    sweetId: string,
    quantity: number,
    totalPrice: number
  ): Promise<Purchase> {
    const purchaseId = uuidv4();

    await query(
      'INSERT INTO purchases (id, user_id, sweet_id, quantity, total_price) VALUES ($1, $2, $3, $4, $5)',
      [purchaseId, userId, sweetId, quantity, totalPrice]
    );

    const result = await query(
      'SELECT * FROM purchases WHERE id = $1',
      [purchaseId]
    );

    return result.rows[0];
  }

  async getPurchaseHistory(userId: string): Promise<PurchaseWithSweet[]> {
    const result = await query(
      `SELECT 
        p.id,
        p.user_id,
        p.sweet_id,
        p.quantity,
        p.total_price,
        p.created_at,
        s.name as sweet_name,
        s.category as sweet_category
      FROM purchases p
      LEFT JOIN sweets s ON p.sweet_id = s.id
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC`,
      [userId]
    );

    return result.rows.map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      sweet_id: row.sweet_id,
      quantity: row.quantity,
      total_price: row.total_price,
      created_at: row.created_at,
      sweet: row.sweet_name ? {
        name: row.sweet_name,
        category: row.sweet_category,
        image_url: null,
      } : null,
    }));
  }
}

