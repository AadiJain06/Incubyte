import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
  searchParams: {
    name: string;
    category: string;
    minPrice: string;
    maxPrice: string;
  };
  onSearchChange: (params: {
    name: string;
    category: string;
    minPrice: string;
    maxPrice: string;
  }) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchParams, onSearchChange }) => {
  const handleChange = (field: string, value: string) => {
    onSearchChange({
      ...searchParams,
      [field]: value,
    });
  };

  return (
    <div className="search-bar">
      <h2>Search & Filter Sweets</h2>
      <div className="search-fields">
        <div className="search-field">
          <label>Name</label>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchParams.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        <div className="search-field">
          <label>Category</label>
          <input
            type="text"
            placeholder="Search by category..."
            value={searchParams.category}
            onChange={(e) => handleChange('category', e.target.value)}
          />
        </div>
        <div className="search-field">
          <label>Min Price</label>
          <input
            type="number"
            step="0.01"
            placeholder="Min price"
            value={searchParams.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
          />
        </div>
        <div className="search-field">
          <label>Max Price</label>
          <input
            type="number"
            step="0.01"
            placeholder="Max price"
            value={searchParams.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

