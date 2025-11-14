import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar"
import '../styles/styles.css'


function RestaurantPage(){
    // ADDED CODE

    // 'restaurants' holds current data, an array of entries
    // 'setRestaurants' is a function that updates the data
    const [restaurants, setRestaurants] = useState([]);

    // this is what we'll track for each entry
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        food: "",
        notes: "",
        good_experience: true,
    });

    // this will handle inputs for name, location, food, and notes
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    // this will handle input for thumbs up/down rating
    const handleFeedback = (choice) => {
        setFormData({...formData, good_experience: choice});
    };

    // this will be the 'save entry' part
    const handleSubmit = (e) => {
        e.preventDefault(); // prevents browser from refreshing on save entry
        if (!formData.name.trim()) return; // user cant save without restaurant name
        setRestaurants([...restaurants, formData]); // adds the new entry to the state
        // reset input fields now so the user can make a new entry
        setFormData({name: "", location: "", food: "", notes: "", good_experience: true}); 
    };

    // END OF ADDED CODE...

    return (
        <>
        <Navbar />

        <main className="main-container">
            <section className="entry-form card">
                <h2>New Restaurant Entry</h2>
                <form onSubmit={handleSubmit}> {/*when form is submitted*/}
                    <label>Restaurant Name</label>
                    {/*for each input field i added event handlers */}
                    <div className="input-wrapper">
                        <input 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            type="text" 
                            placeholder="e.g., Potbelly’s" 
                        />
                    </div>
                    <br />

                    <label>Location</label>
                    <div className="input-wrapper">
                        <input 
                            name="location"
                            value={formData.location}
                            onChange={handleChange} 
                            type="text" 
                            placeholder="e.g., 300 S State St, Ann Arbor, MI 48104" 
                        />
                    </div>
                    <br />

                    <label>What did you eat from here?</label>
                    <div className="input-wrapper">
                        <input 
                            name="food"
                            value={formData.food}
                            onChange={handleChange}
                            type="text" 
                            placeholder="e.g., Sandwich and chips" 
                        />
                    </div>

                    <br />
                    <label>Your Experience</label>
                    <div className="input-wrapper">
                        <textarea 
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="e.g., Gluten free options. Everything was good, no cross contamination!">
                        </textarea>
                    </div>

                    <div className="feedback-icons">
                    <span 
                        className={`thumb-up ${formData.good_experience==true ? "active-thumb" : ""}`}
                        onClick={() => handleFeedback(true)} 
                    >👍</span>
                    <span 
                        className={`thumb-down ${formData.good_experience==false ? "active-thumb" : ""}`}
                        onClick={() => handleFeedback(false)}
                    >👎</span>
                    </div>

                    <button type="submit" className="save-btn">Save Entry</button>
                </form>
            </section>

            <section className="entries-section card">
                <div className="search-bar">
                    <input type="text" placeholder="🔍 Search" />
                </div>

                {/* adds the entry to the list*/}
                <h2>Restaurant Entries</h2>
                <ul className="restaurant-list">
                    {restaurants.length == 0 && <li>No entries yet.</li>}
                    {restaurants.map((r,i) => (
                        <li key={i}>
                            {r.name}
                            <span className={`small ${r.good_experience ? "thumb-up" : "thumb-down"}`}>
                                {r.good_experience ? "👍" : "👎"}
                            </span>
                        </li>
                    ))}

                    {/* leaving these commented in case it's needed later as a template
                    <li>Domino’s Pizza <span className="thumb-down small">👎</span></li>
                    <li className="highlighted">Madras Masala <span className="thumb-down small">👎</span></li>*/}
                </ul>
                {/*TODO: add the delete btn functionality */}
                {/*TODO: allow users to 'expand' an entry to view details */}
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
