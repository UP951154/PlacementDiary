from flask import Flask, render_template, request, redirect, url_for
import psycopg2
from connection import create_connection, insert, select

app = Flask(__name__)

@app.route('/')
def home():
    print('Flask app running')
    return render_template('index.html')


@app.route('/process_data', methods=['POST', 'GET'])
def process_data():
    print('Processing data')
    try:
        data = request.get_json()
        
        date = data.get('date')
        work_description = data.get('work_description')
        experience_description = data.get('experience_description')
        competency = data.get('competency')

        
        insert(date, work_description, experience_description, competency)
        
        return render_template('index.html')
        

    except Exception as e:
        
        return f'Error processing data: {str(e)}', 500

if __name__ == '__main__':
    app.run(debug=True)
