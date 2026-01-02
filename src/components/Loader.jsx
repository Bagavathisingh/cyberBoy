import React from "react";
import "./Loader.css";

const Loader = () => (
  <div className="loader-overlay">
    <div className="cyber-loader">
      <div className="loader-square"></div>
      <div className="loader-inner"></div>
    </div>
    <div className="loader-status tracking-[0.8em]">INITIALIZING_NODE</div>
  </div>
);

export default Loader;
