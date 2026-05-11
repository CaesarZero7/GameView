document.addEventListener('DOMContentLoaded', function() {
    // Кастомный datepicker
    const datepickerInput = document.getElementById('game-release-date');
    const datepickerCalendar = document.getElementById('datepicker-calendar');
    const calendarDays = document.getElementById('calendar-days');
    const prevYearBtn = document.getElementById('prev-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const nextYearBtn = document.getElementById('next-year');
    const setTodayBtn = document.getElementById('set-today');
    const clearDateBtn = document.getElementById('clear-date');
    const monthSelect = document.getElementById('datepicker-month');
    const yearSelect = document.getElementById('datepicker-year');
    
    let currentDate = new Date();
    let selectedDate = null;
    
    // Динамическое отображение системных требований
    const pcCheckbox = document.getElementById('platform-pc');
    const systemRequirementsSection = document.getElementById('system-requirements-section');
    
    // Заполняем годы (от 1990 до текущего года)
    const currentYear = new Date().getFullYear();
    for (let year = 1990; year <= currentYear; year++) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
    
    // Инициализация
    monthSelect.value = currentDate.getMonth();
    yearSelect.value = currentDate.getFullYear();
    
    // Функция переключения системных требований
    function toggleSystemRequirements() {
      if (pcCheckbox.checked) {
        systemRequirementsSection.style.display = 'block';
        // Добавляем небольшую задержку для плавной анимации
        setTimeout(() => {
          systemRequirementsSection.classList.remove('hidden');
          systemRequirementsSection.classList.add('visible');
        }, 10);
      } else {
        systemRequirementsSection.classList.remove('visible');
        systemRequirementsSection.classList.add('hidden');
        // Ждем окончания анимации перед скрытием
        setTimeout(() => {
          systemRequirementsSection.style.display = 'none';
        }, 300);
      }
    }
    
    // Обработчик изменения чекбокса PC
    pcCheckbox.addEventListener('change', toggleSystemRequirements);
    
    // Инициализация системных требований при загрузке
    toggleSystemRequirements();
    
    // Открытие/закрытие календаря
    datepickerInput.addEventListener('click', function() {
      datepickerCalendar.classList.toggle('active');
      renderCalendar(currentDate);
    });

    document.addEventListener('click', function(e) {
      if (!datepickerInput.contains(e.target) && !datepickerCalendar.contains(e.target)) {
        datepickerCalendar.classList.remove('active');
        // Валидируем дату при закрытии календаря (если форма уже отправлялась)
        if (formSubmitted && datepickerInput.value) {
          validateReleaseDate();
        }
      }
    });
    
    // Навигация
    prevYearBtn.addEventListener('click', function() {
      currentDate.setFullYear(currentDate.getFullYear() - 1);
      updateSelects();
      renderCalendar(currentDate);
    });
    
    prevMonthBtn.addEventListener('click', function() {
      currentDate.setMonth(currentDate.getMonth() - 1);
      updateSelects();
      renderCalendar(currentDate);
    });
    
    nextMonthBtn.addEventListener('click', function() {
      currentDate.setMonth(currentDate.getMonth() + 1);
      updateSelects();
      renderCalendar(currentDate);
    });
    
    nextYearBtn.addEventListener('click', function() {
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      updateSelects();
      renderCalendar(currentDate);
    });
    
    // Изменение через селекты
    monthSelect.addEventListener('change', function() {
      currentDate.setMonth(parseInt(this.value));
      renderCalendar(currentDate);
    });
    
    yearSelect.addEventListener('change', function() {
      currentDate.setFullYear(parseInt(this.value));
      renderCalendar(currentDate);
    });
    
    // Обновление селектов
    function updateSelects() {
      monthSelect.value = currentDate.getMonth();
      yearSelect.value = currentDate.getFullYear();
    }
    
    // Установка сегодняшней даты
    setTodayBtn.addEventListener('click', function() {
      const today = new Date();
      selectDate(today);
      datepickerCalendar.classList.remove('active');

      if (formSubmitted) {
        validateReleaseDate();
      }
    });
    
    // Очистка даты
    clearDateBtn.addEventListener('click', function() {
      selectedDate = null;
      datepickerInput.value = '';
      datepickerCalendar.classList.remove('active');
      clearError('release-date-error');

      if (formSubmitted) {
        validateReleaseDate();
      }
    });
    
    // Закрытие календаря при клике вне его
    document.addEventListener('click', function(e) {
      if (!datepickerInput.contains(e.target) && !datepickerCalendar.contains(e.target)) {
        datepickerCalendar.classList.remove('active');
      }
    });
    
    // Рендер календаря
    function renderCalendar(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Начинаем с понедельника
      
      calendarDays.innerHTML = '';
      
      // Дни предыдущего месяца
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = 0; i < startingDay; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'datepicker-day other-month';
        dayElement.textContent = prevMonthLastDay - startingDay + i + 1;
        calendarDays.appendChild(dayElement);
      }
      
      // Дни текущего месяца
      const today = new Date();
      for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'datepicker-day';
        dayElement.textContent = i;
        
        const currentDay = new Date(year, month, i);
        
        // Проверка на сегодняшний день
        if (currentDay.toDateString() === today.toDateString()) {
          dayElement.classList.add('today');
        }
        
        // Проверка на выбранную дату
        if (selectedDate && currentDay.toDateString() === selectedDate.toDateString()) {
          dayElement.classList.add('selected');
        }
        
        dayElement.addEventListener('click', function() {
          selectDate(currentDay);
          datepickerCalendar.classList.remove('active');
        });
        
        calendarDays.appendChild(dayElement);
      }
      
      // Дни следующего месяца
      const totalCells = 42; // 6 строк по 7 дней
      const remainingCells = totalCells - (startingDay + daysInMonth);
      for (let i = 1; i <= remainingCells; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'datepicker-day other-month';
        dayElement.textContent = i;
        calendarDays.appendChild(dayElement);
      }
    }
    
    // Выбор даты
    function selectDate(date) {
      selectedDate = date;
      datepickerInput.value = date.toLocaleDateString('ru-RU');
      renderCalendar(currentDate);
      clearError('release-date-error');

      if (formSubmitted) {
        validateReleaseDate();
      }
    }
    
    // Обработка множественного выбора жанров
    const genreCheckboxes = document.querySelectorAll('input[name="genres[]"]');
    const selectedGenresContainer = document.getElementById('selected-genres');
    
    function updateSelectedGenres() {
      // Плавно скрываем контейнер перед обновлением
      selectedGenresContainer.style.opacity = '0';
      
      setTimeout(() => {
        selectedGenresContainer.innerHTML = '';
        genreCheckboxes.forEach(checkbox => {
          if (checkbox.checked) {
            const genreElement = document.createElement('div');
            genreElement.className = 'selected-genre';
            genreElement.innerHTML = `
              <span>${checkbox.value}</span>
              <button type="button" class="remove-genre" data-genre="${checkbox.value}">×</button>
            `;
            selectedGenresContainer.appendChild(genreElement);
          }
        });
        
        // Плавно показываем обновленный контейнер
        selectedGenresContainer.style.opacity = '1';
        clearError('genres-error');
      }, 100);
    }
    
    genreCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateSelectedGenres);
    });
    
    // Удаление выбранного жанра
    selectedGenresContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-genre')) {
        const genre = e.target.getAttribute('data-genre');
        const checkbox = document.querySelector(`input[value="${genre}"]`);
        if (checkbox) {
          checkbox.checked = false;
          updateSelectedGenres();
        }
      }
    });
    
    // Предпросмотр обложки
    const coverInput = document.getElementById('game-cover');
    const coverPreview = document.getElementById('cover-preview');
    
    coverInput.addEventListener('change', function() {
      coverPreview.innerHTML = '';
      if (this.files && this.files[0]) {
        const file = this.files[0];
        
        // Проверка типа файла
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          showError('cover-error', 'Неверный формат файла. Допустимы: JPG, PNG, WebP.');
          this.value = '';
          return;
        }
        
        // Проверка размера файла (5MB)
        if (file.size > 5 * 1024 * 1024) {
          showError('cover-error', 'Файл слишком большой. Максимальный размер: 5MB.');
          this.value = '';
          return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
          const previewItem = document.createElement('div');
          previewItem.className = 'preview-item';
          
          const img = document.createElement('img');
          img.src = e.target.result;
          img.alt = 'Предпросмотр обложки';
          
          const removeBtn = document.createElement('button');
          removeBtn.className = 'remove-preview';
          removeBtn.innerHTML = '×';
          removeBtn.onclick = function() {
            coverPreview.innerHTML = '';
            coverInput.value = '';
            clearError('cover-error');
          };
          
          previewItem.appendChild(img);
          previewItem.appendChild(removeBtn);
          coverPreview.appendChild(previewItem);
          clearError('cover-error');
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Предпросмотр скриншотов
    const screenshotsInput = document.getElementById('game-screenshots');
    const screenshotsPreview = document.getElementById('screenshots-preview');
    
    screenshotsInput.addEventListener('change', function() {
      screenshotsPreview.innerHTML = '';
      if (this.files) {
        Array.from(this.files).forEach(file => {
          // Проверка типа файла
          const validTypes = ['image/jpeg', 'image/png'];
          if (!validTypes.includes(file.type)) {
            showError('screenshots-error', 'Неверный формат файла. Допустимы: JPG, PNG.');
            this.value = '';
            return;
          }
          
          // Проверка размера файла (5MB)
          if (file.size > 5 * 1024 * 1024) {
            showError('screenshots-error', 'Файл слишком большой. Максимальный размер: 5MB.');
            this.value = '';
            return;
          }
          
          const reader = new FileReader();
          reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Предпросмотр скриншота';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-preview';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = function() {
              previewItem.remove();
              clearError('screenshots-error');
            };
            
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            screenshotsPreview.appendChild(previewItem);
            clearError('screenshots-error');
          };
          reader.readAsDataURL(file);
        });
      }
    });
    
    // Валидация формы
    const form = document.getElementById('add-game-form');
    
    // Флаг для отслеживания первого нажатия кнопки отправки
    let formSubmitted = false;
    
    // Функции для работы с ошибками
    function showError(elementId, message) {
      const errorElement = document.getElementById(elementId);
      errorElement.textContent = message;
      
      // Получаем ID поля, убирая '-error' и добавляя 'game-' если нужно
      let fieldId = elementId.replace('-error', '');
      
      // Для некоторых полей нужно добавить префикс 'game-'
      const fieldsWithGamePrefix = ['title', 'developer', 'publisher', 'release-date', 'price', 'summary', 'description', 'cover', 'screenshots'];
      if (fieldsWithGamePrefix.includes(fieldId)) {
        fieldId = 'game-' + fieldId;
      }
      
      const inputElement = document.getElementById(fieldId);
      if (inputElement) {
        inputElement.classList.add('input-error');
      }
    }
    
    function clearError(elementId) {
      const errorElement = document.getElementById(elementId);
      errorElement.textContent = '';
      
      // Получаем ID поля, убирая '-error' и добавляя 'game-' если нужно
      let fieldId = elementId.replace('-error', '');
      
      // Для некоторых полей нужно добавить префикс 'game-'
      const fieldsWithGamePrefix = ['title', 'developer', 'publisher', 'release-date', 'price', 'summary', 'description', 'cover', 'screenshots'];
      if (fieldsWithGamePrefix.includes(fieldId)) {
        fieldId = 'game-' + fieldId;
      }
      
      const inputElement = document.getElementById(fieldId);
      if (inputElement) {
        inputElement.classList.remove('input-error');
      }
    }
    
    function clearAllErrors() {
      const errorElements = document.querySelectorAll('.error-message');
      errorElements.forEach(element => {
        element.textContent = '';
      });
      
      const inputElements = document.querySelectorAll('.input-error');
      inputElements.forEach(element => {
        element.classList.remove('input-error');
      });
    }
    
    // Функции валидации
    function validateTitle() {
      const title = document.getElementById('game-title').value.trim();
      const regex = /^[a-zA-Zа-яА-Я0-9\s\-'’:,.!?()&+]{2,100}$/;
      
      if (!title) {
        showError('title-error', 'Название игры обязательно для заполнения');
        return false;
      }
      
      if (!regex.test(title)) {
        showError('title-error', 'Название должно содержать только буквы, цифры, пробелы и основные символы (2-100 символов)');
        return false;
      }
      
      clearError('title-error');
      return true;
    }
    
    function validateDeveloper() {
      const developer = document.getElementById('game-developer').value.trim();
      const regex = /^[a-zA-Zа-яА-Я0-9\s\-'’:,.!?()&+]{2,50}$/;
      
      if (!developer) {
        showError('developer-error', 'Разработчик обязателен для заполнения');
        return false;
      }
      
      if (!regex.test(developer)) {
        showError('developer-error', 'Название разработчика должно содержать только буквы, цифры, пробелы и основные символы (2-50 символов)');
        return false;
      }
      
      clearError('developer-error');
      return true;
    }
    
    function validatePublisher() {
      const publisher = document.getElementById('game-publisher').value.trim();
      const regex = /^[a-zA-Zа-яА-Я0-9\s\-'’:,.!?()&+]{0,50}$/;
      
      if (publisher && !regex.test(publisher)) {
        showError('publisher-error', 'Название издателя должно содержать только буквы, цифры, пробелы и основные символы (не более 50 символов)');
        return false;
      }
      
      clearError('publisher-error');
      return true;
    }
    
    function validateGenres() {
      const genres = document.querySelectorAll('input[name="genres[]"]:checked');
      
      if (genres.length === 0) {
        showError('genres-error', 'Выберите хотя бы один жанр');
        return false;
      }
      
      clearError('genres-error');
      return true;
    }
    
    function validateReleaseDate() {
      const releaseDate = document.getElementById('game-release-date').value;
      
      if (!releaseDate) {
        showError('release-date-error', 'Дата выхода обязательна для заполнения');
        return false;
      }
      
      // Парсим дату из русского формата ДД.ММ.ГГГГ
      const parts = releaseDate.split('.');
      if (parts.length !== 3) {
        showError('release-date-error', 'Неверный формат даты. Используйте ДД.ММ.ГГГГ');
        return false;
      }
      
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // месяцы в JS от 0 до 11
      const year = parseInt(parts[2], 10);
      
      // Создаем дату в правильном формате
      const selectedDate = new Date(year, month, day);
      
      // Проверяем, что дата валидна
      if (isNaN(selectedDate.getTime())) {
        showError('release-date-error', 'Неверная дата');
        return false;
      }
      
      const today = new Date();
      // Сбрасываем время для корректного сравнения только дат
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        showError('release-date-error', 'Дата выхода не может быть в будущем');
        return false;
      }
      
      clearError('release-date-error');
      return true;
    }
    
    function validatePrice() {
      const price = document.getElementById('game-price').value.trim();
      const regex = /^\d+(\.\d{1,2})?$/;
      
      if (!price) {
        showError('price-error', 'Цена обязательна для заполнения');
        return false;
      }
      
      if (!regex.test(price)) {
        showError('price-error', 'Цена должна быть числом с двумя знаками после запятой (например: 1999.99)');
        return false;
      }
      
      const priceValue = parseFloat(price);
      if (priceValue < 0 || priceValue > 100000) {
        showError('price-error', 'Цена должна быть в диапазоне от 0 до 100 000 рублей');
        return false;
      }
      
      clearError('price-error');
      return true;
    }
    
    function validateSummary() {
      const summary = document.getElementById('game-summary').value.trim();
      const regex = /^[a-zA-Zа-яА-Я0-9\s\.,!?\-]{10,40}$/;
      
      if (!summary) {
        showError('summary-error', 'Краткое описание обязательно для заполнения');
        return false;
      }
      
      if (!regex.test(summary)) {
        showError('summary-error', 'Краткое описание должно содержать от 10 до 40 символов (буквы, цифры, пробелы и основные знаки препинания)');
        return false;
      }
      
      clearError('summary-error');
      return true;
    }
    
    function validateDescription() {
      const description = document.getElementById('game-description').value.trim();
      
      if (!description) {
        showError('description-error', 'Полное описание обязательно для заполнения');
        return false;
      }
      
      if (description.length < 70) {
        showError('description-error', 'Полное описание должно содержать минимум 70 символов');
        return false;
      }
      
      clearError('description-error');
      return true;
    }
    
    function validatePlatforms() {
      const platforms = document.querySelectorAll('input[name="platforms[]"]:checked');
      
      if (platforms.length === 0) {
        showError('platforms-error', 'Выберите хотя бы одну платформу');
        return false;
      }
      
      clearError('platforms-error');
      return true;
    }
    
    function validateModes() {
      const modes = document.querySelectorAll('input[name="modes[]"]:checked');
      
      if (modes.length === 0) {
        showError('modes-error', 'Выберите хотя бы один режим игры');
        return false;
      }
      
      clearError('modes-error');
      return true;
    }
    
    function validateRAM() {
      const ram = document.getElementById('req-ram').value.trim();
      const regex = /^\d+\s*(GB|MB|KB)$/i;
      
      if (ram && !regex.test(ram)) {
        showError('ram-error', 'Формат: число и единица измерения (GB, MB, KB), например: 8 GB');
        return false;
      }
      
      clearError('ram-error');
      return true;
    }
    
    function validateStorage() {
      const storage = document.getElementById('req-storage').value.trim();
      const regex = /^\d+\s*(GB|MB|KB)$/i;
      
      if (storage && !regex.test(storage)) {
        showError('storage-error', 'Формат: число и единица измерения (GB, MB, KB), например: 50 GB');
        return false;
      }
      
      clearError('storage-error');
      return true;
    }
    
    function validateSystemRequirements() {
      if (!pcCheckbox.checked) {
        // Если PC не выбран, системные требования не проверяем
        clearError('cpu-error');
        clearError('ram-error');
        clearError('gpu-error');
        clearError('storage-error');
        return true;
      }
      
      // Если PC выбран, проверяем что заполнены основные поля
      const cpu = document.getElementById('req-cpu').value.trim();
      const ram = document.getElementById('req-ram').value.trim();
      const gpu = document.getElementById('req-gpu').value.trim();
      const storage = document.getElementById('req-storage').value.trim();
      
      let isValid = true;
      
      if (!cpu) {
        showError('cpu-error', 'Заполните требования к процессору');
        isValid = false;
      } else {
        clearError('cpu-error');
      }
      
      if (!ram) {
        showError('ram-error', 'Заполните требования к оперативной памяти');
        isValid = false;
      } else {
        clearError('ram-error');
      }
      
      if (!gpu) {
        showError('gpu-error', 'Заполните требования к видеокарте');
        isValid = false;
      } else {
        clearError('gpu-error');
      }
      
      if (!storage) {
        showError('storage-error', 'Заполните требования к месту на диске');
        isValid = false;
      } else {
        clearError('storage-error');
      }
      
      return isValid;
    }
    
    function validateCover() {
      const cover = document.getElementById('game-cover').files[0];
      
      if (!cover) {
        showError('cover-error', 'Обложка игры обязательна для заполнения');
        return false;
      }
      
      clearError('cover-error');
      return true;
    }
    
    function validateScreenshots() {
      const screenshots = document.getElementById('game-screenshots').files;
      
      if (screenshots.length < 3) {
        showError('screenshots-error', 'Необходимо загрузить минимум 3 скриншота');
        return false;
      }
      
      if (screenshots.length > 10) {
        showError('screenshots-error', 'Можно загрузить не более 10 скриншотов');
        return false;
      }
      
      clearError('screenshots-error');
      return true;
    }
    
    // Добавляем обработчики для улучшения UX валидации
    function addFieldValidationListeners() {
      // Обработчики для текстовых полей
      const textFields = [
        { id: 'game-title', errorId: 'title-error', validator: validateTitle },
        { id: 'game-developer', errorId: 'developer-error', validator: validateDeveloper },
        { id: 'game-publisher', errorId: 'publisher-error', validator: validatePublisher },
        { id: 'game-price', errorId: 'price-error', validator: validatePrice },
        { id: 'game-summary', errorId: 'summary-error', validator: validateSummary },
        { id: 'game-description', errorId: 'description-error', validator: validateDescription }
      ];
      
      textFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
          // Убираем ошибку при фокусе (только после первого нажатия кнопки)
          element.addEventListener('focus', function() {
            if (formSubmitted) {
              clearError(field.errorId);
            }
          });
          
          // Валидируем при потере фокуса (только после первого нажатия кнопки)
          element.addEventListener('blur', function() {
            if (formSubmitted) {
              field.validator();
            }
          });
        }
      });
      
      // Обработчики для даты выхода
      const dateField = document.getElementById('game-release-date');
      if (dateField) {
        dateField.addEventListener('focus', function() {
          if (formSubmitted) {
            clearError('release-date-error');
          }
        });
        
        dateField.addEventListener('blur', function() {
          if (formSubmitted) {
            validateReleaseDate();
          }
        });
      }
      
      // Обработчики для системных требований
      const systemFields = [
        { id: 'req-cpu', errorId: 'cpu-error' },
        { id: 'req-ram', errorId: 'ram-error' },
        { id: 'req-gpu', errorId: 'gpu-error' },
        { id: 'req-storage', errorId: 'storage-error' }
      ];
      
      systemFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
          element.addEventListener('focus', function() {
            if (formSubmitted) {
              clearError(field.errorId);
            }
          });
          
          element.addEventListener('blur', function() {
            if (formSubmitted) {
              validateSystemRequirements();
            }
          });
        }
      });
      
      // Обработчики для чекбоксов жанров
      genreCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          if (formSubmitted) {
            clearError('genres-error');
            validateGenres();
          }
        });
      });
      
      // Обработчики для платформ
      const platformCheckboxes = document.querySelectorAll('input[name="platforms[]"]');
      platformCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          if (formSubmitted) {
            clearError('platforms-error');
            validatePlatforms();
          }
        });
      });
      
      // Обработчики для режимов игры
      const modeCheckboxes = document.querySelectorAll('input[name="modes[]"]');
      modeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          if (formSubmitted) {
            clearError('modes-error');
            validateModes();
          }
        });
      });
      
      // Обработчики для файлов
      const coverInput = document.getElementById('game-cover');
      if (coverInput) {
        coverInput.addEventListener('change', function() {
          if (formSubmitted) {
            clearError('cover-error');
            validateCover();
          }
        });
      }
      
      const screenshotsInput = document.getElementById('game-screenshots');
      if (screenshotsInput) {
        screenshotsInput.addEventListener('change', function() {
          if (formSubmitted) {
            clearError('screenshots-error');
            validateScreenshots();
          }
        });
      }
    }
    
    // Инициализируем обработчики валидации
    addFieldValidationListeners();
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Устанавливаем флаг первого нажатия кнопки
      formSubmitted = true;
      
      clearAllErrors();
      
      // Выполняем все проверки
      const isTitleValid = validateTitle();
      const isDeveloperValid = validateDeveloper();
      const isPublisherValid = validatePublisher();
      const isGenresValid = validateGenres();
      const isReleaseDateValid = validateReleaseDate();
      const isPriceValid = validatePrice();
      const isSummaryValid = validateSummary();
      const isDescriptionValid = validateDescription();
      const isPlatformsValid = validatePlatforms();
      const isModesValid = validateModes();
      const isSystemRequirementsValid = validateSystemRequirements();
      const isCoverValid = validateCover();
      const isScreenshotsValid = validateScreenshots();
      
      const isValid = isTitleValid && isDeveloperValid && isPublisherValid && 
                     isGenresValid && isReleaseDateValid && isPriceValid && 
                     isSummaryValid && isDescriptionValid && isPlatformsValid && 
                     isModesValid && isSystemRequirementsValid && 
                     isCoverValid && isScreenshotsValid;
      
      if (isValid) {
        // В реальном приложении здесь был бы AJAX-запрос к серверу
        alert('Игра успешно добавлена! В реальном приложении данные были бы отправлены на сервер.');
        // form.submit(); // Раскомментировать в реальном приложении
      }
    });
    
    // Очистка формы
    form.addEventListener('reset', function() {
      clearAllErrors();
      selectedDate = null;
      datepickerInput.value = '';
      coverPreview.innerHTML = '';
      screenshotsPreview.innerHTML = '';
      selectedGenresContainer.innerHTML = '';
      
      // Сбрасываем флаг отправки формы
      formSubmitted = false;
      
      // Сбрасываем чекбоксы жанров
      genreCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      
      // Скрываем системные требования при сбросе формы
      setTimeout(() => {
        toggleSystemRequirements();
      }, 0);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && datepickerCalendar.classList.contains('active')) {
        datepickerCalendar.classList.remove('active');
        // Валидируем при закрытии Escape
        if (formSubmitted && datepickerInput.value) {
          validateReleaseDate();
        }
      }
    });
  });