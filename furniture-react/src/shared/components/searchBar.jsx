import React from "react";

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  setSearch, 
  applyFilters
} from '../slices/productsSlice';
import { Search, X } from 'lucide-react';
const API_URL = process.env.API_URL;

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [liveResults, setLiveResults] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Get data from Redux store
  const { filters } = useSelector((state) => state.products);
  const searchQuery = filters.search;

  // Sync local state with Redux state
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
 useEffect(() => {
    const fetchLive = async () => {
      if (!localSearch.trim() || !isFocused) {
        setLiveResults([]);
        return;
      }

      const res = await fetch(
        `${API_URL}/products/search?q=${localSearch}&limit=5`
      );
      const data = await res.json();
      setLiveResults(data.products || []);
      setShowDropdown(true);
    };

    const t = setTimeout(fetchLive, 300);
    return () => clearTimeout(t);
  }, [localSearch, isFocused]);
  
const handleSearch = (e) => {
    e.preventDefault();

    dispatch(
      setFilters({
        ...filters,
        search: localSearch,
        page: 1,
      })
    );

    navigate(`/search?q=${localSearch}`);
    setShowDropdown(false);
  };
  const handleFocus = () => {
    setIsFocused(true);
    // Show dropdown immediately if there are existing results
    if (localSearch.trim().length > 0 && liveResults.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowDropdown(false);
    setIsFocused(false);
    setLocalSearch('');
    dispatch(setSearch(''));
    setLiveResults([]);
  };

  const handleClear = () => {
    setLocalSearch('');
    setShowDropdown(false);
    dispatch(setSearch(''));
    setLiveResults([]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    // Dropdown will update automatically via useEffect
  };

  return (
    <div className="searchCon" ref={searchRef}>
      <form className="searchBar"onSubmit={handleSearch}  ref={searchRef}>
  <Search className="search-icon" size={20} />
  <input
          type="text"
          value={localSearch}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Search products..."
         
        />
        <div>
      
        </div>
      </form>

      {showDropdown && isFocused && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          {liveLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #007bff',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : liveResults.length > 0 ? (
            <>
              {liveResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <img
                    src={product.image_url }
                    alt={product.name}
                      loading="lazy"

                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      margin: 0,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {product.name}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                      {product.category}
                    </p>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>
                    ${product.price}
                  </span>
                </div>
              ))}
              <button
                onClick={handleSearch}
                style={{
                  width: '100%',
                  padding: '12px',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#007bff',
                  fontWeight: '500',
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.background = '#f0f8ff'}
                onMouseLeave={(e) => e.target.style.background = 'white'}
              >
                See all results for "{localSearch}"
              </button>
            </>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No products found for "{localSearch}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;