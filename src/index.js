import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import { LoadScript } from "@react-google-maps/api";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    {/* <LoadScript
      libraries={["places"]}
      // googleMapsApiKey="AuVnSwE7RYxQAaqQH9MP9SC7Tx_6u4xzXPwlg0GPFAhiEEqAYIunu_6c_DeLmGIB"
      
    > */}
      <App />
    {/* </LoadScript> */}
  </Provider>
);
