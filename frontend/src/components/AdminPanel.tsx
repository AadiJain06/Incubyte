import React, { useState } from 'react';
import { sweetsAPI } from '../services/api';
import { Sweet } from '../types';
import './AdminPanel.css';

interface AdminPanelProps {
  onSweetCreated: () => void;
  onSweetUpdated: () => void;
  onSweetDeleted: () => void;
  onRestock: (id: string, quantity: number) => void;
  sweets: Sweet[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onSweetCreated,
  onRestock,
  sweets,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sweetsAPI.create({
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      setFormData({ name: '', category: '', price: '', quantity: '' });
      setShowAddForm(false);
      onSweetCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create sweet');
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (sweetId: string) => {
    const quantity = prompt('Enter quantity to restock:');
    if (quantity && parseInt(quantity) > 0) {
      await onRestock(sweetId, parseInt(quantity));
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Admin Panel</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="toggle-form-button"
        >
          {showAddForm ? 'Cancel' : '+ Add New Sweet'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-sweet-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Sweet name"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="Category"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                placeholder="Price"
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                min="0"
                placeholder="Initial quantity"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creating...' : 'Create Sweet'}
          </button>
        </form>
      )}

      <div className="restock-section">
        <h3>Quick Restock</h3>
        <div className="restock-list">
          {sweets.length === 0 ? (
            <p>No sweets available</p>
          ) : (
            sweets.map((sweet) => (
              <div key={sweet.id} className="restock-item">
                <span>{sweet.name} (Stock: {sweet.quantity})</span>
                <button
                  onClick={() => handleRestock(sweet.id)}
                  className="restock-button"
                >
                  Restock
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

