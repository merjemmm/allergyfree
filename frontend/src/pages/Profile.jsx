import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import User from '../UserContext';
import { fetchAPI } from '../util';
import { UserContext } from '../UserContext';
import Navbar from "../components/NavBar"
import '../styles/styles.css'

function Profile() {

    const { username, setUsername } = useContext(UserContext);
    const [error, setError] = useState('');


    let navigate = useNavigate();
    const [profileNameMessage, setProfileNameMessage] = useState('');
    const [profilePasswordMessage, setProfilePasswordMessage] = useState('');
    const [fullname, setFullname] = useState('');
    const [profileUserMessage, setProfileUserMessage] = useState('');

    const [categories, setCategories] = useState([]);

    // track which symptom toggles are actually on
    const [activeSymptoms, setActiveSymptoms] = useState([]);

    const fetchUserFullname = async () => {
        setError('');
        try {
            const response = await fetchAPI("/api/profile/fullname", {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else {
                setFullname(data.fullname);
            }
        } catch (e) {
            setError(e.message);
        }
    };

    useEffect(() => {
     fetchUserFullname();
    }, []);

    // all symptoms grouped by category from backend
    const [symptomsByCategory, setSymptomsByCategory] = useState({});

    // this is the color associated with each category (hard coded, for now)
    // TODO: make this so it isnt hardcoded anymore, maybe tie the color into the backend?
    /* reasoning is: want the colors to be consistent across the entire website
        also, since users will be able to add their own categories, they should be able to assign their own colors too
        we need to store whatever their chosen colors are and apply them
    */
    const CATEGORY_TO_COLOR = {
        "Dermatological": "red",
        "Respiratory": "orange",
        "Musculoskeletal": "green",
        "Mental / Cognitive": "blue",
        "GI / Intestinal": "purple",
    };
    const getPillColorClass = (category) => CATEGORY_TO_COLOR[category] || "pink";

    // helper func: make unique key of category+label
    const makeSymptomKey = (category, label) => `${category}::${label}`;

    // helper func: checks if a symptom is active 
    const isSymptomActive = (category, label) => activeSymptoms.includes(makeSymptomKey(category, label));

    // load all symptom categories (for the dropdown in the "add symptom log" form)
    const fetchSymptomCategories = async () => {
        try {
            setError('');
            const response = await fetchAPI("/api/profile/symptomcategories", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!response.ok) {
                // backend returns a simple list or something like {error: "..."}
                setError(data.error || "Failed to load categories");
                setCategories([]);
                return;
            }

            // data is just ["Dermatological", "Respiratory", ...etc]
            setCategories(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Error fetching categories", e);
            setError(e.message);
        }
    };

    // load all trackable symptoms (uses the defaults if needed, backend takes care of that)
    /* returns something like 
        data: [ 
            {symptom_category: "Dermatological", symptom_name: "Hives" },
            ... 
        ]
    */
    const loadSymptoms = async () => {
        try {
            const response = await fetchAPI("/api/profile/symptoms", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();

            if (!response.ok) {
                console.error("Failed to load symptoms:", data);
                setError(data.error || "Failed to load symptoms");
                return;
            }

            const list = Array.isArray(data)
                ? data
                : data && Array.isArray(data.data)
                    ? data.data
                    : [];

            const grouped = {};
            const activeKeys = [];

            list.forEach((s) => {
                const category = s.symptom_category || s.category;
                const name = s.symptom_name || s.name || s.symptom;
                if (!category || !name) return;

                // thiss  builds mapping by category -> [symptom names]
                if (!grouped[category]) {
                    grouped[category] = [];
                }
                if (!grouped[category].includes(name)) {
                    grouped[category].push(name);
                }

                // mark everything returned from the backend as "active"
                activeKeys.push(makeSymptomKey(category, name));
            });

            setSymptomsByCategory(grouped);
            setActiveSymptoms(activeKeys);

            // backend mightve defaulted categories 
            // so refresh for dropdown to see the newly added categories
            await fetchSymptomCategories();
        } catch (e) {
            console.error("Error fetching symptoms", e);
            setError(e.message);
        }
    };

    
    useEffect(() => { loadSymptoms(); }, []);

    // helper func: toggle a symptom on/off 
    // if the user toggles it off, it just gets deleted the next time they refresh
    // before refreshing, its just greyed out (not yet deleted from the page). 
    // they can turn it back on before its deleted as long as they didnt refresh yet
    // you can test this out to see what i mean
    const handleToggleSymptom = async (category, label) => {
        const key = makeSymptomKey(category, label);
        const currentlyActive = activeSymptoms.includes(key);

        setActiveSymptoms((prev) =>
            currentlyActive ? prev.filter((k) => k !== key) : [...prev, key]
        );

        try {
            const url = currentlyActive ? "/api/profile/removesymptom" : "/api/profile/addsymptom";

            const response = await fetchAPI(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category, symptom: label }),
            });

            const data = await response.json();

            if (!response.ok || data.status !== "success") {
                console.error("Toggle failed:", data);
                // rollback an optimistic update
                setActiveSymptoms((prev) =>
                    currentlyActive
                        ? [...prev, key]
                        : prev.filter((k) => k !== key)
                );
                setError(data.error || "Error toggling symptom");
            }
        } catch (e) {
            console.error("Error toggling symptom", e);
            // rollback optimistic update
            setActiveSymptoms((prev) =>
                currentlyActive
                    ? [...prev, key]
                    : prev.filter((k) => k !== key)
            );
            setError(e.message);
        }
    };

    // ADD CATEGORY form submission
    const handleAddCategory = async (event) => {
        event.preventDefault();
        setError('');

        const category = event.target.category.value.trim();
        if (!category) return;

        try {
            const response = await fetchAPI("/api/profile/addcategory", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category }),
            });

            const data = await response.json();

            if (!response.ok || data.status !== "success") {
                setError(data.error || data.message || "Could not add category");
                return;
            }

            // refresh the dropdown choices to include new category
            await fetchSymptomCategories();
            event.target.category.value = ''; //clear input field
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    // ADD SYMPTOM form submission
    const handleAddSymptom = async (event) => {
        event.preventDefault();
        setError('');

        const symptom = event.target.symptom.value.trim();
        const category = event.target.category.value;

        // requires both category + symptom input
        if (!symptom || !category) return;

        try {
            const response = await fetchAPI("/api/profile/addsymptom", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptom, category }),
            });

            const data = await response.json();

            if (!response.ok || data.status !== "success") {
                setError(data.error || data.message || "Could not add symptom");
                return;
            }

            // after adding symptom refresh everyting from BE
            await loadSymptoms();

            
            event.target.symptom.value = ''; //clear form
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    // Category dropdown component used in Add New Symptom form
    function CategoryList() {
        const options = categories.map((category) => (
            <option key={category} value={category}>
                {category}
            </option>
        ));

        return (
            <select name="category" defaultValue="">
                <option value="" disabled>
                    Select a category...
                </option>
                {options}
            </select>
        );
    }

    // logs out user
    const handleSignout = async (event) => {
        event.preventDefault();
        setError('');
        console.log("Clicked signout button");

        try {
            let response = await fetchAPI("/api/accounts/logout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                setUsername(null);
                navigate("/", { replace: true });
            }
            else {
                await response.json()
                    .then(d => setError(d.error));
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    const handleEditProfile = async (event) => {
        event.preventDefault();
        setError('');
        console.log("Clicked edit profile button");

        const newUsername = event.target.username.value;
        const newName = event.target.name.value;

        if (newUsername) {
            if (newUsername.includes(' ')) {
                console.log("username", newUsername);
                setError("Username can't have spaces");
            } else {
                try {
                    let response = await fetchAPI("/api/profile/edit/username", {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({newUsername}),
                    });
                    
                    if (response.ok) {
                        console.log("New Username ", newUsername);
                        setProfileUserMessage("Success in updating your Username");
                        setUsername(newUsername);
                        event.target.username.value = '';
                    } else {
                        // "Invalid credentials"
                        console.log("invalid try in username");
                        setError("Username already exists");
                        setProfileUserMessage("That username already exists, try again.");
                    }
                } catch (e) {
                    console.error(e);
                    setError(e.message);
                }
            }
        }

        if (newName) {
            try {
                let response = await fetchAPI("/api/profile/edit/fullname", {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({newName}),
                });
                
                if (response.ok) {
                    console.log("new Name ", newName);
                    setProfileNameMessage("Success in updating your Full Name");
                    setFullname(newName);
                    event.target.name.value = '';
                } else {
                    console.log("invalid try in new name")
                    setError("Something went wrong, try again");
                    setProfileNameMessage("Something went wrong, try updating your full name again.");
                    console.log(error)
                }
                // await response.json()
                //     .then(d => setError(d.error));
            } catch (e) {
                console.error(e);
                setError(e.message);
            }
        }
    };

    const handleEditPassword = async (event) => {
        event.preventDefault();
        setError('');
        console.log("Clicked edit password button");
        const oldPassword = event.target.old_password.value;
        const newPassword = event.target.confirm_password.value;
        if (newPassword !== event.target.password.value) {
            setError("Passwords don't match");
            return;
        }
        try {
            let response = await fetchAPI("/api/profile/edit/password", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({oldPassword, newPassword}),
            });

            if (response.ok) {
                setProfilePasswordMessage("Password updated successfully");

                event.target.old_password.value = '';
                event.target.password.value = '';
                event.target.confirm_password.value = '';
            } else {
                // "Invalid credentials"
                console.log("invalid try in password")
                setError("Something went wrong, try again!");
                setProfilePasswordMessage("Something went wrong, try again!");
                console.log(error)
            }
            let errorMessage = "Something went wrong";
            if (response.headers.get("content-type")?.includes("application/json")) {
                const data = await response.json();
                errorMessage = data.error || errorMessage;
            }
            setError(errorMessage);
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="wrap">
                <div className="grid">
                    <div>
                        <section className="card profile-card">
                            <h2>Current Profile Information</h2>

                            <label className="label">Full Name</label>
                            <h3 className="error">{fullname}</h3>

                            <label className="label">Username</label>
                            <h3 className="error">{username}</h3>
                        </section>

                        <section className="card profile-card">
                            <h2>Edit Profile Information</h2>

                            <form id="editprofile" method="post" onSubmit={handleEditProfile}>
                                <label className="label">New Full Name</label>
                                <input type="text" id="name" placeholder="Your name" />

                                {profileNameMessage && (
                                    <p className="success">{profileNameMessage}</p>
                                )}

                                <label className="label">New Username</label>
                                <input type="text" id="username" placeholder="funusernameexample" />

                                {profileNameMessage && (
                                    <p className="success">{profileUserMessage}</p>
                                )}

                                <button className="update-btn" type="submit">Update Profile</button>
                            </form>
                        </section>

                        <section className="card profile-card">
                            <h2>Edit Password</h2>

                            <form id="editpassword" method="post" onSubmit={handleEditPassword}>
                                
                                <label className="label">Current Password</label>
                                <input type="password" name="old_password" id="old_password" placeholder="Current Password" required />
                                <label className="label">New Password</label>
                                <input type="password" id="password" placeholder="Password" required/>
                                <label className="label">Retype Password</label>
                                <input type="password" id="confirm_password" placeholder="Confirm Password" required/>
                                {profilePasswordMessage && (
                                    <p className="success">{profilePasswordMessage}</p>
                                )}

                                <button className="update-btn" type="submit">Update Password</button>
                            </form>
                        </section>

                        <section className="card add-symptom-category">
                            <h2>Add New Symptom Category</h2>
                            <form method="post" onSubmit={handleAddCategory}>
                                <p className="muted">Input symptom categories for tracking</p>
                                <label className="label spaced">Symptom Category Name</label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    placeholder="e.g., Respiratory"
                                    required
                                />
                                <button className="add-btn">Add Category</button>
                            </form>
                        </section>

                        <section className="card add-symptom">
                            <h2>Add New Symptom</h2>
                            <p className="muted">Input your symptoms by category for tracking</p>

                            <form method="post" onSubmit={handleAddSymptom}>
                                <label className="label">Category</label>
                                <CategoryList />
                                <label className="label spaced">Symptom Name</label>
                                <input
                                    type="text"
                                    name="symptom"
                                    placeholder="e.g., Migraine"
                                    required
                                />

                                <button className="add-btn" type="submit">
                                    Add Symptom
                                </button>
                            </form>
                        </section>

                    </div>

                    <aside className="card symptoms-card">
                        <h2>
                            Symptoms to Track <span className="muted"><br />Click on symptoms to delete.</span>
                        </h2>

                        {/* For each category, it renders a section with colored sympto tags */}
                        {Object.entries(symptomsByCategory).map(([category, names]) => (
                            <div className="symptoms-section" key={category}>
                                <h3>{category}</h3>
                                <div className="tag-list">
                                    {names.map((name) => (
                                        <span
                                            key={name}
                                            className={`pill ${getPillColorClass(category)} ${isSymptomActive(category, name)
                                                    ? "pill--active"
                                                    : "pill--inactive"
                                                }`}
                                            onClick={() => handleToggleSymptom(category, name)}
                                            >
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </aside>

                    <div>
                        <section className="card profile-card">
                            <h2>Sign Out</h2>
                            <form id="signout" method="post" onSubmit={handleSignout}>
                                <button type="submit">Sign Out</button>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </>
    )

}

function ProfilePage() {
    const { username, setUsername } = useContext(UserContext);
    return (
        <>
            {(username !== null) ? <Profile /> :
                <div>
                    <p> Go log in first!</p>
                    <Link to='/login'> Log in</Link>
                </div>
            }
        </>
    )
}


export default ProfilePage;
