import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import BookingManagement from './BookingManagement';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthContext'; // Import AuthProvider and AuthContext

const App = () => {

    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/management" element={<BookingManagement />} />
                    </Routes>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
