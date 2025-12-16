import React from "react";
import "./Loader.css";

const Loader = () => (
  <div className="loader-overlay">
    <div className="bouncing-loader">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default Loader;
