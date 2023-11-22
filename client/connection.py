import psycopg2

def create_connection():
    
    db_credentials = {
        'host': 'localhost',
        'port': '5432',
        'user': 'vferreira',
        'database': 'diary'
    }
    
    return psycopg2.connect(**db_credentials)

def insert(date, text1, text2, text3):

    connection = create_connection()
    cursor = connection.cursor()

    try:
        query = "INSERT INTO diary_entry (date, text1, text2, text3) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (date, text1, text2, text3))
        connection.commit()
    finally:
        cursor.close()
        connection.close()

def select(date):

    connection = create_connection()
    cursor = connection.cursor()

    try:
        query = f"SELECT text1, text2, text3 FROM diary_entry WHERE date='{date}'"
        cursor.execute(query)
        result = cursor.fetchall()

        return result if result else 'no data'
    finally:
        cursor.close()
        connection.close()

