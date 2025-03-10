import { Navbar } from "./Components/Navbar"
import { Outlet } from "react-router-dom"

export function Layout(){
    return(
        <>
            Bon app !
            <br/>
            <Navbar/>
            <main>
                <Outlet/>
            </main>
        </>
    )
    
}