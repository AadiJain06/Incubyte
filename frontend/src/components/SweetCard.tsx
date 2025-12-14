import React, { useState } from 'react';
import { Sweet } from '../types';
import { sweetsAPI } from '../services/api';
import './SweetCard.css';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, quantity: number) => void;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const SweetCard: React.FC<SweetCardProps> = ({
  sweet,
  onPurchase,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: sweet.name,
    category: sweet.category,
    price: sweet.price.toString(),
    quantity: sweet.quantity.toString(),
  });
  const [loading, setLoading] = useState(false);

  const handlePurchase = () => {
    if (sweet.quantity >= purchaseQuantity) {
      onPurchase(sweet.id, purchaseQuantity);
      setPurchaseQuantity(1);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      setLoading(true);
      try {
        await sweetsAPI.update(sweet.id, {
          name: editForm.name,
          category: editForm.category,
          price: parseFloat(editForm.price),
          quantity: parseInt(editForm.quantity),
        });
        setIsEditing(false);
        onEdit();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Update failed');
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${sweet.name}"?`)) {
      try {
        await sweetsAPI.delete(sweet.id);
        onDelete();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Delete failed');
      }
    }
  };

  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className={`sweet-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Name"
          />
          <input
            type="text"
            value={editForm.category}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
            placeholder="Category"
          />
          <input
            type="number"
            step="0.01"
            value={editForm.price}
            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
            placeholder="Price"
          />
          <input
            type="number"
            value={editForm.quantity}
            onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
            placeholder="Quantity"
          />
          <div className="edit-actions">
            <button onClick={handleEdit} disabled={loading} className="save-button">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="sweet-header">
            <h3>{sweet.name}</h3>
            {isAdmin && (
              <div className="admin-actions">
                <button onClick={handleEdit} className="edit-button" title="Edit">
                  ✏️
                </button>
                <button onClick={handleDelete} className="delete-button" title="Delete">
                  🗑️
                </button>
              </div>
            )}
          </div>
          <div className="sweet-category">{sweet.category}</div>
          <div className="sweet-price">${sweet.price.toFixed(2)}</div>
          <div className="sweet-quantity">
            Stock: {sweet.quantity} {sweet.quantity === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
          </div>
          {!isAdmin && (
            <div className="purchase-section">
              <input
                type="number"
                min="1"
                max={sweet.quantity}
                value={purchaseQuantity}
                onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                disabled={isOutOfStock}
                className="quantity-input"
              />
              <button
                onClick={handlePurchase}
                disabled={isOutOfStock || sweet.quantity < purchaseQuantity}
                className="purchase-button"
              >
                {isOutOfStock ? 'Out of Stock' : 'Purchase'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

