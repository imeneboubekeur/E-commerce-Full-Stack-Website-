import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { categoriesAPI } from "../services/api";
import { Link } from 'react-router-dom';
import lamps from "../assets/lamps.png"
import plants from "../assets/plants.png"
import beds from "../assets/beds.png"
import tables from "../assets/tables.png"
import chairs from "../assets/chairs.png"
import sofas from "../assets/sofas.png"

import { useState, useEffect } from "react";

export default function FurnitureCarousel({ furnitures }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
   
const dispatch = useDispatch();
      const { items } = useSelector((state) => state.categories);
      useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 550) setItemsPerSlide(1);
      else if (window.innerWidth < 900) setItemsPerSlide(2);
      else if (window.innerWidth < 1200) setItemsPerSlide(3);
      else setItemsPerSlide(4);
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex + itemsPerSlide < 8) {
      setCurrentIndex(currentIndex + itemsPerSlide);
    }
  };

  const prevSlide = () => {
    if (currentIndex - itemsPerSlide >= 0) {
      setCurrentIndex(currentIndex - itemsPerSlide);
    }
  };

  return (
    <div className="carousel-category" style={{backgroundColor:"#e7ddcf"}}>
    <div className="carousel">
      <h2 >Browse Collections</h2>
      <div className="carousel-container">
        <button className="arrow left" onClick={prevSlide}>❮</button>

        <div className="carousel-track-wrapper">
          <div
            className="carousel-track"
            style={{
transform: `translateX(-${(100 * (currentIndex / itemsPerSlide))}%)`            }}
          >
          {items.map((cat) => (
         <Link key={cat.id} to={`/products?search=&category=${cat.id}`} className="furni-card" 
                   style={{ flex: `0 0 calc(100% / ${itemsPerSlide})` }}
         ><div key={cat.id} className="furni-card"
          >
            <img
              src={cat.image_url || "/placeholder.png"}
              alt={cat.name}
            />
            <h3 >{cat.name}</h3>

            
          </div></Link>
        ))} 
             
          </div>
        </div>

        <button className="arrow right" onClick={nextSlide}>❯</button>
      </div>
    </div>
    </div>
  );
}

