import React from "react";
import { Heart, ShoppingCart, Trash,SquarePen  } from "lucide-react";
import {useState,useEffect} from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from "react-router-dom";
import { Link,useNavigate } from 'react-router-dom';
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
const STAR_GOLD="#C9961A"
const STAR_EMPTY = "#d1cfc7";
 
function StarIcon({ filled, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14">
      <polygon
        points="7,1 8.8,5.2 13.4,5.6 10.1,8.5 11.1,13 7,10.5 2.9,13 3.9,8.5 0.6,5.6 5.2,5.2"
        fill={filled ? STAR_GOLD : STAR_EMPTY}
      />
    </svg>
  );
}
 
function StarRow({ rating, size }) {
  return (
    <div className="star-row">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} filled={i < rating} size={size} />
      ))}
    </div>
  );
}
export function Furni({product,layout}){
     const dispatch = useDispatch();
     const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const user = useSelector(state => state.auth.user);
  //const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [loading, setLoading] = useState(false);
   const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
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
 if (err.status=== 401) {
 navigate("/login")
 }    
    } finally {
      setLoading(false);
    }
  };
const handleDeleteProduct = async (productId) => {
  try {
    await productAPI.deleteProduct(productId);
    dispatch(removeProduct(productId));
  } catch (err) {
    alert(err.message);
  }
};
const { items: wishlist } = useSelector((state) => state.wishlist);

const isWishlisted = wishlist.some((w) => w.id === product.id);


const handleWishlist = async () => {
  if (!isLoggedIn) {
    alert('Login first');
    return;
  }

  if (isWishlisted) {
    await wishlistAPI.removeFromWishlist(product.id);
    dispatch(removeFromWishlist(product.id));
  } else {
    await wishlistAPI.addToWishlist(product.id);
    dispatch(addToWishlist(product));
  }
};
const rating = Number(product.avg_rating);
 const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
return(
   <div className="container0"
    onClick={() => navigate(`/product/${product.id}`)}

>
        <div className="container">
        
        <div className="image-wrapper" >
            <img
  src={product.image_url}
  alt={product.name}
  loading="lazy"
/>
            <div className="top">

  <div className="rating">
  
      </div>
       <div className="handlers">
        {user?.role === "admin" && (
          <>
           <button 
      onClick={(e) => {
          e.stopPropagation();

        navigate(`/admin/edit/${product.id}`)}} 
      className="btn btn-primary cart-icon"
      disabled={loading}
    >
      {loading ? 'deleting...' : <SquarePen  size={20} color="grey"/>}
    </button>
    <button 
      onClick={() => handleDeleteProduct(product.id)} 
      className="btn btn-primary cart-icon"
      disabled={loading}
    >
      {loading ? 'deleting...' : <Trash size={20} fill="none" color="#dc2626
"/>}
    </button>
   
    </>
    
  )}
        {user?.role !== "admin" && (
    <>
      <button 
        onClick={
          (e) => {e.stopPropagation()
          handleAddToCart()}} 
        className=" cart-icon"
        disabled={loading}
      >
        {loading ? 'Loading...' : <ShoppingCart size={20} fill="grey" />}
      </button>

      <button
        className=" heart-icon"
        onClick={
           (e) => {e.stopPropagation()
          handleWishlist()}}
        disabled={!mounted}
      >
        {!mounted
          ? <Heart size={20} fill="grey" />
          : isWishlisted
          ? <Heart size={20} fill="red" />
          : <Heart size={20} fill="grey" />}
      </button>
    </>
  )}
          </div>
 

        </div>
        </div>
        <div className="bottom">
            <div className="twoTitles">
             <p style={{color:"grey"}}>{product.category_name}</p>
             
            <p style={{color:"#593838",
                fontSize:"1rem"
            }}>{product.name}</p>
            </div>
           
            <p style={{margin:"0"}}>        
   {[...Array(5)].map((_, i) => (
    <StarIcon
      key={i}
      filled={i < Math.round(product.avg_rating) ? true : false}
      size={17}
    />
  ))}
</p> 
<div className="prodBottom">
       <p style={{
                color:"#593838",
fontSize:"1.5rem"
            }}>${product.price}</p>
              {user?.role !== "admin" && (<Link 
            to={`/order/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            >
            <button style={{marginTop:"1rem"}}>
              Buy Now
            </button>
            </Link>)}
            </div>
    
  { !layout && (<Link to={`/product/${product.id}`}
  onClick={(e) => e.stopPropagation()}
  >  <button 
          
           className="btn btn-primary">View Details</button></Link>)}
         
        </div>
    </div>
    </div>
)
}



export default function Furnitures({ extra ,layout}) {
  const dispatch = useDispatch();

  const { products, filters,total, totalPages, loading } = useSelector(
    (state) => state.products
  );
  const user = useSelector(state => state.auth.user);

  const [showFilter, setShowFilter] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchParams, setSearchParams] = useSearchParams();
useEffect(() => {
  const urlFilters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  };


  dispatch(setFilters(urlFilters));
}, []);

  useEffect(() => {
    if (showFilter) {
      setLocalFilters(filters);
    }
  }, [showFilter, filters]);

  useEffect(() => {
const isDefaultFilters =
    !filters.search &&
    (!filters.category || filters.category === "all") &&
    !filters.minPrice &&
    !filters.maxPrice
 &&(filters.sort === "newest" || !filters.sort) &&filters.page === 5;
  if (products.length > 0 && isDefaultFilters) return;    const load = async () => {
      dispatch(fetchProductsStart());

      try {
        const res = await productAPI.getAll(filters);
        dispatch(fetchProductsSuccess(res));
      } catch (err) {
        dispatch(fetchProductsFailure(err.message));
      }
    };

    load();
  }, [filters, dispatch]);

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

            <button
              onClick={() => {
                dispatch(
                  setFilters({
                    ...localFilters,
                    page: 1, // ✅ reset page
                  })
                );
                setShowFilter(false);
              }}
            >
              Apply
            </button>
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
        </div>)}
          </div>

    </>
  );
}