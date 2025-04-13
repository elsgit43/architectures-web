import { Navbar } from "./Components/Navbar"
import { Outlet } from "react-router-dom"
import { Searchbar } from "./Components/Searchbar"


export function Layout(){
    return(
        <>
            <Navbar/>
            <main>
                <Outlet/>
            </main>
        </>
    )
    
}