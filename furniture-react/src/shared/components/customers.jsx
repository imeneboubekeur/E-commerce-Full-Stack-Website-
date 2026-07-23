import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers, deleteCustomer } from "../slices/customersSlice";
import { useSearchParams } from "react-router-dom";
import { UpBar } from "./dashboard";
import { Card } from "./dashboard";
import Furnitures from "./furnitures";
import {
  setCategory,
  setPriceRange,
  setSearch,
  setSortBy,
  setStatus,
  setPage,
  applyFilters,
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
   fetchCustomersStart,
  fetchCustomersSuccess,
  fetchCustomersFailure,
    setFilters,

} from '../slices/customersSlice';
import { customersAPI } from "../services/api";
import { Users,UserPlus   
 } from "lucide-react";


export function TableCustomers({ extra }) {
  const dispatch = useDispatch();

  const { customers, filters, total,totalPages, loading, error } =
    useSelector((state) => state.customers);

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

  // Fetch from backend when filters change
  useEffect(() => {
    dispatch(fetchCustomersStart());

    customersAPI
      .getAll(filters)
      .then((res) => {
        dispatch(fetchCustomersSuccess(res));
      })
      .catch((err) => {
        dispatch(fetchCustomersFailure(err.message));
      });
  }, [filters, dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      await customersAPI.delete(id);

      // Refetch after delete
      dispatch(setFilters({ ...filters }));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {showFilter && (
        <div className="overlay" onClick={() => setShowFilter(false)}>
          <div
            className="filterModal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Filter Customers</h3>

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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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
              <option value="name">Name A–Z</option>
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
                      page: 1, // reset page
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

     
      <div className="tableWrapper customers">
        <div className="actions">
          <div className="first">
            <button>+ New Customer</button>
            <button onClick={() => setShowFilter(true)}>
              Filter
            </button>
          </div>

          {extra && (
            <div className="second">
              <input
                type="text"
                placeholder="Search customers..."
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
            </div>
          )}
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>
                  {new Date(item.created_at).toLocaleDateString()}
                </td>

                <td>
                  <button className ="delete-btn"onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
                  
        <p>showing 2 of {total} items</p>
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
export default function Customers(){
          const { customerStats } = useSelector((state) => state.dashboard);
  if (!customerStats) return <div>Loading...</div>;

    return(

        <div className="main">
    <UpBar title={"Customer Management"} />
    <div className="cardContainer">
        <Card title={"Total Customers"} value={customerStats. total_customers} Icon={Users} filled color={"#593838"}/>
        <Card  title={"News Customers"} value={customerStats. new_customers} Icon={UserPlus } filled color={"#593838"}/>
        <Card title={"Active Customers"} value={1} Icon={Users} filled color={"#593838"}/>
        <Card title={"Customers With Orders"} value={1} Icon={Users} filled color={"#593838"}/>
    </div>
    <TableCustomers extra={true} />
</div>

    )
}