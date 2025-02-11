from flask import Flask, render_template, request, jsonify
import sqlite3
import requests

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect("tasks.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def index():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM tasks")
    tasks = cur.fetchall()
    conn.close()
    return render_template("index.html", tasks=tasks)

@app.route("/add", methods=["POST"])
def add_task():
    task = request.form["task"]
    due_date = request.form["due_date"]
    description = request.form["description"]

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO tasks (name, due_date, description, completed) VALUES (?, ?, ?, ?)",
        (task, due_date, description, 0),
    )
    conn.commit()
    task_id = cur.lastrowid
    conn.close()

    return jsonify({"id": task_id, "task": task, "due_date": due_date, "description": description, "completed": False})

@app.route("/weather")
def get_weather():
    city = request.args.get("city", "Johannesburg")
    params = {
        "q": city,
        "appid": "ccb110164bcc121f563f7ff988406209",
        "units": "metric",
    }
    response = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params)

    if response.status_code == 200:
        data = response.json()
        return jsonify({
            "city": data["name"],
            "temperature": data["main"]["temp"],
            "description": data["weather"][0]["description"],
        })
    return jsonify({"error": "Could not fetch weather data"}), response.status_code

if __name__ == "__main__":
    app.run(debug=True)
