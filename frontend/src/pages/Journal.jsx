import { useContext, useState, useEffect } from "react";
import { useNavigate, Link, resolvePath } from "react-router-dom";
import Select from 'react-select';
import User from '../UserContext';
import { fetchAPI } from '../util';
import { UserContext } from '../UserContext';
import Navbar from "../components/NavBar";
import '../styles/styles.css';


function Journal() {
    // const [meal, setMeal] = useState("");
    // const [food, setFood] = useState("");
    // const [ingredients, setIngredients] = useState("");
    // const [notes, setNotes] = useState("");
    // const [symptoms, setSymptoms] = useState("");
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        meal: "Snack",
        ingredients: "",
        food: "",
        notes: "",
        symptoms: "",

    });
    
    const [entries, setEntries] = useState([])
    const [entriesToday, setEntriesToday] = useState([])

    const mealTypes = [
        {value: "Snack", label: "Snack"},
        {value: "Breakfast", label: "Breakfast"},
        {value: "Lunch", label: "Lunch"},
        {value: "Dinner", label: "Dinner"}
    ]

    const loadTodayEntries = async() => {
        //e.preventDefault()
        const date = new Date()

        try {
            const response = await fetchAPI(`/api/journal/entries?month=${date.getMonth() + 1}&year=${date.getFullYear()}&day=${date.getDay()}`, {
                method: 'GET',
                headers: { 'Content-type': 'application/json' },
            });

            const data = await response.json(); // parse json

            console.log(data);

            if (!response.ok) {
                console.error("Failed to load journal entries for today:", data);
                setError("Cant retrieve journal entries for today.")
                return;
            } else {
                const mapped = data.entries.map((r) => ({
                    id: r.id,
                    name: r.name,
                    food: r.food || "",
                    notes: r.notes || "",
                    meal: r.meal,
                    ingred: r.ingredients,
                    symptoms: r.symptoms
                }));
                setEntriesToday(mapped);
            }
        } catch (err) {
            console.error("Error loading restaurants:", err);
        }
    };

    const loadEntries = async() => {
        //e.preventDefault()
        const date = new Date()

        try {
            const response = await fetchAPI(`/api/journal/entries?month=${date.getMonth() + 1}&year=${date.getFullYear()}`, {
                method: 'GET',
                headers: { 'Content-type': 'application/json' },
            });

            const data = await response.json(); // parse json

            console.log(data);

            if (!response.ok) {
                console.error("Failed to load journal entries:", data);
                setError("Cant retrieve journal entries for today.")
                return;
            } else {
                const mapped = data.entries.map((r) => ({
                    id: r.id,
                    name: r.name,
                    food: r.food || "",
                    notes: r.notes || "",
                    meal: r.meal,
                    ingred: r.ingredients,
                    symptoms: r.symptoms
                }));
                setEntries(mapped);
            }
        } catch (err) {
            console.error("Error loading restaurants:", err);
            setError("Cant retrieve journal entries for today.")
        }
    };

    useEffect(() => {
        loadEntries();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("inside of submit");
        if (!formData.food) return;

        try {
            const response = await fetchAPI("/api/journal/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            console.log(response);

            const data = await response.json();

            if (!response.ok || data.status != "success") {
                console.error("Failed to add restaurant:", data);
                setError("Cant retrieve journal entries for today.")
                return;
                
            }

            // refresh the list from backend so we get the new item 
            await loadEntries();
            setFormData({ meal: "Snack",
                ingredients: "",
                food: "",
                notes: "",
                symptoms: "",});
        } catch (err) {
            console.error("Error adding restaurant:", err);
            setError("Cant retrieve journal entries for today.")
        }

        // fetchAPI("/api/journal/add", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "Application/JSON",
        //   },
        //   body: JSON.stringify(journalInfo),
        // })
        //   .then((respose) => respose.json())
        //   .then((newEntry) => {
        //     setMeal("");
        //     setFood("");
        //     setIngredients("");
        //     setNotes("");
        //     setSymptoms("");
        //   })
        //   .then(() => retrieveAllEntries())
        //   .catch((error) => {
        //     console.log(error);
        //   });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
        <Navbar />

        <div className="main">
            <div className="left-panel card">
            <h3>New Food Journal Entry</h3>
            <p>Input your food and track associated symptoms</p>
            <form onSubmit={handleSubmit}>
                <label>Meal Type</label>
                <select
                    name="meal"
                    value={formData.meal}
                    onChange={handleChange}
                >
                    {mealTypes.map((m) => (
                        <option>
                            {m.value}
                        </option>
                    ))}
                </select>

                <label>Food Name</label>
                <input
                    type="text"
                    name="food"
                    placeholder="e.g., hummus and pita chips"
                    value={formData.food}
                    onChange={handleChange}
                />

                <label>Ingredients</label>
                <input
                    type="text"
                    name="ingredients"
                    placeholder="e.g., flour, yeast; chickpeas, tahini"
                    value={formData.ingredients}
                    onChange={handleChange}
                />

                <label>Notes</label>
                <textarea
                    type="text"
                    name="notes"
                    rows="3"
                    placeholder="Add any notes..."
                    value={formData.notes}
                    onChange={handleChange}
                />

                <label>Symptoms</label>
                <select
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                >
                    <option value="">Symptoms</option>
                    <option>Headache</option>
                    <option>Trouble breathing</option>
                </select>

                <button className="save-btn">Save Entry</button>
            </form>
            </div>

            <div className="right-panel">
            <div className="entry-card">
                <h3>Today's Entries</h3>
                <div className="entry-section">
                    {entries.map((entry) => (
                        <div className="entry"><span>{entry.meal}: {entry.food}</span><small>{entry.created}</small></div>
                    ))}
                </div>
            </div>

            <div className="entry-card">
                <h3>All Entries</h3>
                <div className="entry-section">
                    {entries.map((entry) => (
                        <div className="entry"><span>{entry.meal}: {entry.food}</span><small>{entry.created}</small></div>
                    ))}
                </div>
            </div>
            </div>
        </div>
        </>
    )
}

function JournalPage() {
    const {username, setUsername} = useContext(UserContext);
    return (
        <>
        {(username !== null) ? <Journal/> : 
        <div>
            <p> Go log in first!</p>
            <Link to='/login'> Log in</Link>
        </div>
        }
        </>
    )
}

export default JournalPage;
