import { Navbar } from "./Components/Navbar"
import { Outlet } from "react-router-dom"
import { Searchbar } from "./Components/Searchbar"


export function Layout(){
    return(
        <>
            Bon app !
            <br/>
            <Navbar/>
            <Searchbar/>
            <main>
                <Outlet/>
            </main>
        </>
    )
    
}