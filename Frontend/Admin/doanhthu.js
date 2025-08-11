// --- CÁC BIẾN & HÀM CHO TRANG QUẢN LÍ DOANH THU ---
const doanhThuList = document.getElementById('doanhthu-list');
const movieFilter = document.getElementById('movie-filter');
const dateFilter = document.getElementById('date-filter');
const filterBtn = document.querySelector('.btn-filter');
const totalRevenueEl = document.getElementById('total-revenue');
const totalTicketsEl = document.getElementById('total-tickets');

// Kiểm tra dữ liệu
if (typeof moviesData === 'undefined' || !Array.isArray(moviesData)) {
    console.error("Lỗi: moviesData không tồn tại hoặc không phải mảng.");
}

// Cập nhật bộ lọc phim
function populateMovieFilter() {
    if (!moviesData || moviesData.length === 0) {
        movieFilter.innerHTML = '<option value="all">Tất cả</option>';
        return;
    }

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

    if (!data || data.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="4" class="py-3 px-6 text-center text-gray-500">Không có dữ liệu</td>`;
        doanhThuList.appendChild(emptyRow);
    } else {
        data.forEach(movie => {
            totalRevenue += movie.doanhThu || 0;
            totalTickets += movie.soVeBan || 0;

            const newRow = document.createElement('tr');
            newRow.className = 'bg-white border-b';
            newRow.innerHTML = `
                <td class="py-3 px-6">${movie.tenPhim}</td>
                <td class="py-3 px-6">${movie.ngayChieu}</td>
                <td class="py-3 px-6">${movie.soVeBan}</td>
                <td class="py-3 px-6">${(movie.doanhThu || 0).toLocaleString('vi-VN')} VND</td>
            `;
            doanhThuList.appendChild(newRow);
        });
    }

    updateTotals(totalRevenue, totalTickets);
}

// Cập nhật tổng doanh thu & vé
function updateTotals(totalRevenue, totalTickets) {
    totalRevenueEl.textContent = `${totalRevenue.toLocaleString('vi-VN')} VND`;
    totalTicketsEl.textContent = totalTickets;
}

// Xử lý sự kiện lọc doanh thu
filterBtn.addEventListener('click', () => {
    const selectedDate = dateFilter.value.trim();
    const selectedMovie = movieFilter.value;

    let filteredData = [...moviesData];

    if (selectedMovie !== 'all') {
        filteredData = filteredData.filter(movie => movie.tenPhim === selectedMovie);
    }
    if (selectedDate) {
        filteredData = filteredData.filter(movie => movie.ngayChieu === selectedDate);
    }

    renderDoanhThuTable(filteredData);
});

// Khởi tạo ban đầu
populateMovieFilter();
renderDoanhThuTable(moviesData);
