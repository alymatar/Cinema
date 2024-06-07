import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from './ThemeProvider'; // Ensure this import path is correct
import './register.css';

const Register = () => {
    const { darkTheme, toggleTheme } = useContext(ThemeContext);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/register', {
                name,
                password,
                date,
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('There was an error creating the room!', error);
            setMessage('Error creating room');
        }
    };
    

    return (
        <div className={darkTheme ? 'dark-theme' : 'light-theme'}>
            <div className="register-form">
            <h1>Register</h1>
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
                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <button onClick={() => navigate('/login')}>Go to Login</button>
            <button className="theme-toggle-button" onClick={toggleTheme}>
                Toggle Theme
            </button>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
};

export default Register;
