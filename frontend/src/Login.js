import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from './ThemeProvider';
import { AuthContext } from './AuthContext';
import './login.css';

const Login = () => {
    const { darkTheme, toggleTheme } = useContext(ThemeContext);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // Use the context
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/login', {
                name,
                password,
            });
            setMessage(response.data.message);
            setIsLoggedIn(true);
           
        } catch (error) {
            console.error('There was an error logging in!', error);
            setMessage('Invalid name or password');
        }
    };

    if (isLoggedIn) {
        return navigate('/management');
    }

    return (
        <div className={darkTheme ? 'dark-theme' : 'light-theme'}>
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <button onClick={() => navigate('/register')}>Register</button>
                <button onClick={() => navigate('/management')}>Booking</button>
                <button className="theme-toggle-button" onClick={toggleTheme}>Toggle Theme</button>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default Login;
