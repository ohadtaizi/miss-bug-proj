import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { userService } from "../services/user/user.service.local.js";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { logout } from '../store/actions/user.actions.js';


export function AppHeader() {




    // Will be in the store in the future~~
    const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())
    const user = useSelector(storeState => storeState.userModule.user)
    const navigate = useNavigate()






    async function onLogout() {
		try {
			await logout()
			navigate('/')
			showSuccessMsg(`Bye now`)
		} catch (err) {
			showErrorMsg('Cannot logout')
		}
	}


    return (
        <header className="app-header full main-layout">

            <section className="header-container">
                <h1>React bug App</h1>





                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/bug" >Bugs</NavLink>

                    {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}


                    {!user && <NavLink to="login" className="login-link">Login</NavLink>}
                    {user && (
                        <div className="user-info">
                            <Link to={`user/${user._id}`}>
                                {/* {user.imgUrl && <img src={user.imgUrl} />} */}
                                {user.fullname}
                            </Link>
                            {/* <span className="score">{user.score?.toLocaleString()}</span> */}
                            <button onClick={onLogout}>logout</button>
                        </div>
                    )}


                </nav>
            </section>
       
        </header>
    )
}
