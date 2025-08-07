document.addEventListener('DOMContentLoaded', function () {
    const locationItems = document.querySelectorAll('.app__cinema-location-list-items');
    const cinemaItem = document.querySelector('.app__cinema-item');
    const calendar = document.querySelector('.app__calender');
    const cinemaListItems = document.querySelectorAll('.app__cinema-item-list-items');

    // Ẩn rạp & lịch chiếu ban đầu
    cinemaItem.style.display = 'none';
    calendar.style.display = 'none';

    // Click vào khu vực
    locationItems.forEach(location => {
        location.addEventListener('click', function () {
            // Bỏ active các khu vực khác
            locationItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Hiện rạp, ẩn lịch
            cinemaItem.style.display = 'block';
            calendar.style.display = 'none';

            // Bỏ chọn rạp trước đó
            cinemaListItems.forEach(i => i.classList.remove('active'));
        });
    });

    // Click vào rạp
    cinemaListItems.forEach(cinema => {
        cinema.addEventListener('click', function () {
            // Bỏ active các rạp khác
            cinemaListItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Hiện lịch chiếu
            calendar.style.display = 'block';

            // ✅ Cập nhật tên rạp trong tiêu đề lịch chiếu
            const selectedCinemaName = this.textContent.trim();
            const cinemaTitleEl = document.querySelector('.app__calender-title-cinema');
            if (cinemaTitleEl) {
                cinemaTitleEl.textContent = selectedCinemaName;
            }
        });
    });

    // Click vào suất chiếu (giờ)
    const timeSlots = document.querySelectorAll('.app__calender-items-time');

    timeSlots.forEach(slot => {
        slot.addEventListener('click', function () {
            // Bỏ active tất cả
            timeSlots.forEach(i => i.classList.remove('active'));
            // Gán active cho cái được click
            this.classList.add('active');

            // Lưu tên phim
            const movieTitle = document.querySelector('.app__calender-items-title')?.textContent.trim() || '';

            // Lưu suất chiếu (thời gian + ngày)
            const showDate = document.querySelector('.app__calender-title-date-date')?.textContent.trim() || '';
            const showTime = this.textContent.trim(); // ví dụ: "13:00"

            localStorage.setItem("movieTitle", movieTitle);
            localStorage.setItem("showTime", `${showDate} - ${showTime}`);

            // Điều hướng đến trang chọn ghế
            window.location.href = '../Checkout/book.html';
        });
    });
    const cinemaItems = document.querySelectorAll('.app__cinema-item-list-items');

    // Lấy các phần tiêu đề cần thay đổi
    const titleNameElement = document.querySelector('.app__calender-title-item1');
    const titleAddressElement = document.querySelector('.app__calender-title-items');

    cinemaItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedCinema = item.getAttribute('data-cinema');
            const selectedAddress = item.getAttribute('data-address');

            // Cập nhật phần tên rạp
            titleNameElement.textContent = selectedCinema + '.';

            // Cập nhật phần địa chỉ
            titleAddressElement.textContent = selectedAddress;
        });
    });
    
    // Các phần cần ẩn
    const dateItems = document.querySelectorAll('.app__calender-date-items');
    const note = document.querySelector('.app__calender-note');
    const title = document.querySelector('.app__calender-title');
    const item = document.querySelector('.app__calender-item');
    const dateTextEl = document.querySelector('.app__calender-title-date-date');

    // Mảng thứ
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    dateItems.forEach(date => {
        date.addEventListener('click', function () {
            // Bỏ active các ngày khác
            dateItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Hiện phần bên dưới
            note.style.display = 'block';
            title.style.display = 'block';
            item.style.display = 'flex';

            // Lấy ngày từ text (VD: "06/8") và tạo Date object
            const dayMonth = this.textContent.trim().split('/');
            const day = parseInt(dayMonth[0]);
            const month = parseInt(dayMonth[1]) - 1; // Tháng JS bắt đầu từ 0
            const year = 2025;

            const dateObj = new Date(year, month, day);
            const weekday = days[dateObj.getDay()];

            // Định dạng ngày để hiển thị
            const fullText = `${weekday}, ${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
            dateTextEl.textContent = fullText;
        });
    });
});
