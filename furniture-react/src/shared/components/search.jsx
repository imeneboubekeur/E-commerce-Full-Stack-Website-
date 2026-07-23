import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

   useEffect(() => {
  if (window.__SEARCH_RESULTS__) {
    setProducts(window.__SEARCH_RESULTS__.products || []);
  }
}, []);
  const query = new URLSearchParams(location.search).get('q');


  if(products.length===0) {
       return 

  };

  return (
    <div style={{ padding: 20 }}>
    <h2>
        Search results for: <strong>"{query}"</strong>
      </h2>

     
     
        <div style={{ display: 'grid', gap: 16 }}>
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              style={{
                display: 'flex',
                gap: 16,
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
              <div>
                <h4>{product.name}</h4>
                <p>{product.category}</p>
                <strong>${product.price}</strong>
              </div>
            </div>
          ))}
        </div>
      
      
    </div>
  );
};

export default SearchResults;
