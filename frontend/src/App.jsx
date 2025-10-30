// frontend/src/App.js
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import AuthPage from "./pages/Login"
import SignupPage from "./pages/Signup"
import JournalPage from "./pages/Journal"
import RestaurantPage from './pages/Restaurants';
import CalendarPage from './pages/Calendar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/restaurants" element={<RestaurantPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/profile" element={<ProfilePage />} />

      </Routes>
    </BrowserRouter>
  );
}
export default App;

