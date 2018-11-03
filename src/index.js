import React from "react";
import ReactDOM from "react-dom";
import App from "./views/App";

import "./assets/scss/material-kit-react.css?v=1.3.0";
import { store } from "./store";
import { Provider } from "react-redux";
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
