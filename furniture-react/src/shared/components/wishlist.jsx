import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlistSuccess,removeFromWishlist} from '../slices/wishlistSlice';
import { wishlistAPI } from '../services/api';
import React from "react";

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);


        
  
 const handleRemoveItem = async (wishlistId) => {
    try {
      await wishlistAPI.removeFromWishlist(wishlistId);
      dispatch(removeFromWishlist(wishlistId));
    } catch (err) {
      alert(err.message);
    }
  };
  if (items.length === 0) {
    return <h2>Your wishlist is empty 💔</h2>;
  }

  return (
    <div className="wishlist">
    <h1>Your Wishlist</h1>
    <div className="wishlist-grid">
      
      {items.map((item) => (
        <div className="wishlist-card" key={item.id}>
          <img src={item.image_url} alt={item.name} />
          <h3>{item.name}</h3>
          <p>${item.price}</p>

          <button
            onClick={() => handleRemoveItem(item.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
    </div>
  );
}
