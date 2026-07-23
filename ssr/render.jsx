import React from "react";
import { renderToPipeableStream } from 'react-dom/server';
import { renderToString } from "react-dom/server";
import { StaticRouter } from 'react-router-dom';
import { createStaticRouter, StaticRouterProvider } from 'react-router';
import { fetchProductsStart } from "../furniture-react/src/shared/slices/productsSlice";
import { Provider } from "react-redux";
import { routes } from "../furniture-react/src/shared/routes.js";
//import { ServerApp } from '../shared/App';
import { resolveSSRData } from "../furniture-react/src/shared/resolveSSRData.js";
import { createStore } from "../furniture-react/src/shared/store";
import { fetchProductsSuccess } from '../furniture-react/src/shared/slices/productsSlice';
import { fetchCategoriesSuccess } from '../furniture-react/src/shared/slices/categoriesSlice';
import { createFetchWithAuth } from '../furniture-react/src/shared/services/fetchWithAuth';
import { getUserFromReq } from "../furniture-react/src/shared/services/getUserFromReq";
import { loginSuccess } from "../furniture-react/src/shared/slices/authSlice.js";
import App from "../furniture-react/src/shared/App";
 
export const renderer =async (req,res) => {
const store = createStore();
const user = getUserFromReq(req);
store.dispatch(loginSuccess(user));
  const fetchSSR = createFetchWithAuth(req);

 
   const result = await resolveSSRData(req, store, fetchSSR);
   
if (result?.redirect) {
   res.redirect(result.redirect);
    return null;
  }
  // renderer.js
let searchResults = null;

if (req.url.startsWith("/search")) {
  const [, queryString] = req.url.split("?");

  const params = new URLSearchParams(queryString || "");
  const q = params.get("q");

  if (q) {
    searchResults = await fetchSSR(
      `/products/search?q=${encodeURIComponent(q)}`
    );
  }
}
 
const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </Provider>
  );
  const preloadedState = store.getState();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your App</title>
        <link rel="stylesheet" href="/styles/index.css">
<link rel="stylesheet" href="/styles/keen-slider.min.css">      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
           window.__SEARCH_RESULTS__ = ${JSON.stringify(searchResults)}
           window.__STRIPE_KEY__ = "${process.env.STRIPE_PUBLIC_KEY}";
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;
};
