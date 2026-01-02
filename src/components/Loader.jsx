import React from "react";
import "./Loader.css";

const Loader = () => (
  <div className="loader-overlay">
    <div className="cyber-spinner">
      <div className="spinner-ring"></div>
      <div className="spinner-ring-inner"></div>
      <div className="spinner-core"></div>
    </div>
    <div className="loader-text">Initializing_Node...</div>
  </div>
);

export default Loader;
