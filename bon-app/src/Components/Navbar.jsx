import { Link } from "react-router-dom";
import cuisine from "../assets/cuisine.jpeg"


export function Navbar(){
    return(
        <>
        <div className="navbar">
            <Link to="/">Home</Link>
            <Link to="/profile">Profil</Link>
            <Link to="/favorites">Favoris</Link>
        </div>
        </>
    )
}