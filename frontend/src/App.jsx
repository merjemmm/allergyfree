// frontend/src/App.js
import { BrowserRouter, Routes, Route} from 'react-router-dom';
// import { Routes } from "react-router"
import HomePage from "./pages/Home";
// import ProfilePage from "./pages/Profile";
import AuthPage from "./pages/Login"
import SignupPage from "./pages/Signup"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route path="/restaurants" element={<RestaurantPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/calendar" element={<CalendarPage />} /> */}

      </Routes>
    </BrowserRouter>
  );
}
export default App;

