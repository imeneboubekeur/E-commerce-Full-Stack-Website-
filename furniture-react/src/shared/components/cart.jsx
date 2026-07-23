import React from "react";

import {useState,useEffect} from "react"
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';
import {
  updateCartItem,
  removeFromCart,
  clearCart,
fetchCartSuccess
} from '../slices/cartSlice';
export  function CartItem({data}){
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);
    const handleUpdateQuantity = async (cartId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(cartId);
      return;
    }

    try {
      await cartAPI.updateItem(cartId, quantity);
      dispatch(updateCartItem({ id: cartId, quantity }));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      await cartAPI.removeItem(cartId);
      dispatch(removeFromCart(cartId));
    } catch (err) {
      alert(err.message);
    }
  };
    return(
        
            
              <tbody>
                <tr>
                    <td>
                      <img src={data.image}></img>
                    </td>
                    <td>
                    {data.name}
                    </td>
                    <td>
                      ${data.price}
                    </td>
                    <td>
                        <button onClick={() => handleUpdateQuantity(data.id, data.quantity - 1)}>-</button>
                  <span>{data.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(data.id, data.quantity + 1)}>+</button>
                    </td>
                    <td>
                      ${(data.price * data.quantity).toFixed(2)}
                    </td>


                    <td>
               <button onClick={() => handleRemoveItem(data.id)} className="btn-remove">
                  Remove
                </button>       
                    </td>
                  </tr>


         
          </tbody>
    
) }

export default function Cart(){
 const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn ,initializing} = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
    const { items, totalPrice } = useSelector((state) => state.cart);

  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
     if (initializing) return;
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
cartAPI
      .getCart()
      .then((res) => {
        dispatch(fetchCartSuccess(res));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, [isLoggedIn, navigate, dispatch]);

 
if (pageLoading) {
    return <div className="cart-page"><p>Loading cart...</p></div>;
  }
  return(
<>
<h1>Shopping Cart</h1>
<div className="table-wrapper">
     <table>
              <thead>
                <tr style={{width:"100%"}}>
                  <th style={{width:"15%"}}>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>

                  <th style={{width:"10%"}}>Delete</th>
                </tr>
              </thead>
    {items.map((item)=>(
        <CartItem key={item.id} data={item}/>
    )
    )}
    </table>
    </div>
 </> )
}