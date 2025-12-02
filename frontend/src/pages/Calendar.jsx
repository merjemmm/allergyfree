import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import User from '../UserContext';
import { fetchAPI } from '../util';
import { UserContext } from '../UserContext';
import Navbar from "../components/NavBar";
import '../styles/styles.css';

// this is where the colors for each category will be added (?) 
// sorry if this was already taken care of in the backend lol
const TYPE_TO_COLORS = {
    Dermatological: { dotClass: "red", tagClass: "red" },
    Respiratory: { dotClass: "blue", tagClass: "blue" },
    GI: { dotClass: "purple", tagClass: "purple" },
    Neurological: { dotClass: "pink", tagClass: "pink" },
    General: { dotClass: "green", tagClass: "green" },
};

function Calendar() {
    const today = new Date(); // get today's real date

    // state: which month is curr displayed on the cal
    // always store as the 1st of the month cuz easier for calendar math
    const [currentMonthDate, setCurrentMonthDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    // state: which day the user has selected on the RIGHT side panel
    const [selectedDate, setSelectedDate] = useState(today);

    // state: all sympt entries from backend, grouped by date
    const [entriesByDate, setEntriesByDate] = useState({});

    // state: whether the "add symptom" form is open or not
    const [showAddForm, setShowAddForm] = useState(false);

    // state: list of categories for the dropdown in add form
    const [categories, setCategories] = useState([]);

    // state: map category -> [symptom names] for selected category
    const [symptomsByCategory, setSymptomsByCategory] = useState({});

    // state: selected category in the add form
    const [newCategory, setNewCategory] = useState("");

    // state: selected symptom in the add form
    const [newSymptom, setNewSymptom] = useState("");

    // time of occurrence in the add form (default = curr time)
    const [newTime, setNewTime] = useState(() => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
    });



    // extract the years/months nums for convenience ...
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth(); //0-11

    // labels like "October 2025"
    const monthLabel = currentMonthDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    // helper func: formate date -> YYYY-MM-DD to use as a key into entriesByDate
    function dateKey(dateObj) {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, "0");
        const d = String(dateObj.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    // helper func: num days in given month
    function daysInMonth(y, m) {
        return new Date(y, m + 1, 0).getDate();
    }

    // helper func: checks if two dates refer to exact same cal day
    function isSameDay(a, b) {
        return (
            a.getFullYear() == b.getFullYear() &&
            a.getMonth() == b.getMonth() &&
            a.getDate() == b.getDate()
        );
    }

    // load sympt entries for the current month from the backend
    useEffect(() => {
        const monthParam = month + 1;
        const yearParam = year;
        const params = new URLSearchParams({
            month: monthParam.toString(),
            year: yearParam.toString(),
        });

        const loadEntries = async () => {
            try {
                const response = await fetchAPI(`/api/calendar/entries?${params.toString()}`, {
                    method: "GET",
                });

                const data = await response.json();

                if (!response.ok || data.status != "success") {
                    console.error("Failed to load calendar entries", data);
                    return;
                }

                const byDate = {}; //temp map: date string --> array of entries

                data.data.forEach((entry) => {
                    const key = entry.date;
                    if (!key) return;

                    if (!byDate[key]) {
                        byDate[key] = [];
                    }

                    byDate[key].push({
                        id: entry.id,
                        time: entry.time || "",
                        symptom: entry.symptom || "",
                        type: entry.type || "General",
                        notes: entry.notes || "",
                    });
                });

                setEntriesByDate(byDate);
            } catch (err) {
                console.error("Error fetching calendar entries", err);
            }
        };
        loadEntries();
    }, [year, month]); // re-run when the displayed month changes

    {/*
    //load categories 
    useEffect(() => {
        //returns plain list of category strings
        const loadCategories = async () => {
            try {
                const data = await fetchAPI("/api/profile/symptomcategories", {
                    method: "GET",
                });

                //const data = await response.json();
                console.log("symptomcategories response body:", data);

                if(!response.ok) {
                    console.error("Failed to fetch symptom categories", data);
                    return;
                }

                if(Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.warn("unexpected symptomcategories response", response);
                }
            } catch (err) {
                console.error("Error fetch symptom categories", err);
            }
        };
        loadCategories();
    }, []);
    */}

    // load categories 
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetchAPI("/api/profile/symptomcategories", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                console.log("symptomcategories response body:", data);

                if (!response.ok) {
                    console.error("Failed to fetch symptom categories", data);
                    return;
                }

                // backend returns a plain array: ["Dermatological", "Respiratory", ...]
                if (Array.isArray(data)) {
                    setCategories(data);
                } else if (data && Array.isArray(data.data)) {
                    setCategories(data.data);
                } else {
                    console.warn("Unexpected symptomcategories response", data);
                }
            } catch (err) {
                console.error("Error fetching symptom categories", err);
            }
        };

        loadCategories();
    }, []);


    // load symptoms grouped by category
    useEffect(() => {
        const loadSymptoms = async () => {
            try {
                const response = await fetchAPI("/api/profile/symptoms", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error("Failed to fetch symptoms list", data);
                    return;
                }

                const rawList = Array.isArray(data)
                    ? data
                    : data && Array.isArray(data.data)
                        ? data.data
                        : [];

                const byCat = {};

                rawList.forEach((s) => {
                    const cat = s.symptom_category || s.category;
                    const name = s.symptom_name || s.symptom;
                    if (!cat || !name) return;

                    if (!byCat[cat]) {
                        byCat[cat] = [];
                    }
                    if (!byCat[cat].includes(name)) {
                        byCat[cat].push(name);
                    }
                });

                setSymptomsByCategory(byCat);
            } catch (err) {
                console.error("Error fetching symptoms list", err);
            }
        };

        loadSymptoms();
    }, []);

    // ***STEP 1 - calc calendar grid contents

    // find weekday of first day of curr month
    const firstOfMonth = new Date(year, month, 1);
    const startWeekday = firstOfMonth.getDay();

    const numDaysThisMonth = daysInMonth(year, month); // days in curr month

    // days in prev month (which we'd need for faded cells)
    const numDaysPrevMonth = daysInMonth(year, month - 1);

    const cells = []; // this array will contain all 42 cells (6 rows*7cols)

    // ***STEP2-- the leading 'faded out' days from the prev month
    // these will go at the start of the calendar
    for (let i = startWeekday - 1; i >= 0; i--) {
        const dayNum = numDaysPrevMonth - i; //calc day number
        const dateObj = new Date(year, month - 1, dayNum); // make corr date obj
        cells.push({
            date: dateObj,
            inCurrentMonth: false,
        });

    }

    //**STEP 3-- days of the curernt month
    for (let d = 1; d <= numDaysThisMonth; d++) {
        const dateObj = new Date(year, month, d);
        cells.push({
            date: dateObj,
            inCurrentMonth: true,
        });
    }

    //*STEP 4 -- fill remaining cells with the next months days until we reach 42 cells
    while (cells.length < 42) {
        const lastDate = cells[cells.length - 1].date;
        const next = new Date(
            lastDate.getFullYear(),
            lastDate.getMonth(),
            lastDate.getDate() + 1
        );
        cells.push({
            date: next,
            inCurrentMonth: false,
        });
    }

    // STEP 5-- Navigation buttons
    // move backward by 1 month
    function goToPrevMonth() {
        setCurrentMonthDate(new Date(year, month - 1, 1));
    }

    //move forward by 1 month
    function goToNextMonth() {
        setCurrentMonthDate(new Date(year, month + 1, 1));
    }

    // jump back to the real world date
    function goToToday() {
        const t = new Date();
        setCurrentMonthDate(new Date(t.getFullYear(), t.getMonth(), 1));
        setSelectedDate(t);
    }

    // handle when user clicks a specific day cell
    function handleDayClick(cell) {
        setSelectedDate(cell.date);
        if (!cell.inCurrentMonth) {
            setCurrentMonthDate(
                new Date(cell.date.getFullYear(), cell.date.getMonth(), 1)
            );
        }
    }

    // pretty format the selected day label
    const selectedLabel = selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const selectedKey = dateKey(selectedDate);
    const entriesForSelectedDay = entriesByDate[selectedKey] || [];

    /*distinct types for selected day which are used for colored tags*/
    const selectedDayTypes = Array.from(
        new Set(entriesForSelectedDay.map((e) => e.type))
    );

    function handleAddClick() {
        setShowAddForm(true);
        setNewCategory("");
        setNewSymptom("");

        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        setNewTime(`${hh}:${mm}`);
    }

    // handle submitting to the add symptom form
    async function handleAddSubmit(e) {
        e.preventDefault();
        if (!newCategory || !newSymptom) {
            alert("Please choose both a category and a symptom.");
            return;
        }

        // combine selectedDate + newTime
        const [hourStr, minuteStr] = (newTime || "00:00").split(":");

        const dayKey = dateKey(selectedDate);

        const localDateTimeStr = `${dayKey}T${hourStr.padStart(2, "0")}:${minuteStr.padStart(2, "0")}:00`;

        const payload = {
            category: newCategory,
            symptom: newSymptom,
            date: localDateTimeStr,
            // notes: "" // optional?? idk
        };

        try {
            const response = await fetchAPI("/api/calendar/logsymptom", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok || data.status !== "success") {
                console.error("Failed to log symptom", data);
                return;
            }

            // update local state so the new log appears immediately
            const logged = Array.isArray(data.data) ? data.data[0] : data.data;
            const key = logged?.date || dayKey;
            const newEntry = {
                id: logged?.id ?? Date.now(),
                time: logged?.time ?? newTime,
                symptom: logged?.symptom ?? newSymptom,
                type: logged?.type ?? newCategory,
                notes: logged?.notes ?? "",
            };

            setEntriesByDate((prev) => {
                const existing = prev[key] || [];
                return {
                    ...prev,
                    [key]: [...existing, newEntry],
                };
            });

            setShowAddForm(false);
        } catch (err) {
            console.error("Error logging symptom", err);
        }
    }



    return (
        <>
            <Navbar />

            <main className="calendar-container card">
                {/*left side will display the actual calendar grid */}
                <section className="calendar card">
                    <div className="calendar-header">
                        <button className="arrow-btn" onClick={goToPrevMonth}>←</button>
                        <h2>{monthLabel}</h2>
                        <button className="arrow-btn" onClick={goToNextMonth}>→</button>
                    </div>
                    <hr />

                    <div className="calendar-grid">
                        {/*weekday labels at the top of the cal */}
                        <div className="day-label">SUN</div>
                        <div className="day-label">MON</div>
                        <div className="day-label">TUES</div>
                        <div className="day-label">WED</div>
                        <div className="day-label">THURS</div>
                        <div className="day-label">FRI</div>
                        <div className="day-label">SAT</div>

                        {/*these are the actual calendar day squares */}
                        {cells.map((cell) => {
                            const d = cell.date.getDate(); //day of month

                            // build className based on conditions
                            let dayClass = "day";
                            if (!cell.inCurrentMonth) dayClass += " faded"; //greys it out
                            if (isSameDay(cell.date, selectedDate)) dayClass += " selected"; //highlight around the day 

                            // look up entries for this date using the key
                            const key = dateKey(cell.date);
                            const dayEntries = entriesByDate[key] || [];
                            //this will fetch all the categories for the diff color dots
                            const dayTypes = Array.from(new Set(dayEntries.map((e) => e.type)));

                            // TODO: inject symptom dots here using symptom data
                            // example placeholder: <div className="dots">...</div>

                            return (
                                <div
                                    key={cell.date.toISOString()}
                                    className={dayClass}
                                    onClick={() => handleDayClick(cell)} >
                                    <span>{d}</span> {/**day num */}

                                    {dayTypes.length > 0 && (
                                        <div className="dots">
                                            {dayTypes.map((type) => {
                                                const colors = TYPE_TO_COLORS[type] || TYPE_TO_COLORS.General;
                                                return (
                                                    <span key={type} className={`dot ${colors.dotClass}`} ></span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    </div>

                </section>



                {/**RIGHT side - details panel for the selected day */}
                <section className="day-entries card">
                    <h2>Entries for {selectedLabel}</h2>

                    {/* Placeholder symptom group tags (TODO: will become dynamic) */}
                    <div className="tag-container">
                        {selectedDayTypes.length == 0 ? (
                            <span style={{ fontSize: "0.85rem", color: "#666" }}> No symptoms logged yet for this day.</span>
                        ) : (
                            selectedDayTypes.map((type) => {
                                const colors = TYPE_TO_COLORS[type] || TYPE_TO_COLORS.General;
                                return (
                                    <span key={type} className={`tag ${colors.tagClass}`}>{type}</span>
                                );
                            })
                        )}
                    </div>

                    {/*TODO: hook this button up */}
                    <button className="toggle-btn">Hide Detailed View</button>

                    {/*Actual entries for this day */}
                    <div className="entries-list">
                        {entriesForSelectedDay.length == 0 ? (
                            <span style={{ fontSize: "0.9rem", color: "#666" }}>You don't have any logged symptoms for this date yet.</span>
                        ) : (
                            entriesForSelectedDay.map((entry) => (
                                <div className="entry-row" key={entry.id}>
                                    <span className="entry-time">{entry.time}</span>
                                    <input
                                        type="text"
                                        value={entry.notes ? `${entry.symptom} - ${entry.notes}` : entry.symptom}
                                        readOnly
                                    />
                                </div>
                            ))
                        )}

                        {/*conditional add button OR the add form... */}
                        {showAddForm ? (
                            <form className="add-form" onSubmit={handleAddSubmit}>
                                <div className="add-form-row">
                                    <label>
                                        Symptom category
                                        <select
                                            value={newCategory}
                                            onChange={(e) => {
                                                setNewCategory(e.target.value);
                                                setNewSymptom(""); // reset symptom when category changes
                                            }}
                                        >
                                            <option value="">Select category...</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                <div className="add-form-row">
                                    <label>
                                        Symptom
                                        <select
                                            value={newSymptom}
                                            onChange={(e) => setNewSymptom(e.target.value)}
                                            disabled={!newCategory}
                                        >
                                            <option value="">
                                                {newCategory
                                                    ? "Select symptom..."
                                                    : "Choose a category first"}
                                            </option>
                                            {(symptomsByCategory[newCategory] || []).map((name) => (
                                                <option key={name} value={name}>
                                                    {name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                <div className="add-form-row">
                                    <label>
                                        Time of occurrence
                                        <input
                                            type="time"
                                            value={newTime}
                                            onChange={(e) => setNewTime(e.target.value)}
                                        />
                                    </label>
                                </div>

                                <div className="add-form-actions">
                                    <button type="submit" className="add-btn">
                                        Save symptom
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <button className="add-btn" onClick={handleAddClick}>+ Add more</button>
                        )}
                    </div>
                    <button className="today-btn" onClick={goToToday}>Go to today</button>
                </section>
            </main>
        </>
    );
}

function CalendarPage() {
    const { username, setUsername } = useContext(UserContext);
    return (
        <>
            {(username !== null) ? <Calendar /> :
                <div>
                    <p> Go log in first!</p>
                    <Link to='/login'> Log in</Link>
                </div>
            }
        </>
    )
}

export default CalendarPage;
