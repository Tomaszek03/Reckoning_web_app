from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

def init_db():
    with sqlite3.connect('database.db') as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS transactions 
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, total_amount REAL, date TEXT)''')
        conn.commit()

init_db()

@app.route('/save', methods=['POST'])
def save_transaction():
    data = request.get_json()

    try:
        total_amount = float(data.get('total_amount'))
        if total_amount <= 0:
            return jsonify({"error": "Total amount must be greater than 0"}), 400
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid total amount"}), 400

    date = datetime.now().strftime('%Y-%m-%d')

    with sqlite3.connect('database.db') as conn:
        c = conn.cursor()
        c.execute("INSERT INTO transactions (total_amount, date) VALUES (?, ?)", (total_amount, date))
        conn.commit()

    return jsonify({"message": "Transaction saved successfully!"}), 201


@app.route('/history', methods=['GET'])
def get_transactions():
    with sqlite3.connect('database.db') as conn:
        c = conn.cursor()
        c.execute("SELECT * FROM transactions")
        transactions = c.fetchall()

    return jsonify(transactions), 200


@app.route('/summary/<month>', methods=['GET'])
def get_monthly_summary(month):
    with sqlite3.connect('database.db') as conn:
        c = conn.cursor()
        c.execute("SELECT SUM(total_amount) FROM transactions WHERE date LIKE ?", (f"{month}%",))
        total_amount = c.fetchone()[0] or 0

    return jsonify({"total_amount": total_amount}), 200


@app.route('/')
def home():
    return "Welcome to the Transaction API!"


if __name__ == '__main__':
    app.run(debug=True)
