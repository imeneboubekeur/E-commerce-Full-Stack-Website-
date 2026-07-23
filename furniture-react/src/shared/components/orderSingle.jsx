import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderById,
  updateOrderStatus,
} from '../slices/ordersSlice';

export default function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentOrder, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {

    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  //if (loading) return <p>Loading order...</p>;
  //if (error) return <p>Error: {error}</p>;
 

  const handleStatusChange = (status) => {
    dispatch(updateOrderStatus({ orderId: id, status }));
  };
 if (!currentOrder) return null
  return (
    <div className="admin-order-details">
      <h2>Order #{currentOrder.id}</h2>

      <section className="card">
        <h3>Order Summary</h3>
        <p><strong>Date:</strong> {new Date(currentOrder.created_at).toLocaleString()}</p>
        <p><strong>Status:</strong> {currentOrder.status}</p>
        <p><strong>Total:</strong> ${currentOrder.total_price}</p>
      </section>

      <section className="card">
        <h3>Customer Info</h3>
        <p><strong>Name:</strong> {currentOrder.customer_name}</p>
        <p><strong>Email:</strong> {currentOrder.customer_email}</p>
        <p><strong>Phone:</strong> {currentOrder.customer_phone}</p>
      </section>

      <section className="card">
        <h3>Shipping Address</h3>
        <p>{currentOrder.shipping_address}</p>
      </section>

      <section className="card">
        <h3>Order Items</h3>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {currentOrder.items?.map((item) => (
              <tr key={item.id}>
                <td className="product-cell">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    width="50"
                  />
                  {item.product_name}
                </td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>Update Status</h3>

        <div className="status-buttons">
          <button onClick={() => handleStatusChange("pending")}>
            Pending
          </button>
          <button onClick={() => handleStatusChange("confirmed")}>
            Confirmed
          </button>
          <button onClick={() => handleStatusChange("shipped")}>
            Shipped
          </button>
          <button onClick={() => handleStatusChange("delivered")}>
            Delivered
          </button>
          <button onClick={() => handleStatusChange("cancelled")}>
            Cancelled
          </button>
        </div>
      </section>
    </div>
  );
}
