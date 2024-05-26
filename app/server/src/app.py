from flask import Flask


app = Flask(__name__)


@app.get("/")
def show_homepage():
    return "Hello, World!"
