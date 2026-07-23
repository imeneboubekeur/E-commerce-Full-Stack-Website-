import React from "react";
import { useParams ,useNavigate} from "react-router-dom";
import { useDispatch, useSelector} from 'react-redux';
import {useRef} from "react"
import {useState,useEffect} from "react"
import {
  fetchSingleStart,
  fetchSingleSuccess,
  fetchSingleFailure,
    removeProduct,
} from '../slices/productsSlice';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { fetchReviews ,addReview } from "../slices/reviewsSlice";
import { productAPI,cartAPI,wishlistAPI } from '../services/api';
import Furnitures from "./furnitures"

import { useKeenSlider } from "keen-slider/react";
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
 
function Avatar({ name }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return <div className="avatar">{initials}</div>;
}
 
function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-card__top">
        <Avatar name={review.user_name || "User"} />
        <div>
          <p className="review-card__meta-name">{review.user_name || "Anonymous"}</p>
          <p className="review-card__meta-handle">
            @{(review.user_name || "user").toLowerCase().replace(/\s+/g, "")}
          </p>
          <StarRow rating={review.rating} size={14} />
        </div>
      </div>
      <p className="review-card__body">{review.comment}</p>
    </div>
  );
}
 
function CarouselDots({ total, current, onSelect }) {
  return (
    <div className="carousel-dots">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={`carousel-dot${i === current ? " active" : ""}`}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  );
}
 
function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(null);
  const display = hovered ?? value;
  return (
    <div className="star-selector">
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          className="star-selector__btn"
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(i + 1)}
        >
          <StarIcon filled={i < display} size={24} />
        </button>
      ))}
    </div>
  );
}
 
export function ProductReviews({ productId }) {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.reviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

const [loaded, setLoaded] = useState(false);

const [sliderRef, instanceRef] = useKeenSlider({
  slides: {
    perView: 2,
    spacing: 20,
  },
  breakpoints: {
    "(max-width: 768px)": {
      slides: {
        perView: 1,
        spacing: 20,
      },
    },
  },
  slideChanged(slider) {
    setCurrentSlide(slider.track.details.rel);
  },
  created() {
    setLoaded(true);
  },
});
 
  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [productId, dispatch]);
 

  const handleSubmit = () => {
    if (!comment.trim()) return;
    dispatch(addReview({ product_id: productId, rating, comment }));
    setComment("");
    setRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };
 
  return (
    <section className="reviews-section">
      <h2 className="reviews-heading">What our clients say…</h2>
 
      {loading && <p className="reviews-loading">Loading reviews…</p>}
 
      {reviews.length > 0 && (
        <>
         <div className="carousel-viewport">
 <div ref={sliderRef} className="keen-slider">
  {reviews.map((review) => (
    <div key={review.id} className="keen-slider__slide">
      <ReviewCard review={review} />
    </div>
  ))}
</div>
</div>

<CarouselDots
  total={instanceRef.current?.track.details.slides.length || 0}
  current={currentSlide}
  onSelect={(i) => instanceRef.current?.moveToIdx(i)}
/>
         
        </>
      )}
 
      <hr className="reviews-divider" />
 
      <div className="submit-section">
        <h3 className="submit-section__heading">Write a review</h3>
 
        <div className="submit-section__rating-row">
          <span className="submit-section__rating-label">Your rating</span>
          <StarSelector value={rating} onChange={setRating} />
          <span className="submit-section__rating-value">{rating} / 5</span>
        </div>
 
        <textarea
          className="review-textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience…"
        />
 
        <div className="submit-section__actions">
          <button className="submit-btn" onClick={handleSubmit}>
            Submit review
          </button>
          {submitted && <span className="submit-toast">Review submitted!</span>}
        </div>
      </div>
    </section>
  );
}


export function SingleItem({data}){
  const navigate = useNavigate();
       const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.auth);
    const { reviews, loading } = useSelector((state) => state.reviews);

 const handleAddToCart = async () => {
     if (!isLoggedIn) {
       alert('Please login first');
       return;
     }
 
     try {
       await cartAPI.addToCart(data.id, 1);
       dispatch(
         addToCart({
           id: data.id,
           name: data.name,
           price: data.price,
           image: data.image_url,
           quantity: 1,
         })
       );
     } catch (err) {
       alert(err.message);
     }
   };
 const handleDeleteProduct = async (productId) => {
   try {
     await productAPI.deleteProduct(productId);
     dispatch(removeProduct(productId));
         navigate("/admin/products"); 

   } catch (err) {
     alert(err.message);
   }
 };
 const { items: wishlist } = useSelector((state) => state.wishlist);
 
 const isWishlisted = wishlist.some((w) => w.id === data.id);
 
 
 const handleWishlist = async () => {
   if (!isLoggedIn) {
     alert('Login first');
     return;
   }
 
   if (isWishlisted) {
     await wishlistAPI.removeFromWishlist(data.id);
     dispatch(removeFromWishlist(data.id));
   } else {
     await wishlistAPI.addToWishlist(data.id);
     dispatch(addToWishlist(data));
   }
 }; 
return(
    <section className="item">
<div className="image">
<img src={data.image_url}/>
</div>
<div className="details">
<h3 style={{margin:"1rem 0 0 0"}}>{data.name} </h3>
<p style={{margin:"0"}}>        
   {[...Array(5)].map((_, i) => (
    <StarIcon
      key={i}
      filled={i < Math.round(data.avg_rating) ? true : false}
      size={24}
    />
  ))}
</p> 
<p style={{fontSize:"1.3rem",margin:"0"}}>{data.price}$</p>
<p> A modern centerpiece designed with smooth curves and a sleek silhouette, the Orbit Bed brings elegance and comfort together. Its rounded frame creates a cozy, cocoon-like feel, while the sturdy build ensures lasting support. Perfect for those who
     want a stylish and contemporary upgrade to their bedroom.</p>
<p>Colors:
    
</p>
<div className="buttons">
   <button className="first"
    onClick={handleWishlist}
   >Add to favorites</button>
    <button className="second"
     onClick={handleAddToCart}
    >Add To Cart</button>
</div>
</div>
    </section>
)
}

export default function ItemPage(){
    const { id } = useParams();   // /products/:id
  const dispatch = useDispatch();

  const { singleProduct, singleLoading, singleError } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchSingleStart());

    productAPI
      .getById(id)
      .then((res) => {
        dispatch(fetchSingleSuccess(res));
      })
      .catch((err) => {
        dispatch(fetchSingleFailure(err.message));
      });
  }, [id, dispatch]);
  if (!singleProduct) return null
{return(
    <>
<div className="single">
    <SingleItem data={singleProduct}/>
    <Furnitures  layout={true}/>
</div>
<div>
<ProductReviews productId={id}/>
</div>
</>
)}
}
