import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import User from '../UserContext';
import { fetchAPI } from '../util';
import { UserContext } from '../UserContext';
import Navbar from "../components/NavBar";
import '../styles/styles.css';


function Restaurant() {

    const { username, setUsername } = useContext(UserContext);
    const [error, setError] = useState('');
    // ADDED CODE

    // 'restaurants' holds current data, an array of entries
    // 'setRestaurants' is a function that updates the data
    const [restaurants, setRestaurants] = useState([]);

    // THIS IS WHAT WE'RE TRACKING FOR EACH ENTRY!!
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        food: "",
        notes: "",
        good_experience: true,
    });

    // trAcking whichs entry is expanded
    const [expandedIdx, setExpandedIdx] = useState(null);

    // adding state for selected items (so they can delete multiple entries later on)
    const [selected, setSelected] = useState([]);

    // tracks the current search term for the search bar
    const [searchTerm, setSearchTerm] = useState("");

    // HOUDA'S BACKEND ATTEMPT //
    // load in restaurants from backend...
    const loadRestaurants = async () => {
        try {
            const response = await fetchAPI("/api/restaurant/all", {
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
                const mapped = data.restaurants.map((r) => ({
                    id: r.restid,
                    name: r.name,
                    location: r.location,
                    food: r.food || "",
                    notes: r.notes || "",
                    good_experience: r.goodexp,
                }));
                setRestaurants(mapped);
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

    // this will handle inputs for name, location, food, and notes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // this will handle input for thumbs up/down rating
    const handleFeedback = (choice) => {
        setFormData({ ...formData, good_experience: choice });
    };

    // this will be the 'save entry' part
    // BACKEND UPDATE (?) SAVE ENTRY VIA BACKEND
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevents browser from refreshing on save entry
        if (!formData.name.trim()) return; // user cant save without restaurant name

        try {
            const response = await fetchAPI("/api/restaurant/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    location: formData.location,
                    food: formData.food,
                    notes: formData.notes,
                    goodExp: formData.good_experience,
                }),
            });

            const data = await response.json();

            if (!response.ok || data.status != "success") {
                console.error("Failed to add restaurant:", data);
                return;
            }

            // refresh the list from backend so we get the new item 
            await loadRestaurants();

            // reset input fields now so the user can make a new entry
            setFormData({ name: "", location: "", food: "", notes: "", good_experience: true });
        } catch (err) {
            console.error("Error adding restaurant:", err);
        }
        //setRestaurants([...restaurants, formData]); // adds the new entry to the state

    };

    // derive filtered list based on search term
    const filteredRestaurants = restaurants.filter((r) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true; // no search -> include everything

        return (
            r.name.toLowerCase().includes(q) ||
            (r.location && r.location.toLowerCase().includes(q)) ||
            (r.food && r.food.toLowerCase().includes(q)) ||
            (r.notes && r.notes.toLowerCase().includes(q))
        );
    });


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
                                className={`thumb-up ${formData.good_experience == true ? "active-thumb" : ""}`}
                                onClick={() => handleFeedback(true)}
                            >👍</span>
                            <span
                                className={`thumb-down ${formData.good_experience == false ? "active-thumb" : ""}`}
                                onClick={() => handleFeedback(false)}
                            >👎</span>
                        </div>

                        <button type="submit" className="save-btn">Save Entry</button>
                    </form>
                </section>

                <section className="entries-section card">
                    {/* adds the entry to the list*/}
                    <h2>Restaurant Entries <span style={{ fontSize: "0.6em" }}>(Click to expand.)</span></h2>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="🔍 Search your entries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <ul className="restaurant-list">
                        {restaurants.length === 0 && <li>No entries yet.</li>}

                        {restaurants.length > 0 && filteredRestaurants.length === 0 && searchTerm.trim() !== "" && (
                            <li>No matching entries.</li>
                        )}

                        {filteredRestaurants.map((r, i) => (
                            <li
                                key={r.id ?? i}
                                className={`restaurant-item ${expandedIdx == i ? "expanded" : ""}`}
                                onClick={() => setExpandedIdx(prev => (prev == i ? null : i))}
                            >
                                <div className="restaurant-summary">
                                    <span className="restaurant-name">{r.name}</span>

                                    <div className="summary-right">
                                        <span className={`small ${r.good_experience ? "thumb-up" : "thumb-down"}`}>
                                            {r.good_experience ? "👍" : "👎"}
                                        </span>
                                        <input
                                            type="checkbox"
                                            className="entry-checkbox"
                                            checked={selected.includes(r.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={() => {
                                                if (selected.includes(r.id)) {
                                                    setSelected(selected.filter(id => id !== r.id));
                                                } else {
                                                    setSelected([...selected, r.id]);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {expandedIdx == i && (
                                    <div className="restaurant-details">
                                        {r.location && (<p><b>Location:</b> {r.location}</p>)}
                                        {r.food && (<p><b>What you ordered:</b> {r.food}</p>)}
                                        {r.notes && (<p><b>Notes:</b> {r.notes}</p>)}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* leaving these commented in case it's needed later as a template
                    <li>Domino’s Pizza <span className="thumb-down small">👎</span></li>
                    <li className="highlighted">Madras Masala <span className="thumb-down small">👎</span></li>*/}

                    <button
                        className="delete-btn"
                        onClick={async () => {

                            try {
                                // delete each selected ID via backend
                                await Promise.all(
                                    selected.map((id) =>
                                        fetchAPI(`/api/restaurant/delete/${id}/`, {
                                            method: "DELETE",
                                        })
                                    )
                                );

                                // update local state
                                setRestaurants(
                                    restaurants.filter((r) => !selected.includes(r.id))
                                );
                                setSelected([]); // reset 
                            } catch (err) {
                                console.error("Error deleting restaurants:", err);
                            }
                            //setRestaurants(restaurants.filter((_, i) => !selected.includes(i)));
                            //setSelected([]); 
                        }}
                    >
                        Delete All Selected
                    </button>

                    {/*
                <div className="multi-select">
                    <select>
                    <option>Select Multiple</option>
                    </select>
                    <button className="delete-btn">Delete</button>
                </div>
                */}
                </section>
            </main>
        </>
    )



}

function RestaurantPage() {
    const { username, setUsername } = useContext(UserContext);
    return (
        <>
            {(username !== null) ? <Restaurant /> :
                <div>
                    <p> Go log in first!</p>
                    <Link to='/login'> Log in</Link>
                </div>
            }
        </>
    )
}

export default RestaurantPage;
