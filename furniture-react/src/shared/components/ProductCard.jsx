import React from "react";

import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../slices/cartSlice';
//import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { cartAPI} from '../services/api';
 

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  //const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [loading, setLoading] = useState(false);

  //const isInWishlist = wishlistItems.some((item) => item.product_id === product.id);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    try {
      await cartAPI.addToCart(product.id, 1);
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url,
          quantity: 1,
        })
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link">
        <img src={product.image_url} alt={product.name} className="product-image" />
      </Link>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price}</p>

        <div className="product-actions">
          <button 
            onClick={handleAddToCart} 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
         
        </div>
      </div>
    </div>
  );
}

export default ProductCard;