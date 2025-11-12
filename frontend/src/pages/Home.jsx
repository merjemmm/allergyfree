import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "../styles/styles.css";
import Heart from '../static/Heart.png'

function HomePage() {

  return (
    <>
			<div id="sidebar">
				<h1> Allergy Free Around Me </h1>
			</div>
			<div id="login-content">
				<div id="slogan">
					<h2>Find the food that loves you back.</h2>
					<img src={Heart}/>
				</div>
        <div>
          <p>
            Allergy Free Around Me is an all-in-one tool for managing your chronic 
            symptoms. Whether you have allergic reactions you'd like to track, 
            symptoms of chronic conditions you're managing, or other conditions 
            involving mysterious reactions or flareups, Allergy Free Around Me is 
            here to help.
          </p>
        </div>
        <div>
          <p>Don't have an account? 
            <Link to="/signup">
              Sign Up!
            </Link>
          </p>
        </div>
      </div>
    </>

  );
}

export default HomePage;