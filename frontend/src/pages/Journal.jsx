import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar"
import '../styles/styles.css'

function JournalPage() {
    



    return (
        <>
        <Navbar />

        <div className="main">
            <div className="left-panel card">
            <h3>New Food Journal Entry</h3>
            <p>Input your food and track associated symptoms</p>

            <label>Meal type</label>
            <select>
                <option>Snack</option>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
            </select>

            <label>Food Name</label>
            <input type="text" placeholder="e.g., hummus and pita chips"/>

            <label>Ingredients</label>
            <input type="text" placeholder="e.g., flour, yeast; chickpeas, tahini"/>

            <label>Notes</label>
            <textarea placeholder="Add any notes..."></textarea>

            <label>Symptoms (select all that apply)</label>
            <div className="symptom-list">
                <button className="symptom">Headache</button>
                <button className="symptom">Nausea</button>
                <button className="symptom">Stomach Pain</button>
                <button className="symptom">Joint Pain</button>
                <button className="symptom">Vomiting</button>
                <button className="symptom">Hives/Rash</button>
                <button className="symptom">Bloating</button>
                <button className="symptom">Swelling</button>
                <button className="symptom">Dizziness</button>
            </div>

            <button className="save-btn">Save Entry</button>
            </div>

            <div className="right-panel">
            <div className="entry-card">
                <h3>Today's Entries</h3>
                <div className="entry-section">
                <div className="entry">
                    <span>Lunch: PB&J</span>
                    <small>12:32 PM</small>
                </div>
                </div>
            </div>

            <div className="entry-card">
                <h3>All Entries</h3>
                <div className="entry-section">
                <div className="entry"><span>Lunch: caesar salad</span><small>Oct 20, 2025</small></div>
                <div className="entry"><span>Snack: hummus and pita chips</span><small>Oct 20, 2025</small></div>
                <div className="entry"><span>Breakfast: blueberry pancakes</span><small>Oct 12, 2025</small></div>
                <div className="entry"><span>Lunch: PB&J</span><small>Oct 12, 2025</small></div>
                <div className="entry"><span>Snack: granola oats and honey bar</span><small>Oct 12, 2025</small></div>
                <div className="entry"><span>Dinner: spaghetti and garlic bread</span><small>Oct 12, 2025</small></div>
                <div className="entry"><span>Breakfast: eggs on toast</span><small>Oct 11, 2025</small></div>
                <div className="entry"><span>Lunch: grilled cheese and potato chips</span><small>Oct 11, 2025</small></div>
                <div className="entry"><span>Snack: peanut butter and bananas</span><small>Oct 11, 2025</small></div>
                </div>
            </div>
            </div>
        </div>
        </>
    )
}

export default JournalPage;
