from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')

# Lấy danh sách phim
@app.route('/movies', methods=['GET'])
def get_movies():
    if not os.path.exists(DATA_FILE):
        return jsonify([])
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify(data)

# Ghi danh sách phim
@app.route('/movies', methods=['POST'])
def save_movies():
    movies = request.json
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(movies, f, ensure_ascii=False, indent=2)
    return jsonify({"message": "Lưu thành công!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
