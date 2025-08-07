/* Quản Lí Phim Ảnh */
// --- CÁC BIẾN & HÀM CHO TRANG QUẢN LÍ PHIM ---
let moviesData = db.load('moviesData');
const movieList = document.getElementById('movie-list');
const timeGrid = document.querySelector('.time-grid');
const addBtn = document.querySelector('.btn-add');
const toggleHeading = document.querySelector('.toggle-heading');
const timeGridWrapper = document.querySelector('.time-grid-wrapper');
const arrowIcon = document.querySelector('.arrow-icon');

// Tạo các khung giờ chiếu phim
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

// Lấy các khung giờ đã chọn
function getSelectedTimes() {
    const selected = document.querySelectorAll('.time-slot.bg-blue-500');
    return Array.from(selected).map(slot => slot.dataset.value);
}

// Hiển thị danh sách phim
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

    // Gán sự kiện XÓA
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            if (confirm('Bạn có chắc muốn xóa phim này?')) {
                moviesData.splice(index, 1);
                db.save('moviesData', moviesData);
                renderMovieList();
                renderDoanhThuTable(moviesData);
                populateMovieFilter();
            }
        });
    });

    // Gán sự kiện SỬA (nâng cao – bạn có thể tự xử lý hiển thị form sửa)
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const movie = moviesData[index];

            // Gán giá trị vào form
            document.getElementById('tenPhim').value = movie.tenPhim;
            document.getElementById('ngayChieu').value = movie.ngayChieu;
            document.querySelector('.cinema-select').value = movie.rap;
            document.querySelector('.address-select').value = movie.diaChi;

            // Set lại các khung giờ đã chọn
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('bg-blue-500', 'text-white');
                slot.classList.add('bg-gray-200');
                if (movie.gioChieu.split(', ').includes(slot.dataset.value)) {
                    slot.classList.add('bg-blue-500', 'text-white');
                    slot.classList.remove('bg-gray-200');
                }
            });

            // Xóa phim cũ, đợi user nhấn "Thêm" lại để cập nhật (cách đơn giản nhất)
            moviesData.splice(index, 1);
            db.save('moviesData', moviesData);
            renderMovieList();
            renderDoanhThuTable(moviesData);
            populateMovieFilter();
        });
    });
}


// Xử lý sự kiện thêm phim
addBtn.addEventListener('click', () => {
    const tenPhim = document.getElementById('tenPhim').value;
    const ngayChieu = document.getElementById('ngayChieu').value;
    const gioChieu = getSelectedTimes().join(", ");
    const rap = document.querySelector('.cinema-select').value;
    const diaChi = document.querySelector('.address-select').value;
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!tenPhim || !ngayChieu || !gioChieu || !rap || !diaChi || !file) {
        showModal('Thông báo', 'Vui lòng điền đầy đủ thông tin và chọn ảnh.', [{ text: 'Đóng', class: 'bg-gray-200 text-gray-700 hover:bg-gray-300' }]);
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const randomTickets = Math.floor(Math.random() * 500) + 50;
        const ticketPrice = 100000;
        const randomRevenue = randomTickets * ticketPrice;
        const newMovie = {
            tenPhim, ngayChieu, gioChieu, rap, diaChi,
            anh: e.target.result,
            doanhThu: randomRevenue,
            soVeBan: randomTickets
        };
        moviesData.push(newMovie);
        db.save('moviesData', moviesData);
        renderMovieList();
        renderDoanhThuTable(moviesData); // Cập nhật bảng doanh thu
        populateMovieFilter(); // Cập nhật bộ lọc phim

        // Reset form
        document.getElementById('tenPhim').value = "";
        document.getElementById('ngayChieu').value = "";
        document.querySelector('.cinema-select').value = "";
        document.querySelector('.address-select').value = "";
        fileInput.value = "";
        document.querySelectorAll('.time-slot.bg-blue-500').forEach(slot => {
            slot.classList.remove('bg-blue-500', 'text-white');
            slot.classList.add('bg-gray-200');
        });
    };
    reader.readAsDataURL(file);
});

// Xử lý đóng/mở khung giờ
toggleHeading.addEventListener('click', () => {
    timeGridWrapper.classList.toggle('collapsed');
    arrowIcon.classList.toggle('rotate-180');
});