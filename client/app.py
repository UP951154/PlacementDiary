from flask import Flask, render_template, request, redirect, url_for
import psycopg2
from connection import create_connection, insert, select

app = Flask(__name__)

@app.route('/')
def home():
    heading = request.args.get('page_heading')
    date = request.args.get('diary_header')
    
    print('date: ', date)
    print('heading: ', heading)
    return render_template('index.html')
if __name__ == '__main__':
    app.run(debug=True)
