import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar"
import '../styles/styles.css'


function RestaurantPage(){

    return (
        <>
        <Navbar />

        <main className="main-container">
            <section className="entry-form card">
                <h2>New Restaurant Entry</h2>
                <form>
                    <label>Restaurant Name</label>
                    <input type="text" placeholder="Potbelly’s" />

                    <label>Location</label>
                    <input type="text" placeholder="300 S State St, Ann Arbor, MI 48104" />

                    <label>What did you eat from here?</label>
                    <input type="text" placeholder="Sandwich and chips" />

                    <label>Your Experience</label>
                    <textarea placeholder="Everything was good, no cross contamination!"></textarea>

                    <div className="feedback-icons">
                    <span className="thumb-up">👍</span>
                    <span className="thumb-down">👎</span>
                    </div>

                    <button type="submit" className="save-btn">Save Entry</button>
                </form>
            </section>

            <section className="entries-section card">
                <div className="search-bar">
                    <input type="text" placeholder="🔍 Search" />
                </div>

                <h2>Restaurant Entries</h2>
                <ul className="restaurant-list">
                    <li>Domino’s Pizza <span className="thumb-down small">👎</span></li>
                    <li>Molly’s Cupcakes <span className="thumb-up small">👍</span></li>
                    <li>No Thai! <span className="thumb-up small">👍</span></li>
                    <li>Chapala <span className="thumb-up small">👍</span></li>
                    <li className="highlighted">Madras Masala <span className="thumb-down small">👎</span></li>
                    <li>Fleetwood Diner <span className="thumb-up small">👍</span></li>
                    <li>Hola Seoul <span className="thumb-down small">👎</span></li>
                    <li>Chipotle <span className="thumb-down small">👎</span></li>
                    <li>Tomokun <span className="thumb-up small">👍</span></li>
                </ul>

                <div className="multi-select">
                    <select>
                    <option>Select Multiple</option>
                    </select>
                    <button className="delete-btn">Delete</button>
                </div>
            </section>
        </main>
        </>
    )



}

export default RestaurantPage;