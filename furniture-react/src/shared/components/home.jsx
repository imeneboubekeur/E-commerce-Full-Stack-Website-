import React from "react";
import { useNavigate } from "react-router-dom";
import chair from "../assets/chair.png"
import FurnitureCarousel from "./categories"
import Furnitures from "./furnitures"
export default function Home(){
      const navigate = useNavigate();

      const handleExplore = () => {
        
    navigate("/products");
  };
    return(
        
        <div className="home">
            <section className="hero">
<div className="hero-text">
<h1>Your Style, Your Space, 
Your <span>Furniture</span>
</h1>
<p >
    It is a long established fact that a reader 
    will be distracted by the readable content of a page when looking at its layout. 
</p>
<button
 onClick={handleExplore}
>Explore more...</button>
</div>

<div className="hero-image">
    <img src={chair}/>
</div>
            </section>
             
 <FurnitureCarousel/>
            <section style={{
                marginBottom:"2.5rem"
            }}>
 <Furnitures layout={true}/>
            </section>
        </div>
       
    )
}