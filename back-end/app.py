from flask import Flask
from flask import session
app = Flask(__name__)

@app.route('/api/auth')
def hello_world():
    return 'Hello, World!'