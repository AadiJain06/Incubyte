import { v4 as uuidv4 } from 'uuid';
import { query } from '../database/connection';
import { Sweet, CreateSweetRequest, UpdateSweetRequest, SearchSweetsQuery } from '../types';

export class SweetService {
  async create(data: CreateSweetRequest): Promise<Sweet> {
    const { name, category, price, quantity } = data;

    // Generate UUID for sweet
    const sweetId = uuidv4();

    await query(
      `INSERT INTO sweets (id, name, category, price, quantity)
       VALUES ($1, $2, $3, $4, $5)`,
      [sweetId, name, category, price, quantity]
    );

    // Fetch the created sweet
    const result = await query(
      'SELECT id, name, category, price, quantity, created_at, updated_at FROM sweets WHERE id = $1',
      [sweetId]
    );

    return result.rows[0];
  }

  async findAll(): Promise<Sweet[]> {
    const result = await query(
      'SELECT id, name, category, price, quantity, created_at, updated_at FROM sweets ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async findById(id: string): Promise<Sweet | null> {
    const result = await query(
      'SELECT id, name, category, price, quantity, created_at, updated_at FROM sweets WHERE id = $1',
      [id]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async search(queryParams: SearchSweetsQuery): Promise<Sweet[]> {
    let sql = 'SELECT id, name, category, price, quantity, created_at, updated_at FROM sweets WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (queryParams.name) {
      sql += ` AND LOWER(name) LIKE LOWER($${paramCount})`;
      params.push(`%${queryParams.name}%`);
      paramCount++;
    }

    if (queryParams.category) {
      sql += ` AND LOWER(category) LIKE LOWER($${paramCount})`;
      params.push(`%${queryParams.category}%`);
      paramCount++;
    }

    if (queryParams.minPrice) {
      sql += ` AND price >= $${paramCount}`;
      params.push(parseFloat(queryParams.minPrice));
      paramCount++;
    }

    if (queryParams.maxPrice) {
      sql += ` AND price <= $${paramCount}`;
      params.push(parseFloat(queryParams.maxPrice));
      paramCount++;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  async update(id: string, data: UpdateSweetRequest): Promise<Sweet | null> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramCount}`);
      params.push(data.name);
      paramCount++;
    }

    if (data.category !== undefined) {
      updates.push(`category = $${paramCount}`);
      params.push(data.category);
      paramCount++;
    }

    if (data.price !== undefined) {
      updates.push(`price = $${paramCount}`);
      params.push(data.price);
      paramCount++;
    }

    if (data.quantity !== undefined) {
      updates.push(`quantity = $${paramCount}`);
      params.push(data.quantity);
      paramCount++;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    // Always update the updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const updateSql = `UPDATE sweets SET ${updates.join(', ')} WHERE id = $${paramCount}`;
    await query(updateSql, params);

    // Fetch the updated sweet
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM sweets WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  async purchase(id: string, quantity: number): Promise<Sweet | null> {
    const sweet = await this.findById(id);
    if (!sweet) {
      return null;
    }

    if (sweet.quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    const newQuantity = sweet.quantity - quantity;
    return this.update(id, { quantity: newQuantity });
  }

  async restock(id: string, quantity: number): Promise<Sweet | null> {
    const sweet = await this.findById(id);
    if (!sweet) {
      return null;
    }

    const newQuantity = sweet.quantity + quantity;
    return this.update(id, { quantity: newQuantity });
  }
}

