# app.py
from flask import Flask
from user import register_room_blueprint
from booking import booking_blueprint
from flask_cors import CORS   

app = Flask(__name__)

CORS(app)

# Register the blueprint
register_room_blueprint(app)
booking_blueprint(app)

if __name__ == '__main__':
    app.run(debug=True)
