import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { cartAPI, ordersAPI } from '../services/api';
import {useState,useEffect} from "react"
import { useSearchParams } from "react-router-dom";
import { UpBar } from "./dashboard";
import { Card } from "./dashboard";
import { fetchOrders } from "../slices/ordersSlice";
import {
  setCategory,
  setPriceRange,
  setSearch,
  setSortBy,
  setStatus,
  setFilters,
  fetchOrdersSuccess,
  fetchOrdersStart,
  fetchOrdersFailure,
  applyFilters,
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from '../slices/ordersSlice';

export default function TableOrders({ extra }) {
  const dispatch = useDispatch();

  const { orders, filters, totalPages,total, loading, error } = useSelector((state) => state.orders);
  const [showFilter, setShowFilter] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
const [searchParams, setSearchParams] = useSearchParams();

useEffect(() => {
  const urlFilters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "all",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  };

  dispatch(setFilters(urlFilters));
}, []);
useEffect(() => {
  const current = Object.fromEntries(searchParams.entries());

  const next = {
    search: filters.search || "",
    status: filters.status,
    sort: filters.sort,
    page: String(filters.page),
    limit: String(filters.limit),
  };

  const isSame =
    JSON.stringify(current) === JSON.stringify(next);

  if (!isSame) {
    setSearchParams(next);
  }
}, [filters]);
  // Sync modal filters
  useEffect(() => {
    if (showFilter) {
      setLocalFilters(filters);
    }
  }, [showFilter, filters]);

  // Fetch orders when filters change
  useEffect(() => {
    dispatch(fetchOrdersStart());

    ordersAPI
      .getOrders(filters)
      .then((res) => {
        dispatch(fetchOrdersSuccess(res));
      })
      .catch((err) => {
        dispatch(fetchOrdersFailure(err.message));
      });
  }, [filters, dispatch]);

  return (
    <>
      {showFilter && (
        <div className="overlay" onClick={() => setShowFilter(false)}>
          <div
            className="filterModal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Filter Orders</h3>

            <input
              type="text"
              placeholder="Search product in orders..."
              value={localFilters.search || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  search: e.target.value,
                })
              }
            />

            <select
              value={localFilters.status}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  status: e.target.value,
                })
              }
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={localFilters.sort}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  sort: e.target.value,
                })
              }
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            <div className="modalActions">
              <button onClick={() => setShowFilter(false)}>
                Cancel
              </button>

              <button
                className="primary"
                onClick={() => {
                  dispatch(
                    setFilters({
                      ...localFilters,
                      page: 1,
                    })
                  );
                  setShowFilter(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="tableWrapper">
        <div className="actions">
          <div className="first">
                <button>+ New Order</button>
                <button onClick={() => setShowFilter(true)}>Filter</button>
            </div>
            {extra && (
            <input
              type="text"
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) =>
                dispatch(
                  setFilters({
                    ...filters,
                    search: e.target.value,
                    page: 1,
                  })
                )
              }
              className="searchInput"
            />
          )}
    

        
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <table>
          <thead>
            <tr >
              <th>ID</th>
             <th >PRODUCTS</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td >{order.order_id}</td>
                <td >{order.products}</td>
                <td >{order.customer}</td>

                <td>
                  {new Date(order.date).toLocaleDateString()}
                </td>

                <td >${order.amount}</td>
              <td> <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span></td>

                
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
                  
        <p>showing 10 of {total} items</p>
                 <div className="pages">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={filters.page === i + 1 ? "active" : ""}
                      onClick={() =>
                        dispatch(
                          setFilters({
                            ...filters,
                            page: i + 1,
                          })
                        )
                      }
                    >
                      {i + 1}
                    </button>
                  ))}
        
                 </div>
                </div>
      </div>
    </>
  );
}