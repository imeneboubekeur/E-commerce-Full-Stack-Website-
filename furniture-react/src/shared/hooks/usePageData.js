// hooks/usePageData.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { ssrConfig } from "../ssrConfig";
import { createFetchWithAuth } from "../services/fetchWithAuth";


const fetchSSR = createFetchWithAuth();

export const usePageData = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {

    const url = location.pathname + location.search;

    const matches = ssrConfig.filter((config) => config.match(url));
   matches.forEach(async (config) => {
  const result = await config.load({ dispatch }, fetchSSR, url);

  if (result?.redirect && typeof window !== "undefined") {
    window.location.href = result.redirect;
  } })
  }, [location.key, location.search]); 
};