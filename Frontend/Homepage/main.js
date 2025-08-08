function initLocationCinemaCalendar() {
    const locationItems = document.querySelectorAll('.app__cinema-location-list-items');
    const cinemaItem = document.querySelector('.app__cinema-item');
    const calendar = document.querySelector('.app__calender');
    const cinemaListItems = document.querySelectorAll('.app__cinema-item-list-items');

    // Ẩn ban đầu
    cinemaItem.style.display = 'none';
    calendar.style.display = 'none';

    // Chọn khu vực
    locationItems.forEach(location => {
        location.addEventListener('click', function () {
            locationItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            cinemaItem.style.display = 'block';
            calendar.style.display = 'none';

            cinemaListItems.forEach(i => i.classList.remove('active'));
        });
    });

    // Chọn rạp
    cinemaListItems.forEach(cinema => {
        cinema.addEventListener('click', function () {
            cinemaListItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            calendar.style.display = 'block';
            const selectedCinemaName = this.textContent.trim();
            const cinemaTitleEl = document.querySelector('.app__calender-title-cinema');
            if (cinemaTitleEl) cinemaTitleEl.textContent = selectedCinemaName;
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    initLocationCinemaCalendar();
    initCinemaInfoUpdate();
    initDateSelection();
    renderHomepageMovies();
    renderNowShowingMovies();
    renderCalendarMovies();
});
function renderCalendarMovies() {
    const calendarContainer = document.querySelector('.app__calender-item');
    if (!calendarContainer) return;

    const moviesData = JSON.parse(localStorage.getItem('moviesData')) || [];
    calendarContainer.innerHTML = ''; // Xóa item cũ

    moviesData.forEach(movie => {
        // Tạo HTML giờ chiếu
        const timesHTML = movie.gioChieu.split(', ').map(time => `
            <div class="app__calender-items-time" 
                 data-movie="${movie.tenPhim}" 
                 data-date="${movie.ngayChieu}">
                ${time}
            </div>
        `).join('');

        // Tạo khối phim
        const movieHTML = `
            <div class="app__calender-item-wp">
                <div class="app__calender-item-img-wp">
                    <img src="${movie.anh}" alt="movies" class="app__calender-item-img">
                </div>
                <div class="app__calender-items-wp">
                    <div class="app__calender-items-title">${movie.tenPhim}</div>
                    <div class="app__calender-items-dec">${movie.rap} - ${movie.diaChi} . ${movie.ngayChieu}</div>
                    <div class="app__calender-items-time-wp">
                        ${timesHTML}
                    </div>
                </div>
            </div>
        `;

        calendarContainer.insertAdjacentHTML('beforeend', movieHTML);
    });

    // Gắn lại sự kiện click sau khi render
    const timeSlots = document.querySelectorAll('.app__calender-items-time');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function () {
            // Bỏ active tất cả
            timeSlots.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Lấy dữ liệu từ dataset
            const movieTitle = this.getAttribute('data-movie');
            const showDate = this.getAttribute('data-date');
            const showTime = this.textContent.trim();

            // Lưu vào localStorage
            localStorage.setItem("movieTitle", movieTitle);
            localStorage.setItem("showTime", `${showDate} - ${showTime}`);

            // Chuyển sang trang chọn ghế
            window.location.href = '../Checkout/book.html';
        });
    });
}

document.addEventListener('DOMContentLoaded', renderCalendarMovies);
//
document.addEventListener("DOMContentLoaded", () => {
    const fullName = localStorage.getItem("fullName");
    const userNameLink = document.getElementById("userNameLink");

    if (fullName) {
        userNameLink.textContent = fullName; // đổi chữ Login thành họ tên
        userNameLink.href = "#"; // hoặc trang hồ sơ
    }
});
document.addEventListener("DOMContentLoaded", () => {
    fetch("../Homepage/header.html") // đường dẫn đến file header
        .then(res => res.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;

            // Sau khi load xong header, đổi Login thành tên nếu có
            const fullName = localStorage.getItem("fullName");
            const userNameLink = document.getElementById("userNameLink");
            if (fullName) {
                userNameLink.textContent = fullName;
                userNameLink.href = "#";
            }
        })
        .catch(err => console.error("Lỗi load header:", err));
});