// frontend/src/App.js
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import { Routes } from "react-router"
import HomePage from "./pages/Home";
// import ProfilePage from "./pages/Profile";
import AuthPage from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
        <Route path="/login" element={<AuthPage />} />
        {/* <Route path="/restaurants" element={<RestaurantPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/signup" element={<SignUpPage />} /> */}

      </Routes>
    </BrowserRouter>
  );
}
export default App;

