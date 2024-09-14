# Runs the Flask API server for fetching election/demographic data.

from flask import Flask, jsonify

# Initialize the Flask application
app = Flask(__name__)

# Define a route for the default URL ("/") and return JSON
@app.route('/')
def home():
    response = {
        'message': 'Welcome to the Flask API!',
        'status': 'success'
    }
    return jsonify(response)

# Another example route that returns dynamic JSON data
@app.route('/user/<username>')
def get_user(username):
    user_info = {
        'username': username,
        'status': 'active',
        'message': f'Hello, {username}!'
    }
    return jsonify(user_info)

# Main entry point to run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
