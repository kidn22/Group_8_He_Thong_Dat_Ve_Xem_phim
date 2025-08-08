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
