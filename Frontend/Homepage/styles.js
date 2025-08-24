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
            localStorage.setItem("showAddress", data - address);


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

            const userNameLink = document.getElementById("userNameLink");
            if (fullName) {
                userNameLink.textContent = fullName;
                userNameLink.href = "#";
            }
        })
        .catch(err => console.error("Lỗi load header:", err));
});

//////////////////initCinemaInfoUpdate////////////
function initCinemaInfoUpdate() {
    const cinemaItems = document.querySelectorAll('.app__cinema-item-list-items');
    const titleNameElement = document.querySelector('.app__calender-title-item1');
    const titleAddressElement = document.querySelector('.app__calender-title-items');

    cinemaItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedCinema = item.getAttribute('data-cinema');
            const selectedAddress = item.getAttribute('data-address');

            // Cập nhật tiêu đề
            titleNameElement.textContent = selectedCinema + '.';
            titleAddressElement.textContent = selectedAddress;

            // Lọc phim theo rạp
            const filteredMovies = moviesData.filter(movie => movie.rap === selectedCinema);

            // Nếu có phim thì cập nhật ngày đầu tiên tìm được
            if (filteredMovies.length > 0) {
                titleDateElement.textContent = filteredMovies[0].ngayChieu || '';
            } else {
                titleDateElement.textContent = '';
            }

            // Render lại lịch chiếu
            renderCalendarMovies(filteredMovies);
        });
    });
}

//////////////////////////////////initDateSelection////////////////////////
function initDateSelection() {
    const dateItems = document.querySelectorAll('.app__calender-date-items');
    const note = document.querySelector('.app__calender-note');
    const title = document.querySelector('.app__calender-title');
    const item = document.querySelector('.app__calender-item');
    const dateTextEl = document.querySelector('.app__calender-title-date-date');

    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    dateItems.forEach(date => {
        date.addEventListener('click', function () {
            dateItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            note.style.display = 'block';
            title.style.display = 'block';
            item.style.display = 'flex';

            const [day, month] = this.textContent.trim().split('/').map(Number);
            const year = 2025;
            const dateObj = new Date(year, month - 1, day);
            const weekday = days[dateObj.getDay()];

            const fullText = `${weekday}, ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
            dateTextEl.textContent = fullText;
        });
    });

}

////////////////////////////renderCalendarMovies/////////////////////////
let moviesData = []; // Khai báo ngoài để mọi hàm đều dùng được

// Lấy dữ liệu từ server và render
async function loadMoviesFromServer() {
    try {
        const res = await fetch("http://localhost:3000/movies");
        if (!res.ok) throw new Error("Không thể tải dữ liệu phim");
        const moviesData = await res.json();

        // Lưu vào LocalStorage nếu cần
        localStorage.setItem("moviesData", JSON.stringify(moviesData));

        // Render luôn
        renderNowShowingMovies(moviesData);
        renderCalendarMovies(moviesData);
        initCinemaInfoUpdate(); // gọi sau khi có data
        updateCinemaHeader(moviesData[0]);

    } catch (err) {
        console.error(err);
    }
}

function updateCinemaHeader(movie) {
    const titleNameElement = document.querySelector('.app__calender-title-item1');
    const titleAddressElement = document.querySelector('.app__calender-title-items');
    const titleDateElement = document.querySelector('.app__calender-title-item2');

    if (!titleNameElement || !titleAddressElement || !titleDateElement) return;

    const date = new Date(movie.ngayChieu);
    const weekdays = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const weekday = weekdays[date.getDay()];
    const formattedDate = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    titleNameElement.textContent = movie.rap + '.';
    titleAddressElement.textContent = movie.diaChi;
    titleDateElement.textContent = `${weekday}, ${formattedDate}`;
}

// Render phim đang chiếu
function renderNowShowingMovies(moviesData) {
    const moviesContainer = document.querySelector('.app__movies-wp');
    if (!moviesContainer) return;

    moviesContainer.innerHTML = '';

    moviesData.forEach(movie => {
        const movieHTML = `
            <div class="app__movies-items">
                <img src="${movie.anh}" alt="${movie.tenPhim}" class="app__movies-items-img">
                <div class="app__movies-items-dec">
                    <h3 class="app__movies-items-title">${movie.tenPhim}</h3>
                    <a href="#cinema-section" class="app__movies-items-link">
                        <button class="app__movies-items-btn">Mua Vé</button>
                    </a>
                </div>
            </div>
        `;
        moviesContainer.insertAdjacentHTML('beforeend', movieHTML);
    });
}

// Render lịch chiếu
function renderCalendarMovies(moviesData) {
    const calendarContainer = document.querySelector('.app__calender-item');
    if (!calendarContainer) return;

    calendarContainer.innerHTML = '';

    moviesData.forEach(movie => {
        const timesHTML = movie.gioChieu.split(', ').map(time => `
    <div class="app__calender-items-time" 
         data-movie="${movie.tenPhim}" 
         data-date="${movie.ngayChieu}"
         data-address="${movie.diaChi}"
         data-rap="${movie.rap}"
         data-time="${time}">
        ${time}
    </div>
`).join('');

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

    // Bắt sự kiện click chọn giờ
    const timeSlots = document.querySelectorAll('.app__calender-items-time');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function () {
            timeSlots.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const movieTitle = this.dataset.movie;
            const showDate = this.dataset.date;
            const showTime = this.textContent.trim();
            const showAddress = this.dataset.address;
            const cinemaName = this.dataset.rap;


            localStorage.setItem("movieTitle", movieTitle);
            localStorage.setItem("showTime", `${showDate} - ${showTime}`);
            localStorage.setItem("showAddress", `${cinemaName} - ${showAddress}`);

            window.location.href = '../Checkout/book.html';
        });
    });
}

// Gọi hàm khi trang load
document.addEventListener("DOMContentLoaded", loadMoviesFromServer);

////////////////////////////////renderHomepageMovies///////////////////////////
function renderNowShowingMovies() {
    const moviesContainer = document.querySelector('.app__movies-wp');
    if (!moviesContainer) return;

    const moviesData = JSON.parse(localStorage.getItem('moviesData')) || [];
    moviesContainer.innerHTML = '';

    moviesData.forEach(movie => {
        const movieHTML = `
            <div class="app__movies-items">
                <img src="${movie.anh}" alt="${movie.tenPhim}" class="app__movies-items-img">
                <div class="app__movies-items-dec">
                    <h3 class="app__movies-items-title">${movie.tenPhim}</h3>
                    <a href="#cinema-section" class="app__movies-items-link">
                        <button class="app__movies-items-btn">Mua Vé</button>
                    </a>
                </div>
            </div>
        `;
        moviesContainer.insertAdjacentHTML('beforeend', movieHTML);
    });
}
