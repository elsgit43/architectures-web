import { Link, useLocation } from "react-router-dom";
import { Searchbar } from "./Searchbar";


export function Navbar(){
    const location = useLocation();
    return(
        <>
        <div className="navbar">
            <h1>Ici ça cook</h1>
            <div className="nav-links">
                <Link to="/" className={location.pathname==="/" ? "active" : ""}>Home</Link>
                <Link to="/profile" className={location.pathname==="/profile" ? "active" : ""}>Profil</Link>
                <Link to="/favorites" className={location.pathname==="/favorites" ? "active" : ""}>Favoris</Link>
            </div>
            <Searchbar/>
        </div>
        
        </>
    )
}