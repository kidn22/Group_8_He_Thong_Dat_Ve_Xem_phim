from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Cho phép frontend truy cập

DATA_FILE = "data.json"

# Hàm đọc dữ liệu từ file JSON
def load_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=4)
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# Hàm ghi dữ liệu vào file JSON
def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# Lấy danh sách phim
@app.route("/movies", methods=["GET"])
def get_movies():
    return jsonify(load_data())

# Thêm phim
@app.route("/movies", methods=["POST"])
def add_movie():
    movies = load_data()
    new_movie = request.get_json()
    # Tạo id tự tăng
    new_movie["id"] = movies[-1]["id"] + 1 if movies else 1
    movies.append(new_movie)
    save_data(movies)
    return jsonify(new_movie), 201

# Sửa phim
@app.route("/movies/<int:movie_id>", methods=["PUT"])
def update_movie(movie_id):
    movies = load_data()
    for i, movie in enumerate(movies):
        if movie["id"] == movie_id:
            movies[i].update(request.get_json())
            movies[i]["id"] = movie_id  # đảm bảo id không bị đổi
            save_data(movies)
            return jsonify(movies[i])
    return jsonify({"error": "Movie not found"}), 404

# Xóa phim
@app.route("/movies/<int:movie_id>", methods=["DELETE"])
def delete_movie(movie_id):
    movies = load_data()
    movies = [m for m in movies if m["id"] != movie_id]
    save_data(movies)
    return jsonify({"message": "Deleted successfully"})

if __name__ == "__main__":
    # Chạy trên tất cả IP trong mạng LAN, port 3000
    app.run(host="0.0.0.0", port=3000, debug=True)
