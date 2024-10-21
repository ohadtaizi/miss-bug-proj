import { NavLink } from "react-router-dom"
import { UserMsg } from "./UserMsg.jsx"


export function AppHeader() {
    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React bug App</h1>
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/bug" >Bugs</NavLink>
                </nav>
            </section>
            <UserMsg/>
        </header>
    )
}
