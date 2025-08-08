from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Cho phép frontend truy cập

DATA_FILE = "data.json"

# Hàm đọc dữ liệu
def read_data():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

# Hàm ghi dữ liệu
def write_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# API lấy toàn bộ phim
@app.route("/movies", methods=["GET"])
def get_movies():
    return jsonify(read_data())

# API thêm phim
@app.route("/movies", methods=["POST"])
def add_movie():
    new_movie = request.json
    data = read_data()
    data.append(new_movie)
    write_data(data)
    return jsonify({"message": "Thêm phim thành công"}), 201

if __name__ == "__main__":
    app.run(port=3000, debug=True)
