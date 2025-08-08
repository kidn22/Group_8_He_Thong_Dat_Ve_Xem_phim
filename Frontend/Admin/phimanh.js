
// Admin - Quản lý phim
let moviesData = JSON.parse(localStorage.getItem('moviesData')) || [];

const movieList = document.getElementById('movie-list');
const timeGrid = document.querySelector('.time-grid');
const addBtn = document.querySelector('.btn-add');
const toggleHeading = document.querySelector('.toggle-heading');
const timeGridWrapper = document.querySelector('.time-grid-wrapper');
const arrowIcon = document.querySelector('.arrow-icon');

function padZero(num) {
    return num.toString().padStart(2, '0');
}

// Tạo khung giờ
function generateTimeSlots(startHour, endHour, intervalMinutes) {
    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            const timeStr = `${padZero(hour)}:${padZero(minute)}`;
            const timeDiv = document.createElement('div');
            timeDiv.classList.add('time-slot', 'py-1', 'px-2', 'rounded-md', 'bg-gray-200', 'hover:bg-gray-300', 'cursor-pointer', 'transition-colors', 'text-center');
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
    return Array.from(document.querySelectorAll('.time-slot.bg-blue-500')).map(slot => slot.dataset.value);
}

// Render bảng phim
function renderMovieList() {
    movieList.innerHTML = '';
    moviesData.forEach((movie, index) => {
        const newRow = document.createElement('tr');
        newRow.className = 'bg-white border-b';
        newRow.innerHTML = `
            <td class="py-3 px-6">${movie.tenPhim}</td>
            <td class="py-3 px-6">${movie.ngayChieu}</td>
            <td class="py-3 px-6">${movie.gioChieu}</td>
            <td class="py-3 px-6">${movie.rap}</td>
            <td class="py-3 px-6">${movie.diaChi}</td>
            <td class="py-3 px-6"><img src="${movie.anh}" alt="Ảnh phim" class="w-16 h-auto rounded-lg mx-auto"></td>
            <td class="py-3 px-6 text-center space-x-2">
                <button class="edit-btn bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded" data-index="${index}">Sửa</button>
                <button class="delete-btn bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded" data-index="${index}">Xóa</button>
            </td>
        `;
        movieList.appendChild(newRow);
    });

    // Xóa
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            if (confirm('Bạn có chắc muốn xóa phim này?')) {
                moviesData.splice(index, 1);
                localStorage.setItem('moviesData', JSON.stringify(moviesData));
                renderMovieList();
            }
        });
    });

    // Sửa
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const movie = moviesData[index];
            document.getElementById('tenPhim').value = movie.tenPhim;
            document.getElementById('ngayChieu').value = movie.ngayChieu;
            document.querySelector('.cinema-select').value = movie.rap;
            document.querySelector('.address-select').value = movie.diaChi;

            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('bg-blue-500', 'text-white');
                slot.classList.add('bg-gray-200');
                if (movie.gioChieu.split(', ').includes(slot.dataset.value)) {
                    slot.classList.add('bg-blue-500', 'text-white');
                    slot.classList.remove('bg-gray-200');
                }
            });

            moviesData.splice(index, 1);
            localStorage.setItem('moviesData', JSON.stringify(moviesData));
            renderMovieList();
        });
    });
}
renderMovieList();

// Thêm phim
addBtn.addEventListener('click', () => {
    const tenPhim = document.getElementById('tenPhim').value;
    const ngayChieu = document.getElementById('ngayChieu').value;
    const gioChieu = getSelectedTimes().join(", ");
    const rap = document.querySelector('.cinema-select').value;
    const diaChi = document.querySelector('.address-select').value;
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!tenPhim || !ngayChieu || !gioChieu || !rap || !diaChi || !file) {
        alert('Vui lòng điền đầy đủ thông tin và chọn ảnh.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const randomTickets = Math.floor(Math.random() * 500) + 50;
        const ticketPrice = 100000;
        const randomRevenue = randomTickets * ticketPrice;
        const newMovie = { tenPhim, ngayChieu, gioChieu, rap, diaChi, anh: e.target.result, doanhThu: randomRevenue, soVeBan: randomTickets };
        moviesData.push(newMovie);
        function saveMoviesToServer() {
            fetch('http://localhost:3000/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(moviesData)
            })
                .then(res => res.json())
                .then(data => console.log(data.message))
                .catch(err => console.error(err));
        }

        renderMovieList();
        fileInput.value = "";
    };
    reader.readAsDataURL(file);
});

// Đóng/mở khung giờ
toggleHeading.addEventListener('click', () => {
    timeGridWrapper.classList.toggle('collapsed');
    arrowIcon.classList.toggle('rotate-180');
});

