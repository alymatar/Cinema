import os
import json
from flask import Flask, request, Blueprint, jsonify

app = Flask(__name__)

BOOKING_FILE = 'bookings.json'
MOVIE_FILE = 'movies.json'

def init_data_files():
    if not os.path.exists(BOOKING_FILE):
        with open(BOOKING_FILE, 'w') as file:
            json.dump([], file)
    if not os.path.exists(MOVIE_FILE):
        with open(MOVIE_FILE, 'w') as file:
            json.dump([], file)

init_data_files()

booking_bp = Blueprint('booking', __name__)

@booking_bp.route('/api/booking', methods=['POST'])
def create_booking():
    data = request.get_json()
    name = data["name"]
    date = data["date"]
    time = data["time"]
    seat = data["seat"]

    with open(BOOKING_FILE, 'r+') as file:
        bookings = json.load(file)
        new_booking = {
            "id": len(bookings) + 1,
            "name": name,
            "date": date,
            "time": time,
            "seat": seat
        }
        bookings.append(new_booking)
        file.seek(0)
        json.dump(bookings, file, indent=4)

    return {"id": new_booking["id"], "message": f"Booking for {name} on {date} at {time} with seat {seat} created."}, 201

@booking_bp.route('/api/bookings', methods=['GET'])
def get_bookings():
    with open(BOOKING_FILE, 'r') as file:
        bookings = json.load(file)
    return jsonify(bookings), 200

@booking_bp.route('/api/bookings/<int:booking_id>', methods=['GET'])
def get_bookings_by_user(booking_id):
    with open(BOOKING_FILE, 'r') as file:
        bookings = json.load(file)
        user_bookings = [booking for booking in bookings if booking["id"] == booking_id]
    return jsonify(user_bookings), 200

@booking_bp.route('/api/booking/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    with open(BOOKING_FILE, 'r+') as file:
        bookings = json.load(file)
        booking_to_delete = next((booking for booking in bookings if booking["id"] == booking_id), None)
        if booking_to_delete:
            bookings.remove(booking_to_delete)
            file.seek(0)
            file.truncate()
            json.dump(bookings, file, indent=4)
            return {"message": f"Booking with ID {booking_id} deleted."}, 200
        else:
            return {"error": "Booking not found."}, 404

@booking_bp.route('/api/movies', methods=['GET'])
def get_movies():
    with open(MOVIE_FILE, 'r') as file:
        movies = json.load(file)
    return jsonify(movies), 200

def booking_blueprint(app):
    app.register_blueprint(booking_bp)