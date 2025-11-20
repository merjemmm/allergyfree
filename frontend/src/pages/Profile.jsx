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

    function CategoryList() {
        const CategoryList = categories?.map(category => <option>{category}</option>);
        return <select>{CategoryList}</select>;
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

        const symptom = event.target.symptom.value;
        const category = event.target.category.value;

        try {
            let response = await fetchAPI("/api/profile/addsymptom", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, symptom, category}),
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
                        setProfileUserMessage("Sucess in updating your Username");
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

                {/* TODO - need something to display current infomration for user */}
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
                    <input id="username" placeholder="funusernamexample" />

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
                    <   button className="add-btn">Add Category</button>
                    </form>
                
                </section>

                <section className="card add-symptom">
                <h2>Add New Symptom</h2>
                <p className="muted">Input your symptoms by category for tracking</p>

                <label className="label">Category</label>
                <CategoryList/>

                <label className="label spaced">Symptom Name</label>
                <input type="text" placeholder="e.g., Migraine" />

                <button className="add-btn">Add Symptom</button>
                </section>
            </div>

            <aside className="card symptoms-card">
                <h2>Symptoms to Track <span className="muted">(select all that apply)</span></h2>

                <div className="symptoms-section">
                <h3>Dermatological</h3>
                <div className="tag-list">
                    <span className="pill pink">Swelling</span>
                    <span className="pill pink">Hives</span>
                    <span className="pill pink">Itchiness</span>
                    <span className="pill pink">Rash</span>
                    <span className="pill pink">Numbness</span>
                </div>
                </div>

                <div className="symptoms-section">
                <h3>Respiratory</h3>
                <div className="tag-list">
                    <span className="pill orange">Sneezing Fit</span>
                    <span className="pill orange">Throat Tightness</span>
                    <span className="pill orange">Congestion</span>
                    <span className="pill orange">Coughing</span>
                </div>
                </div>

                <div className="symptoms-section">
                <h3>Musculoskeletal</h3>
                <div className="tag-list">
                    <span className="pill green">Joint Pain</span>
                    <span className="pill green">Muscle Ache</span>
                    <span className="pill green">Cramping</span>
                    <span className="pill green">Limb Weakness</span>
                </div>
                </div>

                <div className="symptoms-section">
                <h3>Mental / Cognitive</h3>
                <div className="tag-list">
                    <span className="pill blue">Brain Fog</span>
                    <span className="pill blue">Irritability</span>
                    <span className="pill blue">Dizziness</span>
                    <span className="pill blue">Headache</span>
                    <span className="pill blue">Anxiety</span>
                    <span className="pill blue">Fatigue</span>
                </div>
                </div>

                <div className="symptoms-section">
                <h3>GI / Intestinal</h3>
                <div className="tag-list">
                    <span className="pill purple">Acid Reflux</span>
                    <span className="pill purple">Bloating</span>
                    <span className="pill purple">Vomiting</span>
                    <span className="pill purple">Nausea</span>
                </div>
                </div>

                {/* <div className="symptoms-list">
                <p className="muted">Selected symptoms or additional options would appear here. This panel is scrollable when long.</p>
                </div> */}

                <div className="controls">
                <select>
                    <option>Select Multiple</option>
                </select>
                <button className="delete">Delete</button>
                </div>
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