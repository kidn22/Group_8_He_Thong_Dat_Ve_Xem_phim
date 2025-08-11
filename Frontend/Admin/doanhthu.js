// --- CÁC BIẾN & HÀM CHO TRANG QUẢN LÍ DOANH THU ---
const doanhThuList = document.getElementById('doanhthu-list');
const movieFilter = document.getElementById('movie-filter');
const dateFilter = document.getElementById('date-filter');
const filterBtn = document.querySelector('.btn-filter');

// Cập nhật bộ lọc phim
function populateMovieFilter() {
    movieFilter.innerHTML = '<option value="all">Tất cả</option>';
    const uniqueMovies = [...new Set(moviesData.map(movie => movie.tenPhim))];
    uniqueMovies.forEach(tenPhim => {
        const option = document.createElement('option');
        option.value = tenPhim;
        option.textContent = tenPhim;
        movieFilter.appendChild(option);
    });
}

// Hiển thị bảng doanh thu
function renderDoanhThuTable(data) {
    doanhThuList.innerHTML = '';
    let totalRevenue = 0;
    let totalTickets = 0;
    data.forEach(movie => {
        totalRevenue += movie.doanhThu;
        totalTickets += movie.soVeBan;
        const newRow = document.createElement('tr');
        newRow.className = 'bg-white border-b';
        newRow.innerHTML = `
            <td class="py-3 px-6">${movie.tenPhim}</td>
            <td class="py-3 px-6">${movie.ngayChieu}</td>
            <td class="py-3 px-6">${movie.soVeBan}</td>
            <td class="py-3 px-6">${movie.doanhThu.toLocaleString('vi-VN')} VND</td>
        `;
        doanhThuList.appendChild(newRow);
    });
    document.getElementById('total-revenue').textContent = `${totalRevenue.toLocaleString('vi-VN')} VND`;
    document.getElementById('total-tickets').textContent = totalTickets;
}

// Xử lý sự kiện lọc doanh thu
filterBtn.addEventListener('click', () => {
    const selectedDate = dateFilter.value;
    const selectedMovie = movieFilter.value;
    let filteredData = moviesData;
    if (selectedMovie !== 'all') {
        filteredData = filteredData.filter(movie => movie.tenPhim === selectedMovie);
    }
    if (selectedDate) {
        filteredData = filteredData.filter(movie => movie.ngayChieu === selectedDate);
    }
    renderDoanhThuTable(filteredData);
});