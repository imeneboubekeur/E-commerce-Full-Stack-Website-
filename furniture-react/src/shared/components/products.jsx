import React from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import {useState,useEffect,useRef} from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { cartAPI} from '../services/api';
import { productAPI } from "../services/api";

import {
  setCategory,
  setPriceRange,
  setSearch,
  setSortBy,
  removeProduct,
  applyFilters, 
  setFilters,
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from '../slices/productsSlice';
import { addWishlistItem, removeWishlistItem } from '../slices/wishlistSlice';
import { wishlistAPI } from '../services/api';
import { Furni } from "./furnitures";

export default function Furnitures1({ extra ,layout}) {
  const dispatch = useDispatch();

 
  const user = useSelector(state => state.auth.user);

  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
    const [totalPages, setTotalPages] = useState(1);

   const isFirstRender = useRef(true);
    const filters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  };
   const [localFilters, setLocalFilters] = useState(filters);
 useEffect(() => {
    if (showFilter) {
      setLocalFilters(filters);
    }
  }, [showFilter]);
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAll(filters);
        setProducts(res.products);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]); 

  // Update filters
  const updateFilters = (newFilters) => {
    const params = {};
    
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.category) params.category = newFilters.category;
    if (newFilters.minPrice) params.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice) params.maxPrice = newFilters.maxPrice;
    if (newFilters.sort) params.sort = newFilters.sort;
    if (newFilters.page) params.page = String(newFilters.page);
    if (newFilters.limit) params.limit = String(newFilters.limit);

    setSearchParams(params);
  };

const handleApplyFilters = () => {
    updateFilters({ ...localFilters, page: 1 }); // Reset to page 1
    setShowFilter(false);
  };
  return (
    <>
      {showFilter && (
        <div className="overlay" onClick={() => setShowFilter(false)}>
          <div
            className="filterModal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Filter Products</h3>

            <input
              placeholder="Search"
              value={localFilters.search}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  search: e.target.value,
                })
              }
            />

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
              <option value="price_asc">Price Low</option>
              <option value="price_desc">Price High</option>
              <option value="oldest">Oldest</option>
            </select>

            <input
              type="number"
              placeholder="Min price"
              value={localFilters.minPrice || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  minPrice: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Max price"
              value={localFilters.maxPrice || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  maxPrice: e.target.value,
                })
              }
            />

            <select
              value={localFilters.category}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  category: e.target.value,
                })
              }
            >
              <option value="all">All</option>
              <option value="1">Chairs</option>
              <option value="2">Tables</option>
            </select>

           
                        <button onClick={handleApplyFilters}>Apply</button>

          </div>
        </div>
      )}

 <div className={layout ? "tableWrapper1" : "tableWrapper"} >
  {layout && (
    <h2 style={{marginTop:"0"}}>Our Products </h2>
  )}
       {!layout && (<div className="actions">
            <div className="first">
                <Link to="/admin/add"><button>+ New Product</button></Link>                <button onClick={() => setShowFilter(true)}>Filter</button>
            </div>
           {extra && <div className="second">
                <button>All Status</button>
                <button>Last 30 days</button>
            </div>
            }
        </div>)}
      <div className={`furnitures ${layout ? "furnitures1" : ""}`}>
        {products?.map((p) => (
          <Furni key={p.id} product={p} layout={layout} />
        ))}
      </div>
      {!layout && (<div className="pagination">
          
<p>showing 8 of {totalPages} items</p>
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
        </div>)}
          </div>

    </>
  );
}