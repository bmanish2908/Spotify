from flask import Flask, redirect, request
import requests
import urllib.parse

app = Flask(__name__)

clientId = "CLIENT_ID"
clientSecret = "CLIENT_SECRET"

redirectURI = "http://127.0.0.1:5000/callback"

token_url = "https://accounts.spotify.com/api/token"
auth_url = "https://accounts.spotify.com/authorize"
scope = "user-read-private user-read-email user-library-read playlist-read-private user-top-read"
scope += " user-read-playback-state user-read-currently-playing user-follow-read"

token = ""
refresh_token = ""

@app.route("/")
def home():
    return "<a href = '/login'>Sign In</a>"


@app.route("/login")
def login():
    params = {
        "client_id":clientId,
        "response_type":"code",
        "scope": scope,
        "redirect_uri": redirectURI,
    }

    newAuth_url = f"{auth_url}?{urllib.parse.urlencode(params)}"
    return redirect(newAuth_url)

@app.route("/callback")
def getToken():
    
    global token
    global refresh_token
    global expiry_time

    if "code" in request.args:
        authCode = request.args["code"]

        tokenData = {
            "grant_type": "authorization_code",
            "code": authCode,
            "redirect_uri": redirectURI,
            "client_id": clientId,
            "client_secret": clientSecret
        }

        response = requests.post(token_url, data=tokenData)

        tokenInfo = response.json()

        token = tokenInfo["access_token"]
        refresh_token = tokenInfo["refresh_token"]

        

        return redirect("http://192.168.1.9:3000/?token=" + token)
    
    else:
        return redirect("http://192.168.1.7:3000")


@app.route("/refresh-token")
def refreshToken():
    global refresh_token
    global token

    if refresh_token:
        tokenData = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": clientId,
            "client_secret": clientSecret
        }
    
        response = requests.post(token_url, data=tokenData)
        tokenInfo = response.json()

        token = tokenInfo["access_token"]

        print("Got the token")

        return redirect("http://192.168.1.7:3000/?token=" + token)
    

    else:
        print("Error getting refresh token") 
        return redirect("http://192.168.1.7:3000/")

if (__name__ == "__main__"):
    app.run(debug=True)