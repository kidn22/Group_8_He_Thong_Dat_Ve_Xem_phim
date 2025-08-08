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
