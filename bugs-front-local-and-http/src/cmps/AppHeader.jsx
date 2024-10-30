import { NavLink, useNavigate } from "react-router-dom"
import { UserMsg } from "./UserMsg.jsx"
import { useState } from "react"
import { LoginSignup } from "./LoginSignup.jsx"
import { userService } from "../services/user.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"




export function AppHeader() {


        // Will be in the store in the future~~
        const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())
        const navigate = useNavigate()
    
    
        async function onLogin(credentials) {
            console.log(credentials)
            try {
                const user = await userService.login(credentials)
                setLoggedinUser(user)
            } catch (err) {
                console.log('Cannot login :', err)
                showErrorMsg(`Cannot login`)
            } finally {
                navigate('/')
            }
        }
    
    
        async function onSignup(credentials) {
            console.log(credentials)
            try {
                const user = await userService.signup(credentials)
                setLoggedinUser(user)
                showSuccessMsg(`Welcome ${user.fullname}`)
            } catch (err) {
                console.log('Cannot signup :', err)
                showErrorMsg(`Cannot signup`)
            } finally {
                navigate('/')
            }
            // add signup
        }
    
    
        async function onLogout() {
            console.log('logout');
            try {
                await userService.logout()
                setLoggedinUser(null)
            } catch (err) {
                console.log('can not logout');
            } finally {
                navigate('/')
            }
            // add logout
        }
    
    return (
        <header className="app-header full main-layout">
            
            <section className="header-container">
                <h1>React bug App</h1>
               


                <section className="login-signup-container">
                    {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}


                    {loggedinUser && <div className="user-preview">
                        <h3>Hello {loggedinUser.fullname}</h3>
                        <button onClick={onLogout}>Logout</button>
                    </div>}
                </section>

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
