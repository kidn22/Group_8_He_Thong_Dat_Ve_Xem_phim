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

    } catch (err) {
        console.error(err);
    }
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
                 data-date="${movie.ngayChieu}">
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

            localStorage.setItem("movieTitle", movieTitle);
            localStorage.setItem("showTime", `${showDate} - ${showTime}`);

            window.location.href = '../Checkout/book.html';
        });
    });
}

// Gọi hàm khi trang load
document.addEventListener("DOMContentLoaded", loadMoviesFromServer);
