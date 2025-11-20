import { Link, useLocation } from "react-router-dom";
import '../styles/styles.css'

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
        <div className="navbar">
            <div className="navbar-left">A.F.A.M</div>
            <div className="navbar-center">
                <Link
                to="/restaurants"
                className={isActive("/restaurants") ? "nav-item active" : "nav-item"}
                >
                🌟 Restaurant Log
                </Link>
                <Link
                to="/journal"
                className={isActive("/journal") ? "nav-item active" : "nav-item"}
                >
                🌟 Food Journal
                </Link>
                <Link
                to="/calendar"
                className={isActive("/calendar") ? "nav-item active" : "nav-item"}
                >
                🌟 Calendar
                </Link>
            </div>
            <div className="navbar-right">
                <Link to="/profile" 
                className={isActive("/profile") ? "nav-item active" : "nav-item"}>
                    👤 Profile
                </Link>
            </div>
    </div>
  );
}


export default Navbar;


// function Navbar() {


//     return (
//         <div className="navbar">
//             <div className="navbar-left">A.F.A.M</div>
//             <div className="navbar-center">
//                 <Link to="/restaurants" className="nav-item">
//                     🌟 Restaurant Log
//                 </Link>
//                 <Link to="/journal" className="nav-item active">
//                     🌟 Food Journal
//                 </Link>
//                 <Link to="/calendar" className="nav-item">
//                     🌟 Calendar
//                 </Link>
//             </div>
//             <div className="navbar-right">
//                 <Link to="/profile">
//                 {/* TODO Prettify */}
//                     👤
//                 </Link>
//             </div>
//         </div>
//     )



// };