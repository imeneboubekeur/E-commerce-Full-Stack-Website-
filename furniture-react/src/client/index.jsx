import React from "react";
import { hydrateRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';  
import { createBrowserRouter } from "react-router-dom";
import { routes } from "../shared/routes";
import { createStore } from "../shared/store";
import App from "../shared/App";

const store = createStore(window.__PRELOADED_STATE__);
  
hydrateRoot(
  document.getElementById("root"),
  <Provider store={store}>
    <BrowserRouter>
      <App /> 
    </BrowserRouter>
    </Provider>
 
);
