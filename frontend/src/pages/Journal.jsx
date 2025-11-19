import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Select from 'react-select';
import User from '../UserContext';
import { fetchAPI } from '../util';
import { UserContext } from '../UserContext';
import Navbar from "../components/NavBar";
import '../styles/styles.css';


function Journal() {
    const [meal, setMeal] = useState("");
    const [food, setFood] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [notes, setNotes] = useState("");
    const [symptoms, setSymptoms] = useState("");
    
    const [entries, setEntries] = useState([])

    const mealTypes = [
        {value: "Snack", label: "Snack"},
        {value: "Breakfast", label: "Breakfast"},
        {value: "Lunch", label: "Lunch"},
        {value: "Dinner", label: "Dinner"}
    ]

    const retrieveEntries = function (e) {
        //e.preventDefault()
        const date = new Date()
        fetchAPI(`/api/journal/entries?month=${date.getMonth()}&year=${date.getFullYear()}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
        .then((resp) => resp.json())
        .then((json) => {
            setEntries(json.data)
        })
    }

    useEffect(() => {
        let ignore = false;
        if (!ignore)  retrieveEntries()
        return () => { ignore = true; }
    },[]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const journalInfo = {
          meal: meal,
          food: food,
          ingredients: ingredients,
          notes: notes,
          symptoms: symptoms
        };

        fetchAPI("/api/journal/add", {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
          },
          body: JSON.stringify(journalInfo),
        })
          .then((respose) => respose.json())
          .then((newEntry) => {
            setMeal("");
            setFood("");
            setIngredients("");
            setNotes("");
            setSymptoms("");
          })
          .then(() => retrieveEntries())
          .catch((error) => {
            console.log(error);
          });
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
                    value={meal}
                    onChange={(event) => setMeal(event.target.value)}
                >
                    {mealTypes.map((meal) => (
                        <option>
                            {meal.value}
                        </option>
                    ))}
                </select>

                <label>Food Name</label>
                <input
                    type="text"
                    name="food name"
                    placeholder="e.g., hummus and pita chips"
                    value={food}
                    onChange={(event) => setFood(event.target.value)}
                />

                <label>Ingredients</label>
                <input
                    type="text"
                    name="ingredients"
                    placeholder="e.g., flour, yeast; chickpeas, tahini"
                    value={ingredients}
                    onChange={(event) => setIngredients(event.target.value)}
                />

                <label>Notes</label>
                <textarea
                    type="text"
                    name="notes"
                    rows="3"
                    placeholder="Add any notes..."
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                />

                <label>Symptoms</label>
                <select
                    name="symptoms"
                    value={meal}
                    onChange={(event) => setSymptoms(event.target.value)}
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
                <div className="entry">
                    <span>Lunch: PB&J</span>
                    <small>12:32 PM</small>
                </div>
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
