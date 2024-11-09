import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'


import { userService } from '../services/user'
import { login } from '../store/actions/user.actions'


export function Login() {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState({ username: '', password: '' });


    const navigate = useNavigate()


    useEffect(() => {
        loadUsers()
    }, [])


    async function loadUsers() {
        const users = await userService.getUsers()
        setUsers(users)
    }


    async function onLogin(ev = null) {
        if (ev) ev.preventDefault();
    
        if (!credentials.username || !credentials.password) {
            console.error('Username and password are required');
            return;
        }
    
        try {
            await login(credentials);
            navigate('/');
        } catch (err) {
            console.error('Login failed:', err);
        }
    }
    


    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }
    
    return (
        <form className="login-form" onSubmit={onLogin}>
        <input
            type="text"
            name="username"
            value={credentials.username}
            placeholder="Username"
            onChange={handleChange}
            required
        />
        <input
            type="password"
            name="password"
            value={credentials.password}
            placeholder="Password"
            onChange={handleChange}
            required
        />
        <button>Login</button>
    </form>
    )
}
