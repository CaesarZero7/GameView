// catalog-ajax.js
document.addEventListener('DOMContentLoaded', function() {
    const filterForm = document.querySelector('form[aria-label="Фильтры каталога"]');
    const sortRadios = document.querySelectorAll('input[name="sort"]');
    const searchInput = document.querySelector('input[name="q"]');
    const cardContainer = document.querySelector('.card-grid');
    const genreSelect = document.querySelector('select[name="genre"]');
    const yearSelect = document.querySelector('select[name="year"]');
    let currentPage = 1;
    const pageSize = 6;
    let totalGames = 0;

    // Загрузка списка жанров и годов из БД
    async function loadFilters() {
        try {
            const [genresRes, yearsRes] = await Promise.all([
                fetch('/api/games/genres'),
                fetch('/api/games/years')
            ]);
            const genres = await genresRes.json();
            const years = await yearsRes.json();

            // Очистка и заполнение селекта жанров
            genreSelect.innerHTML = '<option value="">Все</option>';
            genres.forEach(g => {
                const option = document.createElement('option');
                option.value = g;
                option.textContent = g;
                genreSelect.appendChild(option);
            });

            // Очистка и заполнение селекта годов
            yearSelect.innerHTML = '<option value="">Любой</option>';
            years.forEach(y => {
                const option = document.createElement('option');
                option.value = y;
                option.textContent = y;
                yearSelect.appendChild(option);
            });
        } catch (err) {
            console.error('Ошибка загрузки фильтров:', err);
        }
    }

    // Показ уведомления
    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isError ? 'var(--danger)' : 'var(--brand)'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Загрузка игр
    async function loadGames() {
        const platform = document.querySelector('select[name="platform"]')?.value || '';
        const genre = genreSelect.value;
        const year = yearSelect.value;
        const search = searchInput?.value || '';
        let sortBy = 'name';
        sortRadios.forEach(radio => { if (radio.checked) sortBy = radio.value; });

        const params = new URLSearchParams({
            platform, genre, year, search, sortBy,
            page: currentPage,
            pageSize: pageSize
        });

        try {
            const response = await fetch(`/api/games?${params}`);
            if (!response.ok) throw new Error('Ошибка загрузки');
            const data = await response.json();
            totalGames = data.totalCount;
            renderGameCards(data.games);
            updatePaginationControls();
            showNotification(`Найдено игр: ${totalGames}`);
        } catch (err) {
            console.error(err);
            cardContainer.innerHTML = '<p class="muted">Не удалось загрузить игры. Попробуйте позже.</p>';
            showNotification('Ошибка загрузки игр', true);
        }
    }

    function renderGameCards(games) {
        if (!games.length) {
            cardContainer.innerHTML = '<p class="muted">Игры не найдены</p>';
            return;
        }
        cardContainer.innerHTML = '';
        games.forEach(game => {
            // Формируем строку жанров с ограничением и тултипом
            const allGenres = game.genres.split(',').map(g => g.trim());
            const maxVisibleGenres = 2;
            let displayGenres = '';
            let fullGenresList = allGenres.join(', ');

            if (allGenres.length > maxVisibleGenres) {
                displayGenres = `${allGenres.slice(0, maxVisibleGenres).join(', ')} +${allGenres.length - maxVisibleGenres}`;
            } else {
                displayGenres = fullGenresList;
            }

            // Создаём карточку
            const card = document.createElement('a');
            card.className = 'card';
            card.href = `/game/${game.id}`;
            card.innerHTML = `
                <img src="${game.coverPath}" alt="${game.title}" style="width:100%; aspect-ratio:1; object-fit:cover;">
                <div class="card-body">
                    <h2 class="title">${escapeHtml(game.title)}</h2>
                    <p class="muted summary">${escapeHtml(game.summary)}</p>
                    <div class="price">${game.price.toFixed(2)} руб.</div>
                    <div class="meta">
                        <span class="badge" title="${escapeHtml(fullGenresList)}">${escapeHtml(displayGenres)}</span>
                        <span class="year-badge">${new Date(game.releaseDate).getFullYear()}</span>
                        <span class="platforms">${renderPlatformsIcons(game.platforms)}</span>
                    </div>
                </div>
            `;
            cardContainer.appendChild(card);
        });
    }

    function escapeHtml(str) {
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
    }

    function renderPlatformsIcons(platformsStr) {
        const platforms = platformsStr.split(' ');
        let html = '';
        const svgIcons = {
            PC: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M2 4.25A2.25 2.25 0 0 1 4.25 2h7.5A2.25 2.25 0 0 1 14 4.25v5.5A2.25 2.25 0 0 1 11.75 12h-1.312c.1.128.21.248.328.36a.75.75 0 0 1 .234.545v.345a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-.345a.75.75 0 0 1 .234-.545c.118-.111.228-.232.328-.36H4.25A2.25 2.25 0 0 1 2 9.75zm2.25-.75a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h7.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75z" clip-rule="evenodd"/></svg>`,
            PlayStation: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M15.858 11.451c-.313.395-1.079.676-1.079.676l-5.696 2.046v-1.509l4.192-1.493c.476-.17.549-.412.162-.538c-.386-.127-1.085-.09-1.56.08l-2.794.984v-1.566l.161-.054s.807-.286 1.942-.412c1.135-.125 2.525.017 3.616.43c1.23.39 1.368.962 1.056 1.356M9.625 8.883v-3.86c0-.453-.083-.87-.508-.988c-.326-.105-.528.198-.528.65v9.664l-2.606-.827V2c1.108.206 2.722.692 3.59.985c2.207.757 2.955 1.7 2.955 3.825c0 2.071-1.278 2.856-2.903 2.072Zm-8.424 3.625C-.061 12.15-.271 11.41.304 10.984c.532-.394 1.436-.69 1.436-.69l3.737-1.33v1.515l-2.69.963c-.474.17-.547.411-.161.538c.386.126 1.085.09 1.56-.08l1.29-.469v1.356l-.257.043a8.45 8.45 0 0 1-4.018-.323Z"/></svg>`,
            Xbox: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.202 15.967a8 8 0 0 1-3.552-1.26c-.898-.585-1.101-.826-1.101-1.306c0-.965 1.062-2.656 2.879-4.583C6.459 7.723 7.897 6.44 8.052 6.475c.302.068 2.718 2.423 3.622 3.531c1.43 1.753 2.088 3.189 1.754 3.829c-.254.486-1.83 1.437-2.987 1.802c-.954.301-2.207.429-3.239.33m-5.866-3.57C.589 11.253.212 10.127.03 8.497c-.06-.539-.038-.846.137-1.95c.218-1.377 1.002-2.97 1.945-3.95c.401-.417.437-.427.926-.263c.595.2 1.23.638 2.213 1.528l.574.519l-.313.385C4.056 6.553 2.52 9.086 1.94 10.653c-.315.852-.442 1.707-.306 2.063c.091.24.007.15-.3-.319Zm13.101.195c.074-.36-.019-1.02-.238-1.687c-.473-1.443-2.055-4.128-3.508-5.953l-.457-.575l.494-.454c.646-.593 1.095-.948 1.58-1.25c.381-.237.927-.448 1.161-.448c.145 0 .654.528 1.065 1.104a8.4 8.4 0 0 1 1.343 3.102c.153.728.166 2.286.024 3.012a9.5 9.5 0 0 1-.6 1.893c-.179.393-.624 1.156-.82 1.404c-.1.128-.1.127-.043-.148ZM7.335 1.952c-.67-.34-1.704-.705-2.276-.803a4 4 0 0 0-.759-.043c-.471.024-.45 0 .306-.358A7.8 7.8 0 0 1 6.47.128c.8-.169 2.306-.17 3.094-.005c.85.18 1.853.552 2.418.9l.168.103l-.385-.02c-.766-.038-1.88.27-3.078.853c-.361.176-.676.316-.699.312a12 12 0 0 1-.654-.319Z"/></svg>`,
            Nintendo: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><g><path d="M9.34 8.005c0-4.38.01-7.972.023-7.982C9.373.01 10.036 0 10.831 0c1.153 0 1.51.01 1.743.05c1.73.298 3.045 1.6 3.373 3.326c.046.242.053.809.053 4.61c0 4.06.005 4.537-.123 4.976-.022.076-.048.15-.08.242a4.14 4.14 0 0 1-3.426 2.767c-.317.033-2.889.046-2.978.013c-.05-.02-.053-.752-.053-7.979zM3.71 3.317c-.208.04-.526.199-.695.348-.348.301-.52.729-.494 1.232.013.262.03.332.136.544.155.321.39.556.712.715.222.11.278.123.567.133.261.01.354 0 .53-.06.719-.242 1.153-.94 1.03-1.656-.142-.852-.95-1.422-1.786-1.256z"/><path d="M3.425.053a4.14 4.14 0 0 0-3.28 3.015C0 3.628-.01 3.956.005 8.3c.01 3.99.014 4.082.08 4.39c.368 1.66 1.548 2.844 3.224 3.235c.22.05.497.06 2.29.07c1.856.012 2.048.009 2.097-.04c.05-.05.053-.69.053-7.94c0-5.374-.01-7.906-.033-7.952c-.033-.06-.09-.063-2.03-.06c-1.578.004-2.052.014-2.26.05Zm3 14.665l-1.35-.016c-1.242-.013-1.375-.02-1.623-.083a2.81 2.81 0 0 1-2.08-2.167c-.074-.335-.074-8.579-.004-8.907a2.85 2.85 0 0 1 1.716-2.05c.438-.176.64-.196 2.058-.2l1.282-.003v13.426Z"/></g></svg>`
        };
        platforms.forEach(p => {
            if (svgIcons[p]) {
                html += `<span class="has-tip" data-tip="${p}">${svgIcons[p]}</span>`;
            } else {
                html += `<span class="badge">${p}</span>`;
            }
        });
        return html;
    }

    // Пагинация
    function updatePaginationControls() {
        const totalPages = Math.ceil(totalGames / pageSize);
        let paginationDiv = document.querySelector('.catalog-pagination');
        if (!paginationDiv) {
            paginationDiv = document.createElement('div');
            paginationDiv.className = 'catalog-pagination';
            cardContainer.parentNode.appendChild(paginationDiv);
        }
        paginationDiv.innerHTML = `
            <div style="display:flex; gap:12px; justify-content:center; margin-top:24px;">
                <button class="btn secondary" id="prevPageBtn" ${currentPage === 1 ? 'disabled' : ''}>← Назад</button>
                <span style="color:var(--muted);">Страница ${currentPage} из ${totalPages}</span>
                <button class="btn secondary" id="nextPageBtn" ${currentPage === totalPages ? 'disabled' : ''}>Вперёд →</button>
            </div>
        `;
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        if (prevBtn) prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; loadGames(); } };
        if (nextBtn) nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; loadGames(); } };
    }

    // Обработчики
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => { e.preventDefault(); currentPage = 1; loadGames(); });
        filterForm.addEventListener('reset', () => setTimeout(() => { currentPage = 1; loadGames(); }, 100));
    }
    sortRadios.forEach(radio => radio.addEventListener('change', () => { currentPage = 1; loadGames(); }));
    if (searchInput) {
        let timer;
        searchInput.addEventListener('input', () => {
            clearTimeout(timer);
            timer = setTimeout(() => { currentPage = 1; loadGames(); }, 400);
        });
    }

    // Первоначальная загрузка фильтров и игр
    loadFilters().then(() => loadGames());

    // Автодополнение (оставьте без изменений)
    const suggestionsBox = document.createElement('div');
    suggestionsBox.style.cssText = 'position:absolute; background:var(--panel); border:1px solid var(--border); border-radius:8px; z-index:1000; display:none;';
    if (searchInput) {
        searchInput.parentNode.style.position = 'relative';
        searchInput.parentNode.appendChild(suggestionsBox);
        searchInput.addEventListener('input', async function(e) {
            const q = e.target.value.trim();
            if (q.length < 2) { suggestionsBox.style.display = 'none'; return; }
            const resp = await fetch(`/api/games/suggestions?q=${encodeURIComponent(q)}`);
            const suggestions = await resp.json();
            if (suggestions.length) {
                suggestionsBox.innerHTML = suggestions.map(s => `<div style="padding:8px 12px; cursor:pointer; border-bottom:1px solid var(--border);">${escapeHtml(s)}</div>`).join('');
                suggestionsBox.style.display = 'block';
                suggestionsBox.querySelectorAll('div').forEach(div => {
                    div.addEventListener('click', () => {
                        searchInput.value = div.innerText;
                        suggestionsBox.style.display = 'none';
                        currentPage = 1;
                        loadGames();
                    });
                });
            } else {
                suggestionsBox.style.display = 'none';
            }
        });
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = 'none';
            }
        });
    }
});