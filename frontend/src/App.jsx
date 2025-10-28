// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import AuthPage from "./pages/Login"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/restaurants" element={<RestaurantPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/signup" element={<SignUpPage />} />

      </Routes>
    </Router>
  );
}
export default App;
