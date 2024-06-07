import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { ThemeContext } from './ThemeProvider';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const BookingManagement = () => {
    const { darkTheme, toggleTheme } = useContext(ThemeContext);
    const [bookings, setBookings] = useState([]);
    const [movies, setMovies] = useState([]);
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [newBooking, setNewBooking] = useState({
        name: '',
        date: '',
        time: '',
        seat: 0,
        movie: ''
    });
    const [seatExists, setSeatExists] = useState(false);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/bookings');
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/movies');
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchMovies();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBooking((prevBooking) => ({
            ...prevBooking,
            [name]: value
        }));
    };

    const checkSeatExists = (seat) => {
        return bookings.some(booking => booking.seat === parseInt(seat));
    };

    const handleAddBooking = async () => {
        if (checkSeatExists(newBooking.seat)) {
            setSeatExists(true);
            return;
        }

        try {
            await axios.post('http://127.0.0.1:5000/api/booking', newBooking);
            setNewBooking({
                name: '',
                date: '',
                time: '',
                seat: 0,
                movie: ''
            });
            setSeatExists(false);
            fetchBookings();
        } catch (error) {
            console.error('Error adding booking:', error);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/api/booking/${bookingId}`);
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/login');
    };

    if (!isLoggedIn) {
        navigate('/login');
        return <p>Please login to access the booking management page.</p>;
    }

    return (
        <div className={`container ${darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <div className="py-4">
                <h1 className="text-center">Booking Management</h1>
                <div className="my-4 p-4 border rounded d-flex justify-content-center align-items-center flex-column">
                    <h2 className="text-center mb-4">Add New Booking</h2>
                    <form className="w-75">
                    <div className="mb-3">
                            <label htmlFor="movie" className="form-label">Movie</label>
                            <select className="form-control form-control-lg" id="name" name="name" value={newBooking.name} onChange={handleInputChange}>
                                <option value="">Select a movie</option>
                                {movies.map(movie => (
                                    <option key={movie.id} value={movie.name}>{movie.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="date" className="form-label">Date</label>
                            <input type="date" className="form-control form-control-lg" id="date" name="date" value={newBooking.date} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="time" className="form-label">Time</label>
                            <input type="time" className="form-control form-control-lg" id="time" name="time" value={newBooking.time} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="seat" className="form-label">Seat</label>
                            <input type="number" className="form-control form-control-lg" id="seat" name="seat" value={newBooking.seat} onChange={handleInputChange} />
                            {seatExists && <div className="text-danger mt-2">Seat already exists. Please choose a different seat.</div>}
                        </div>
                        
                        <div className="text-center">
                            <button type="button" className="btn btn-primary btn-lg" onClick={handleAddBooking}>Add Booking</button>
                        </div>
                    </form>
                </div>
                <div className="my-4 p-4 border rounded">
                    <h2 className="text-center">Bookings</h2>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Movie</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Seat</th>                                
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td>{booking.name}</td>
                                    <td>{booking.date}</td>
                                    <td>{booking.time}</td>
                                    <td>{booking.seat}</td>                                    
                                    <td>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-secondary" onClick={toggleTheme}>Toggle Theme</button>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;
