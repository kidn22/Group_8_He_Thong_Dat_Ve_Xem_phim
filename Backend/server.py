from flask import Flask, request, jsonify
import json
import os
from flask_cors import CORS
import bcrypt

app = Flask(__name__)
CORS(app)

# ================== ĐƯỜNG DẪN FILE ==================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data.json")        # Lưu phim
ACCOUNT_FILE = os.path.join(BASE_DIR, "accounts.json") # Lưu tài khoản

# ================== HÀM CHUNG ==================
def load_data(file_path):
    """Đọc dữ liệu từ file JSON. Nếu chưa tồn tại thì tạo file rỗng."""
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=4)
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(file_path, data):
    """Ghi dữ liệu vào file JSON."""
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# ================== API PHIM ==================
@app.route("/movies", methods=["GET"])
def get_movies():
    return jsonify(load_data(DATA_FILE))

@app.route("/movies", methods=["POST"])
def add_movie():
    movies = load_data(DATA_FILE)
    new_movie = request.get_json()
    new_movie["id"] = movies[-1]["id"] + 1 if movies else 1
    movies.append(new_movie)
    save_data(DATA_FILE, movies)
    return jsonify(new_movie), 201

@app.route("/movies/<int:movie_id>", methods=["PUT"])
def update_movie(movie_id):
    movies = load_data(DATA_FILE)
    for i, movie in enumerate(movies):
        if movie["id"] == movie_id:
            movies[i].update(request.get_json())
            movies[i]["id"] = movie_id
            save_data(DATA_FILE, movies)
            return jsonify(movies[i])
    return jsonify({"error": "Movie not found"}), 404

@app.route("/movies/<int:movie_id>", methods=["DELETE"])
def delete_movie(movie_id):
    movies = load_data(DATA_FILE)
    movies = [m for m in movies if m["id"] != movie_id]
    save_data(DATA_FILE, movies)
    return jsonify({"message": "Deleted successfully"})

# ================== API TÀI KHOẢN ==================
@app.route("/register", methods=["POST"])
def register_account():
    accounts = load_data(ACCOUNT_FILE)
    data = request.get_json()

    # Lấy dữ liệu từ request
    fullName = data.get("fullName", "").strip()
    gender = data.get("gender", "").strip()
    phone = data.get("phone", "").strip()
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    # ======= Kiểm tra dữ liệu đầu vào =======
    if not all([fullName, gender, phone, username, password]):
        return jsonify({"error": "Thiếu thông tin"}), 400

    if not (phone.isdigit() and phone.startswith("0") and len(phone) == 10):
        return jsonify({"error": "Số điện thoại không hợp lệ"}), 400

    if len(password) < 6:
        return jsonify({"error": "Mật khẩu phải >= 6 ký tự"}), 400

    if any(acc["username"].lower() == username.lower() for acc in accounts):
        return jsonify({"error": "Tên đăng nhập đã tồn tại"}), 400

    # ======= Mã hóa mật khẩu =======
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Tạo tài khoản mới
    new_account = {
        "id": accounts[-1]["id"] + 1 if accounts else 1,
        "fullName": fullName,
        "gender": gender,
        "phone": phone,
        "username": username,
        "password": hashed_password,
        "role": "user"
    }

    accounts.append(new_account)
    save_data(ACCOUNT_FILE, accounts)

    return jsonify({"message": "Đăng ký thành công", "account": new_account}), 201


# ================== CHẠY SERVER ==================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
