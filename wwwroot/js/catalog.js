document.addEventListener('DOMContentLoaded', function() {
  const filterForm = document.querySelector('form[aria-label="Фильтры каталога"]');
  const sortRadios = document.querySelectorAll('input[name="sort"]');
  const gameCards = document.querySelectorAll('.card');
  const cardGrid = document.querySelector('.card-grid');

  // Функция показа уведомления
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--brand);
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
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }

  // Функция применения фильтров
  function applyFilters() {
    const platformFilter = document.querySelector('select[name="platform"]').value;
    const genreFilter = document.querySelector('select[name="genre"]').value;
    const yearFilter = document.querySelector('select[name="year"]').value;
    const searchQuery = document.querySelector('input[name="q"]').value.toLowerCase();

    let visibleCount = 0;

    gameCards.forEach(card => {
      let shouldShow = true;

      // Фильтр по платформе
      if (platformFilter) {
        const platforms = card.dataset.platform.split(' ');
        if (!platforms.includes(platformFilter)) {
          shouldShow = false;
        }
      }

      // Фильтр по жанру (проверка наличия в строке)
      if (genreFilter) {
        const gameGenres = card.dataset.genre.toLowerCase();
        if (!gameGenres.includes(genreFilter.toLowerCase())) {
          shouldShow = false;
        }
      }

      // Фильтр по году
      if (yearFilter) {
        if (card.dataset.year !== yearFilter) {
          shouldShow = false;
        }
      }

      // Поиск по названию
      if (searchQuery) {
        const gameName = card.dataset.name.toLowerCase();
        if (!gameName.includes(searchQuery)) {
          shouldShow = false;
        }
      }

      // Показываем/скрываем карточку
      if (shouldShow) {
        card.style.display = 'block';
        card.classList.add('fade-in');
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.classList.remove('fade-in');
      }
    });

    // Показываем уведомление
    if (visibleCount === 0) {
      showNotification('Игры не найдены по заданным фильтрам');
    } else {
      showNotification(`Найдено игр: ${visibleCount}`);
    }
  }

  // Функция сортировки
  function applySorting(sortType) {
    const cardsArray = Array.from(gameCards);
    const visibleCards = cardsArray.filter(card => card.style.display !== 'none');

    visibleCards.sort((a, b) => {
      switch (sortType) {
        case 'name':
          // Сортировка по названию (алфавит)
          const nameA = a.dataset.name.toLowerCase();
          const nameB = b.dataset.name.toLowerCase();
          return nameA.localeCompare(nameB);
          
        case 'price':
          // Сортировка по цене (от меньшей к большей)
          const priceA = parseFloat(a.dataset.price);
          const priceB = parseFloat(b.dataset.price);
          return priceA - priceB;
          
        case 'year':
          // Сортировка по году (от новых к старым)
          const yearA = parseInt(a.dataset.year);
          const yearB = parseInt(b.dataset.year);
          return yearB - yearA;
          
        default:
          return 0;
      }
    });

    // Перестраиваем DOM
    visibleCards.forEach(card => {
      cardGrid.appendChild(card);
      card.classList.add('fade-in');
    });

    const sortLabels = {
      'name': 'по названию',
      'price': 'по цене',
      'year': 'по году выхода'
    };

    showNotification(`Сортировка: ${sortLabels[sortType]}`);
  }

  // Обработчик отправки формы фильтров
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });

    filterForm.addEventListener('reset', function() {
      setTimeout(() => {
        gameCards.forEach(card => {
          card.style.display = 'block';
          card.classList.add('fade-in');
        });
        showNotification('Фильтры сброшены');
      }, 100);
    });
  }

  // Обработчик сортировки
  sortRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        applySorting(this.value);
      }
    });
  });

  // Обработчик поиска в реальном времени
  const searchInput = document.querySelector('input[name="q"]');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        applyFilters();
      }, 300);
    });
  }

  // Добавляем стили для анимации
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in {
      animation: fadeIn 0.3s ease;
    }
  `;
  document.head.appendChild(style);
});

