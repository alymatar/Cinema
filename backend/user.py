import os
import json
from flask import Flask, request, Blueprint, jsonify
from datetime import date

app = Flask(__name__)

DATA_FILE = 'rooms.json'

def init_data_file():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as file:
            json.dump([], file)

init_data_file()

room_bp = Blueprint('user', __name__)

@room_bp.route('/api/register', methods=['POST'])
def create_room():
    data = request.get_json()
    name = data["name"]
    password = data["password"]
    date_str = data["date"]

    with open(DATA_FILE, 'r+') as file:
        rooms = json.load(file)
        new_room = {
            "id": len(rooms) + 1,
            "name": name,
            "password": password,
            "date": date_str
        }
        rooms.append(new_room)
        file.seek(0)
        json.dump(rooms, file, indent=4)

    return jsonify({"message": "Registered"}), 201

@room_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    name = data["name"]
    password = data["password"]
    print("Received login request:", data)

    with open(DATA_FILE, 'r') as file:
        rooms = json.load(file)
        room = next((room for room in rooms if room["name"] == name and room["password"] == password), None)
    
    if room:
        return {"message": "Login successful"}, 200
    else:
        return {"message": "Invalid name or password"}, 401

def register_room_blueprint(app):
    app.register_blueprint(room_bp)
