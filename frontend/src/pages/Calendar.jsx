import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import User from '../UserContext';
import { fetchAPI } from '../util';
import { UserContext } from '../UserContext';
import Navbar from "../components/NavBar";
import '../styles/styles.css';

function Calendar() {
    const [error, setError] = useState('');

    // const [formData, setFormData] = useState({
    //     meal: "Snack",
    //     ingredients: "",
    //     food: "",
    //     notes: "",
    //     symptoms: "",

    // });
    
    const [entries, setEntries] = useState([]);

    const loadEntries = async() => {
        //e.preventDefault()
        const date = new Date()

        try {
            const response = await fetchAPI(`/api/calendar/entries?month=${date.getMonth() + 1}`, {
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
                    // user: r.name,
                    type: r.type,
                    symptoms: r.symptom
                }));
                setEntries(mapped);
            }
        } catch (err) {
            console.error("Error loading calendar entries:", err);
            setError("Cant retrieve calendar entries for this month.")
        }
    };

    useEffect(() => {
        loadEntries();
    }, []);

    return (
        <>
        <Navbar />

        <main class="calendar-container">
            <section class="calendar card">
            <div class="calendar-header">
                <button class="arrow-btn">←</button>
                <h2>October 2025</h2>
                <button class="arrow-btn">→</button>
            </div>
            <hr />

            <div class="calendar-grid">
                <div class="day-label">SUN</div>
                <div class="day-label">MON</div>
                <div class="day-label">TUES</div>
                <div class="day-label">WED</div>
                <div class="day-label">THURS</div>
                <div class="day-label">FRI</div>
                <div class="day-label">SAT</div>

                <div class="day faded">28</div>
                <div class="day faded">29</div>
                <div class="day faded">30</div>
                <div class="day"><span>1</span><span class="dot blue"></span></div>
                <div class="day">2</div>
                <div class="day">3</div>
                <div class="day">4</div>

                <div class="day"><span>5</span><div class="dots"><span class="dot green"></span><span class="dot yellow"></span></div></div>
                <div class="day selected">
                    <span>14</span>
                    <div class="dots">
                        <span class="dot blue"></span>
                        <span class="dot pink"></span>
                        <span class="dot red"></span>
                    </div>
                </div>
            </div>
            </section>

            <section class="day-entries card">
            <h2>Entries for Tuesday\nOctober 14 2025</h2>

            <div class="tag-container">
                <span class="tag blue">Brain Fog</span>
                <span class="tag pink">Hives</span>
                <span class="tag red">Swelling</span>
                <span class="tag purple">Acid Reflux</span>
                <span class="tag lavender">Bloating</span>
            </div>

            <button class="toggle-btn">Hide detailed view</button>

            <div class="entries-list">
                <div class="entry-row">
                <span class="entry-time">9:47AM</span>
                <input type="text" value="Brain fog" />
                </div>
                <div class="entry-row">
                <span class="entry-time">10:21AM</span>
                <input type="text" value="Bloating, Acid reflux" />
                </div>
                <div class="entry-row">
                <span class="entry-time">11:43AM</span>
                <input type="text" value="Swelling" />
                </div>
                <button class="add-btn">+ Add more</button>
            </div>

            <button class="today-btn">Go to today</button>
            </section>
        </main>
        </>
    )
}

function CalendarPage() {
    const {username, setUsername} = useContext(UserContext);
    return (
        <>
        {(username !== null) ? <Calendar/> : 
        <div>
            <p> Go log in first!</p>
            <Link to='/login'> Log in</Link>
        </div>
        }
        </>
    )
}

export default CalendarPage;