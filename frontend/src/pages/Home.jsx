import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import "../styles/styles.css";
import Heart from '../static/Heart.png';
import { UserContext } from '../UserContext';
import User from '../UserContext';
import { fetchAPI } from '../util';

function HomePage() {
  const username = useContext(UserContext);
  console.log("username on homepage:", username);
  return (
    <>
			<div id="sidebar">
				<h1 id="title"> Allergy Free Around Me </h1>
			</div>
			<div id="login-content">
				<div id="slogan">
					<h2>Find the food that loves you back.</h2>
					<img src={Heart}/>
				</div>
        <div id="background-info">
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
            <Link to="/signup" id="bold-link">
              &nbsp; Sign Up Here!
            </Link>
          </p>
        </div>
        <div>
          <p>Have an account? 
            <Link to="/login" id="bold-link">
              &nbsp; Log In Here!
            </Link>
          </p>
        </div>
      </div>
    </>

  );
}

export default HomePage;