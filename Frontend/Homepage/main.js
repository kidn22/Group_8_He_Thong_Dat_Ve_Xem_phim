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
