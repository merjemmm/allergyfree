import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavBar"
import '../styles/styles.css'

function ProfilePage() {
    

    return (
        <>
        <Navbar />

        <div className="wrap">
        <div className="grid">
        <div>
            <section className="card profile-card">
            <h2>Edit Profile Information</h2>

            <label className="label">Name</label>
            <input type="text" placeholder="Your name" />

            <label className="label">Email</label>
            <input type="email" placeholder="you@example.com" />

            <label className="label">Password</label>
            <input type="password" placeholder="••••••••" />

            <button className="update-btn">Update Profile</button>
            </section>

            <section className="card add-symptom">
            <h2>Add New Symptom</h2>
            <p className="muted">Input your symptoms by category for tracking</p>

            <label className="label">Category</label>
            <select>
                <option>Mental / Cognitive</option>
                <option>Respiratory</option>
                <option>Dermatological</option>
                <option>GI / Intestinal</option>
            </select>

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
        </div>
        </div>


        </>
    )
}


export default ProfilePage;