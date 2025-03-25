import { Link } from "react-router-dom";


export function Navbar(){
    return(
        <>
            <Link to="/">Home</Link>
            <Link to="/profile">Profil</Link>
            <Link to="/favorites">Favoris</Link>
        </>
    )
}