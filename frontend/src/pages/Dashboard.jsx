import { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../styles/styles.css";
import Heart from '../static/Heart.png';
import { UserContext } from '../UserContext';
import User from '../UserContext';
import { fetchAPI } from '../util';

function DashboardPage() {
  const username = useContext(UserContext);

  const [error, setError] = useState('');
  console.log("username on homepage:", username);

    const loadRestaurants = async () => {
        console.log("inside of rest")
        try {
            const response = await fetchAPI("/api/stats/plot", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json(); // parse json

            if (!response.ok) {
                console.error("Failed to load restaurants:", data);
                setError("error in loading restaurants")
                return;
            } else {
                // const mapped = data.restaurants.map((r) => ({
                //     id: r.restid,
                //     name: r.name,
                //     location: r.location,
                //     food: r.food || "",
                //     notes: r.notes || "",
                //     good_experience: r.goodexp,
                // }));
                // setRestaurants(mapped);
            }
        } catch (err) {
            console.error("Error loading restaurants:", err);
            setError(err);
        }
    };

    // call loadRestaurants
    useEffect(() => {
        loadRestaurants();
    }, []);


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
            <Link to="/signup" >
              &nbsp; Sign Up Here!
            </Link>
          </p>
        </div>
        <div>
          <p>Have an account? 
            <Link to="/login" >
              &nbsp; Log In Here!
            </Link>
          </p>
        </div>
      </div>
    </>

  );
}

export default DashboardPage;