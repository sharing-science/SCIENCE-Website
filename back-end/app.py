from os import access
from web3.auto import w3
from eth_account.messages import encode_defunct

from flask import Flask
from flask import jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token)

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "36babeb3b17611ea80862816a84a348ce8b25e23b23511eabbaf2816a84a348c05a4638bb23611ea919e2816a84a348c"
jwt = JWTManager(app)
CORS(app)

CODE = 7448
@app.route('/api/users')
def users():
    answer = {
           "id": 1,
           "nonce": CODE,
           "publicAddress": request.args.get('publicAddress'),
           "username": None
    }
    return jsonify([answer])

@app.route('/api/auth', methods=['POST'])
def auth():
    public_address = request.get_json()['publicAddress']
    signature = request.get_json()['signature']
    message = encode_defunct(text=f"I am signing my one-time nonce: {CODE}")
    PA = w3.eth.account.recover_message(message, signature=signature)
    info = {'publicAddress': PA}
    access_token = create_access_token(
                identity=info)
    return jsonify(access_token)