import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sweetsAPI } from '../services/api';
import { Sweet } from '../types';
import { SweetCard } from '../components/SweetCard';
import { SearchBar } from '../components/SearchBar';
import { AdminPanel } from '../components/AdminPanel';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    loadSweets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sweets, searchParams]);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const data = await sweetsAPI.getAll();
      setSweets(data);
      setFilteredSweets(data);
    } catch (err: any) {
      setError('Failed to load sweets. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const hasFilters = Object.values(searchParams).some((val) => val !== '');
      if (hasFilters) {
        const filtered = await sweetsAPI.search(searchParams);
        setFilteredSweets(filtered);
      } else {
        setFilteredSweets(sweets);
      }
    } catch (err: any) {
      setError('Failed to search sweets. Please try again.');
      console.error(err);
    }
  };

  const handlePurchase = async (sweet: Sweet) => {
    try {
      await sweetsAPI.purchase(sweet.id, 1);
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Purchase failed. Please try again.');
    }
  };

  const handleSweetCreated = () => {
    loadSweets();
  };

  const handleSweetUpdated = () => {
    loadSweets();
  };

  const handleSweetDeleted = () => {
    loadSweets();
  };

  const handleRestock = async (id: string, quantity: number) => {
    try {
      await sweetsAPI.restock(id, quantity);
      await loadSweets();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Restock failed. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🍬 Kata Sweet Shop Management</h1>
          <div className="header-actions">
            <span className="user-info">Welcome, {user?.email}</span>
            {isAdmin && <span className="admin-badge">Admin</span>}
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {isAdmin && (
          <AdminPanel
            onSweetCreated={handleSweetCreated}
            onSweetUpdated={handleSweetUpdated}
            onSweetDeleted={handleSweetDeleted}
            onRestock={handleRestock}
            sweets={sweets}
          />
        )}

        <div className="sweets-section">
          <SearchBar searchParams={searchParams} onSearchChange={setSearchParams} />

          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <div className="loading">Loading sweets...</div>
          ) : filteredSweets.length === 0 ? (
            <div className="empty-state">No sweets found. {isAdmin && 'Add some sweets to get started!'}</div>
          ) : (
            <div className="sweets-grid">
              {filteredSweets.map((sweet) => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onPurchase={handlePurchase}
                  isAuthenticated={!!user}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

