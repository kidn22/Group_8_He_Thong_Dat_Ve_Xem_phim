let moviesData = [];
const movieList = document.getElementById('movie-list');
const timeGrid = document.querySelector('.time-grid');
const addBtn = document.querySelector('.btn-add');
const toggleHeading = document.querySelector('.toggle-heading');
const timeGridWrapper = document.querySelector('.time-grid-wrapper');
const arrowIcon = document.querySelector('.arrow-icon');

// Config server URL
const SERVER_URL = window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "http://192.168.1.5:3000"; // IP LAN máy chạy server

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function generateTimeSlots(startHour, endHour, intervalMinutes) {
    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            const timeStr = `${padZero(hour)}:${padZero(minute)}`;
            const timeDiv = document.createElement('div');
            timeDiv.classList.add(
                'time-slot', 'py-1', 'px-2', 'rounded-md', 'bg-gray-200',
                'hover:bg-gray-300', 'cursor-pointer', 'transition-colors', 'text-center'
            );
            timeDiv.textContent = timeStr;
            timeDiv.dataset.value = timeStr;
            timeDiv.addEventListener('click', () => {
                timeDiv.classList.toggle('bg-blue-500');
                timeDiv.classList.toggle('text-white');
                timeDiv.classList.toggle('bg-gray-200');
            });
            timeGrid.appendChild(timeDiv);
        }
    }
}

generateTimeSlots(8, 23, 10);

function getSelectedTimes() {
    return Array.from(document.querySelectorAll('.time-slot.bg-blue-500'))
        .map(slot => slot.dataset.value);
}

function renderMovieList() {
    movieList.innerHTML = '';
    moviesData.forEach((movie) => {
        const newRow = document.createElement('tr');
        newRow.className = 'bg-white border-b';
        newRow.innerHTML = `
            <td class="py-3 px-6">${movie.tenPhim}</td>
            <td class="py-3 px-6">${movie.ngayChieu}</td>
            <td class="py-3 px-6">${movie.gioChieu}</td>
            <td class="py-3 px-6">
                <img src="${movie.anh}" alt="Ảnh phim" class="w-16 h-auto rounded-lg mx-auto">
            </td>
            <td class="py-3 px-6 text-center space-x-2">
                <button class="edit-btn bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded" data-id="${movie.id}">Sửa</button>
                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded" data-id="${movie.id}">Xóa</button>
            </td>
        `;
        movieList.appendChild(newRow);
    });

    // Xóa phim
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if (confirm('Bạn có chắc muốn xóa phim này?')) {
                fetch(`${SERVER_URL}/movies/${id}`, {method: 'DELETE'})
                    .then(res => res.json())
                    .then(() => loadMovies());
            }
        });
    });

    // Sửa phim
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const movie = moviesData.find(m => m.id == id);

            // Điền form
            document.getElementById('tenPhim').value = movie.tenPhim;
            document.getElementById('ngayChieu').value = movie.ngayChieu;

            // Chọn lại giờ chiếu
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('bg-blue-500', 'text-white');
                slot.classList.add('bg-gray-200');
                if (movie.gioChieu.split(', ').includes(slot.dataset.value)) {
                    slot.classList.add('bg-blue-500', 'text-white');
                    slot.classList.remove('bg-gray-200');
                }
            });

            // Đổi nút Add thành Update
            addBtn.onclick = () => {
                const updatedMovie = {
                    tenPhim: document.getElementById('tenPhim').value,
                    ngayChieu: document.getElementById('ngayChieu').value,
                    gioChieu: getSelectedTimes().join(", "),

                    anh: movie.anh,
                    doanhThu: movie.doanhThu,
                    soVeBan: movie.soVeBan
                };

                fetch(`${SERVER_URL}/movies/${id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(updatedMovie)
                })
                    .then(() => {
                        loadMovies();
                        addBtn.onclick = defaultAddHandler; // Gán lại Add
                    });
            };
        });
    });
}

// Thêm phim
function defaultAddHandler() {
    const tenPhim = document.getElementById('tenPhim').value;
    const ngayChieu = document.getElementById('ngayChieu').value;
    const gioChieu = getSelectedTimes().join(", ");
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!tenPhim || !ngayChieu || !gioChieu || !file) {
        alert('Vui lòng điền đầy đủ thông tin và chọn ảnh.');
        return;
    }


    const reader = new FileReader();
    reader.onload = function (e) {
        const randomTickets = Math.floor(Math.random() * 500) + 50;
        const ticketPrice = 100000;
        const randomRevenue = randomTickets * ticketPrice;

        const newMovie = {
            tenPhim, ngayChieu, gioChieu,
            anh: e.target.result,
            doanhThu: randomRevenue,
            soVeBan: randomTickets
        };

        saveMovieToServer(newMovie).then(() => {
            loadMovies();
            fileInput.value = "";
        });
    };
    reader.readAsDataURL(file);
}

addBtn.onclick = defaultAddHandler;

function loadMovies() {
    fetch(`${SERVER_URL}/movies`)
        .then(res => res.json())
        .then(data => {
            moviesData = data;
            renderMovieList();
        });
}

function saveMovieToServer(movie) {
    return fetch(`${SERVER_URL}/movies`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(movie)
    }).then(res => res.json());
}

toggleHeading.addEventListener('click', () => {
    timeGridWrapper.classList.toggle('collapsed');
    arrowIcon.classList.toggle('rotate-180');
});

// Lần đầu load dữ liệu
loadMovies();
