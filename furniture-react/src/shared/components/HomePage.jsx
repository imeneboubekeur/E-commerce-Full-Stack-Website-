import React from "react";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import {
  setCategory,
  setPriceRange,
  setSearch,
  setSortBy,
  applyFilters,
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from '../slices/productsSlice';
import { productAPI } from '../services/api';
import Furnitures from "./furnitures";


function HomePage(){
return(
  <Furnitures/>
)
}

export default HomePage;