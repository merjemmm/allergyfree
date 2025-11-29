import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import User from '../UserContext';
import { fetchAPI } from '../util';
import { UserContext } from '../UserContext';
import Navbar from "../components/NavBar"
import '../styles/styles.css'

function Profile() {

    const {username, setUsername} = useContext(UserContext);
    const [categories, setCategories] = useState(null);
    const [symptomsByCategory, setSymptomsByCategory] = useState(null);
    const [symptoms, setSymptoms] = useState(null);

    let navigate = useNavigate();
    const [error, setError] = useState('');
    const [profileNameMessage, setProfileNameMessage] = useState('');
    const [profilePasswordMessage, setProfilePasswordMessage] = useState('');
    const [profileUserMessage, setProfileUserMessage] = useState('');

    // function GETs all categories to return in profile dropdown
    const fetchSymptomCategories = async () => {
        setError('');
        try {
            const response = await fetchAPI("/api/profile/symptomcategories", {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else {
                setCategories(data);
            }
        } catch (e) {
            setError(e.message);
        }
    }

    // should run every time categories is updated
    useEffect(() => {
     fetchSymptomCategories();
    }, []);

    // function GETS all symptoms and their categories to display on profile
    const fetchSymptomsByCategory = async () => {
        setError('');
        try {
            let response = await fetchAPI("/api/profile/symptomsbycategory", {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else {
                // this sets data for symptoms sorted by category
                setSymptomsByCategory(data);

            }
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    // should run every time symptoms are updated
    useEffect(() => {
     fetchSymptomsByCategory();
    }, []);

    // function GETS all symptoms and their categories to display on profile
    const fetchSymptoms = async () => {
        setError('');
        try {
            let response = await fetchAPI("/api/profile/symptoms", {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error);
            } else {
                // this sets data for symptoms
                setSymptoms(data);
                console.log(data);
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    // should run every time symptoms are updated
    useEffect(() => {
     fetchSymptoms();
    }, []);

    function CategoryList() {
        return (
            <select name="category" id="category" required>
            {categories?.map((category) => (
                <option key={category} value={category}>
                {category}
                </option>
            ))}
            </select>
        );
    }

    function SymptomByCategoryList() {
        if (!symptomsByCategory) {
            return <p>No symptoms yet</p>; // Handle null/undefined
        }
        return (
            <div>
                {Object.entries(symptomsByCategory).map(([category, symptomList]) => (
                <div className="symptoms-section"key={category}>
                    <h3>{category}</h3>
                    <div className="tag-list">
                        {symptomList.map((symptom, i) => (
                            // right now I render them all purple lol TODO fix
                            <span className="pill purple" key={i}>
                                {symptom}
                            </span>
                        ))}
                    </div>
                    
                </div>
                ))}
            </div>
        );
    }

    function SymptomList() {
        if (!symptoms) {
            return <p>No symptoms yet</p>; // Handle null/undefined
        }
        return (
            <select name="symptom" id="symptom" multiple={true} required>
                {symptoms?.map((symptom) => (
                    <option key={symptom} value={symptom}>
                    {symptom}
                    </option>
                ))}
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

    // adds new symptom category to db (POST)
    const handleAddCategory = async (event) => {
        event.preventDefault();
        setError('');
        console.log("Clicked add category button");

        const category = event.target.category.value;

        try {
            let response = await fetchAPI("/api/profile/addcategory", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, category}),
            });
            
            if (response.ok) {
                console.log("added category ", category);
                console.log("categories:", categories);
                // the below updates the symptom categories displayed on page
                fetchSymptomCategories();
                event.target.category.value = '';
            }
            await response.json()
                .then(d => setError(d.error));
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    // adds new symptom to db
    const handleAddSymptom = async (event) => {
        event.preventDefault();
        setError('');
        console.log("Clicked add symptom button");

        const adder = username;
        const symptom = event.target.symptom.value;
        const category = event.target.category.value;

        try {
            let response = await fetchAPI("/api/profile/addsymptom", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({adder, symptom, category}),
            });
            
            if (response.ok) {
                console.log("added symptom ", symptom);
            }
            await response.json()
                .then(d => setError(d.error));
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
        const newPassword = event.target.password.value;
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
                        event.target.username.value = '';
                    } else {
                        // "Invalid credentials"
                        console.log("invalid try in username");
                        setError("Username already exists");
                    }
                } catch (e) {
                    console.error(e);
                    setError(e.message);
                }
            }
        }

        // TODO - need to make more special teh password change
        if (newPassword) {
            try {
                let response = await fetchAPI("/api/profile/edit/password", {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({newPassword}),
                });
                
                if (response.ok) {
                    console.log("New Password ", newPassword);
                    event.target.password.value = '';
                } else {
                    // "Invalid credentials"
                    console.log("invalid try in password")
                    setError("Something went wrong, try again!");

                    console.log(error)
                }
                // await response.json()
                //     .then(d => setError(d.error));
            } catch (e) {
                console.error(e);
                setError(e.message);
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

                    event.target.name.value = '';
                } else {

                    console.log("invalid try in new name")
                    setError("Something went wrong, try again");

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

    return (
    <>
        <Navbar />
        <div className="wrap">
            <div className="grid">
            <div>

                {/* TODO - need something to display current information for user */}
                <section className="card profile-card">
                <h2>Current Profile Information</h2>

                <label className="label">Full Name</label>
                <h3 className="error">{profileNameMessage}</h3>

                <label className="label">Username</label>
                <h3 className="error">{username}</h3>

                </section>

                <section className="card profile-card">
                <h2>Edit Profile Information</h2>

                <form id="editprofile" method="post" onSubmit={handleEditProfile}>
                    <label className="label">New Full Name</label>
                    <input type="text" id="name" placeholder="Your name" />

                    {profileNameMessage && (
                    <p className="error">{profileNameMessage}</p>
                    )}

                    <label className="label">New Username</label>
                    <input type="text" id="username" placeholder="funusernamexample" />

                    {profileUserMessage && (
                    <p className="error">{profileUserMessage}</p>
                    )}


                    <label className="label">New Password</label>
                    <input type="password" id="password" placeholder="••••••••" />

                    {profilePasswordMessage && (
                    <p className="error">{profilePasswordMessage}</p>
                    )}


                    <button className="update-btn" type="submit">Update Profile</button>
                </form>
                </section>

                <section className="card add-symptom-category">
                    <h2>Add New Symptom Category</h2>
                    <form method="post" onSubmit={handleAddCategory}>
                        <p className="muted">Input symptom categories for tracking</p>
                        <label className="label spaced">Symptom Category Name</label>
                        <input type="text" id = "category" placeholder="e.g., Respiratory" required/>
                        <button className="add-btn">Add Category</button>
                    </form>
                
                </section>

                <section className="card add-symptom">
                <h2>Add New Symptom</h2>
                <p className="muted">Input your symptoms by category for tracking</p>
                <form method="post" onSubmit={handleAddSymptom}>
                    <label className="label">Category</label>
                    <CategoryList/>
                    <label className="label spaced">Symptom Name</label>
                    <input type="text" id = "symptom" placeholder="e.g., Migraine" required/>
                    <button className="add-btn">Add Symptom</button>
                </form>
                </section>
            </div>

            <aside className="card symptoms-card">
                <h2>Symptoms to Track <span className="muted">(select all that apply)</span></h2>

                <div className="symptoms-list">
                    <SymptomByCategoryList/>
                </div>

                 {/* TODO: handle deletion */}
                {/* <div className="controls">
                    <h2>Delete Symptoms <span className="muted">(select all)</span></h2>
                    <form method="post" onSubmit={handleDeleteSymptom}>
                    <label className="label"></label>
                    <SymptomList/>
                    <button className="add-btn">Delete Symptom(s)</button>
                    </form>
                </div> */}
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
    const {username, setUsername} = useContext(UserContext);
    return (
        <>
        {(username !== null) ? <Profile/> : 
        <div>
            <p> Go log in first!</p>
            <Link to='/login'> Log in</Link>
        </div>
        }
        </>
    )
}


export default ProfilePage;