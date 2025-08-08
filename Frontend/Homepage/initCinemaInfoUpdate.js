function initCinemaInfoUpdate() {
    const cinemaItems = document.querySelectorAll('.app__cinema-item-list-items');
    const titleNameElement = document.querySelector('.app__calender-title-item1');
    const titleAddressElement = document.querySelector('.app__calender-title-items');

    cinemaItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedCinema = item.getAttribute('data-cinema');
            const selectedAddress = item.getAttribute('data-address');

            titleNameElement.textContent = selectedCinema + '.';
            titleAddressElement.textContent = selectedAddress;
        });
    });
}
