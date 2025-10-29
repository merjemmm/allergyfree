import React, { useState } from "react";
import "../styles/styles.css";

function HomePage() {

  return (
    <div className="container">
      <div className="left">
        <h1>
          Allergy Free
          <br />
          Around Me
        </h1>
      </div>

      <div className="right">
        <h2>
          Find the food that
          <br />
          loves you back.
        </h2>
        <div className="heart"></div>
      </div>
    </div>
  );
}

export default HomePage;