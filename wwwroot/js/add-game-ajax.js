// add-game-ajax.js
document.addEventListener('DOMContentLoaded', function() {
    // ======================== КАСТОМНЫЙ DATEPICKER ========================
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
    let formSubmitted = false;

    // Динамическое отображение системных требований
    const pcCheckbox = document.getElementById('platform-pc');
    const systemRequirementsSection = document.getElementById('system-requirements-section');

    // Заполнение годов
    const currentYearFull = new Date().getFullYear();
    for (let year = 1990; year <= currentYearFull + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    monthSelect.value = currentDate.getMonth();
    yearSelect.value = currentDate.getFullYear();

    function toggleSystemRequirements() {
        if (pcCheckbox && pcCheckbox.checked) {
            systemRequirementsSection.style.display = 'block';
            setTimeout(() => {
                systemRequirementsSection.classList.remove('hidden');
                systemRequirementsSection.classList.add('visible');
            }, 10);
        } else if (systemRequirementsSection) {
            systemRequirementsSection.classList.remove('visible');
            systemRequirementsSection.classList.add('hidden');
            setTimeout(() => {
                systemRequirementsSection.style.display = 'none';
            }, 300);
        }
    }
    if (pcCheckbox) {
        pcCheckbox.addEventListener('change', toggleSystemRequirements);
        toggleSystemRequirements();
    }

    datepickerInput.addEventListener('click', function() {
        datepickerCalendar.classList.toggle('active');
        renderCalendar(currentDate);
    });
    document.addEventListener('click', function(e) {
        if (!datepickerInput.contains(e.target) && !datepickerCalendar.contains(e.target)) {
            datepickerCalendar.classList.remove('active');
            if (formSubmitted && datepickerInput.value) validateReleaseDate();
        }
    });

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
    monthSelect.addEventListener('change', function() {
        currentDate.setMonth(parseInt(this.value));
        renderCalendar(currentDate);
    });
    yearSelect.addEventListener('change', function() {
        currentDate.setFullYear(parseInt(this.value));
        renderCalendar(currentDate);
    });

    function updateSelects() {
        monthSelect.value = currentDate.getMonth();
        yearSelect.value = currentDate.getFullYear();
    }

    setTodayBtn.addEventListener('click', function() {
        const today = new Date();
        selectDate(today);
        datepickerCalendar.classList.remove('active');
        if (formSubmitted) validateReleaseDate();
    });
    clearDateBtn.addEventListener('click', function() {
        selectedDate = null;
        datepickerInput.value = '';
        datepickerCalendar.classList.remove('active');
        clearError('release-date-error');
        if (formSubmitted) validateReleaseDate();
    });

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        calendarDays.innerHTML = '';
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = 0; i < startingDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'datepicker-day other-month';
            dayElement.textContent = prevMonthLastDay - startingDay + i + 1;
            calendarDays.appendChild(dayElement);
        }
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'datepicker-day';
            dayElement.textContent = i;
            const currentDay = new Date(year, month, i);
            if (currentDay.toDateString() === today.toDateString()) dayElement.classList.add('today');
            if (selectedDate && currentDay.toDateString() === selectedDate.toDateString()) dayElement.classList.add('selected');
            dayElement.addEventListener('click', function() {
                selectDate(currentDay);
                datepickerCalendar.classList.remove('active');
            });
            calendarDays.appendChild(dayElement);
        }
        const totalCells = 42;
        const remainingCells = totalCells - (startingDay + daysInMonth);
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'datepicker-day other-month';
            dayElement.textContent = i;
            calendarDays.appendChild(dayElement);
        }
    }

    function selectDate(date) {
        selectedDate = date;
        currentDate = new Date(date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        datepickerInput.value = `${day}.${month}.${year}`;
        updateSelects();
        renderCalendar(currentDate);
        clearError('release-date-error');
        if (formSubmitted) validateReleaseDate();
    }

    // ======================== МНОЖЕСТВЕННЫЙ ВЫБОР ЖАНРОВ ========================
    const genreCheckboxes = document.querySelectorAll('input[name="genres[]"]');
    const selectedGenresContainer = document.getElementById('selected-genres');
    function updateSelectedGenres() {
        if (selectedGenresContainer) {
            selectedGenresContainer.style.opacity = '0';
            setTimeout(() => {
                selectedGenresContainer.innerHTML = '';
                genreCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        const genreElement = document.createElement('div');
                        genreElement.className = 'selected-genre';
                        genreElement.innerHTML = `<span>${checkbox.value}</span><button type="button" class="remove-genre" data-genre="${checkbox.value}">×</button>`;
                        selectedGenresContainer.appendChild(genreElement);
                    }
                });
                selectedGenresContainer.style.opacity = '1';
                clearError('genres-error');
            }, 100);
        }
    }
    genreCheckboxes.forEach(checkbox => checkbox.addEventListener('change', updateSelectedGenres));
    if (selectedGenresContainer) {
        selectedGenresContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-genre')) {
                const genre = e.target.getAttribute('data-genre');
                const checkbox = document.querySelector(`input[value="${genre}"]`);
                if (checkbox) { checkbox.checked = false; updateSelectedGenres(); }
            }
        });
    }

    // ======================== ПРЕДПРОСМОТР ОБЛОЖКИ И СКРИНШОТОВ ========================
    const coverInput = document.getElementById('game-cover');
    const coverPreview = document.getElementById('cover-preview');
    if (coverInput) {
        coverInput.addEventListener('change', function() {
            coverPreview.innerHTML = '';
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    showError('cover-error', 'Неверный формат файла. Допустимы: JPG, PNG, WebP.');
                    this.value = '';
                    return;
                }
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
                    removeBtn.onclick = function() { coverPreview.innerHTML = ''; coverInput.value = ''; clearError('cover-error'); };
                    previewItem.appendChild(img);
                    previewItem.appendChild(removeBtn);
                    coverPreview.appendChild(previewItem);
                    clearError('cover-error');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const screenshotsInput = document.getElementById('game-screenshots');
    const screenshotsPreview = document.getElementById('screenshots-preview');
    if (screenshotsInput) {
        screenshotsInput.addEventListener('change', function() {
            screenshotsPreview.innerHTML = '';
            if (this.files) {
                Array.from(this.files).forEach(file => {
                    const validTypes = ['image/jpeg', 'image/png'];
                    if (!validTypes.includes(file.type)) {
                        showError('screenshots-error', 'Неверный формат файла. Допустимы: JPG, PNG.');
                        this.value = '';
                        return;
                    }
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
                        removeBtn.onclick = function() { previewItem.remove(); clearError('screenshots-error'); };
                        previewItem.appendChild(img);
                        previewItem.appendChild(removeBtn);
                        screenshotsPreview.appendChild(previewItem);
                        clearError('screenshots-error');
                    };
                    reader.readAsDataURL(file);
                });
            }
        });
    }

    // ======================== ФУНКЦИИ ВАЛИДАЦИИ ========================
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) errorElement.textContent = message;
        let fieldId = elementId.replace('-error', '');
        const fieldsWithGamePrefix = ['title', 'developer', 'publisher', 'release-date', 'price', 'summary', 'description', 'cover', 'screenshots'];
        if (fieldsWithGamePrefix.includes(fieldId)) fieldId = 'game-' + fieldId;
        const inputElement = document.getElementById(fieldId);
        if (inputElement) inputElement.classList.add('input-error');
    }
    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) errorElement.textContent = '';
        let fieldId = elementId.replace('-error', '');
        const fieldsWithGamePrefix = ['title', 'developer', 'publisher', 'release-date', 'price', 'summary', 'description', 'cover', 'screenshots'];
        if (fieldsWithGamePrefix.includes(fieldId)) fieldId = 'game-' + fieldId;
        const inputElement = document.getElementById(fieldId);
        if (inputElement) inputElement.classList.remove('input-error');
    }
    function clearAllErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    }

    function validateTitle() {
        const title = document.getElementById('game-title')?.value.trim() || '';
        const regex = /^[a-zA-Zа-яА-Я0-9\s\-'’:,.!?()&+]{2,100}$/;
        if (!title) { showError('title-error', 'Название игры обязательно'); return false; }
        if (!regex.test(title)) { showError('title-error', 'Название должно содержать только буквы, цифры, пробелы и основные символы (2-100 символов)'); return false; }
        clearError('title-error');
        return true;
    }
    function validateDeveloper() {
        const developer = document.getElementById('game-developer')?.value.trim() || '';
        const regex = /^[a-zA-Zа-яА-Я0-9\s\-'’:,.!?()&+]{2,50}$/;
        if (!developer) { showError('developer-error', 'Разработчик обязателен'); return false; }
        if (!regex.test(developer)) { showError('developer-error', 'Название разработчика должно содержать только буквы, цифры, пробелы и основные символы (2-50 символов)'); return false; }
        clearError('developer-error');
        return true;
    }
    function validatePublisher() {
        const publisher = document.getElementById('game-publisher')?.value.trim() || '';
        const regex = /^[a-zA-Zа-яА-Я0-9\s\-'’:,.!?()&+]{0,50}$/;
        if (publisher && !regex.test(publisher)) { showError('publisher-error', 'Название издателя должно содержать только буквы, цифры, пробелы и основные символы (не более 50 символов)'); return false; }
        clearError('publisher-error');
        return true;
    }
    function validateGenres() {
        const genres = document.querySelectorAll('input[name="genres[]"]:checked');
        if (genres.length === 0) { showError('genres-error', 'Выберите хотя бы один жанр'); return false; }
        clearError('genres-error');
        return true;
    }
    function validateReleaseDate() {
        const releaseDate = document.getElementById('game-release-date')?.value || '';
        if (!releaseDate) { showError('release-date-error', 'Дата выхода обязательна'); return false; }
        const parts = releaseDate.split('.');
        if (parts.length !== 3) { showError('release-date-error', 'Неверный формат даты. Используйте ДД.ММ.ГГГГ'); return false; }
        const day = parseInt(parts[0], 10), month = parseInt(parts[1], 10) - 1, year = parseInt(parts[2], 10);
        const selectedDateObj = new Date(year, month, day);
        if (isNaN(selectedDateObj.getTime())) { showError('release-date-error', 'Неверная дата'); return false; }
        const today = new Date(); today.setHours(0,0,0,0); selectedDateObj.setHours(0,0,0,0);
        if (selectedDateObj > today) { showError('release-date-error', 'Дата выхода не может быть в будущем'); return false; }
        clearError('release-date-error');
        return true;
    }
    function validatePrice() {
        const price = document.getElementById('game-price')?.value.trim() || '';
        const regex = /^\d+(\.\d{1,2})?$/;
        if (!price) { showError('price-error', 'Цена обязательна'); return false; }
        if (!regex.test(price)) { showError('price-error', 'Цена должна быть числом с двумя знаками после запятой (например: 1999.99)'); return false; }
        const priceValue = parseFloat(price);
        if (priceValue < 0 || priceValue > 100000) { showError('price-error', 'Цена должна быть в диапазоне от 0 до 100 000 рублей'); return false; }
        clearError('price-error');
        return true;
    }
    function validateRating() {
        const rating = document.getElementById('game-rating')?.value.trim();
        if (!rating) { 
            clearError('rating-error'); 
            return true; 
        }
        const num = parseFloat(rating);
        if (isNaN(num) || num < 0 || num > 10) {
            showError('rating-error', 'Рейтинг должен быть числом от 0 до 10');
            return false;
        }
        clearError('rating-error');
        return true;
    }    
    function validateSummary() {
        const summary = document.getElementById('game-summary')?.value.trim() || '';
        const regex = /^[a-zA-Zа-яА-Я0-9\s\.,!?\-]{10,40}$/;
        if (!summary) { showError('summary-error', 'Краткое описание обязательно'); return false; }
        if (!regex.test(summary)) { showError('summary-error', 'Краткое описание должно содержать от 10 до 40 символов (буквы, цифры, пробелы и основные знаки препинания)'); return false; }
        clearError('summary-error');
        return true;
    }
    function validateDescription() {
        const description = document.getElementById('game-description')?.value.trim() || '';
        if (!description) { showError('description-error', 'Полное описание обязательно'); return false; }
        if (description.length < 70) { showError('description-error', 'Полное описание должно содержать минимум 70 символов'); return false; }
        clearError('description-error');
        return true;
    }
    function validatePlatforms() {
        const platforms = document.querySelectorAll('input[name="platforms[]"]:checked');
        if (platforms.length === 0) { showError('platforms-error', 'Выберите хотя бы одну платформу'); return false; }
        clearError('platforms-error');
        return true;
    }
    function validateModes() {
        const modes = document.querySelectorAll('input[name="modes[]"]:checked');
        if (modes.length === 0) { showError('modes-error', 'Выберите хотя бы один режим игры'); return false; }
        clearError('modes-error');
        return true;
    }
    function validateCover() {
        const cover = document.getElementById('game-cover')?.files[0];
        if (!cover) { showError('cover-error', 'Обложка игры обязательна'); return false; }
        clearError('cover-error');
        return true;
    }
    function validateScreenshots() {
        const screenshots = document.getElementById('game-screenshots')?.files;
        if (!screenshots || screenshots.length < 3) { showError('screenshots-error', 'Необходимо загрузить минимум 3 скриншота'); return false; }
        if (screenshots.length > 10) { showError('screenshots-error', 'Можно загрузить не более 10 скриншотов'); return false; }
        clearError('screenshots-error');
        return true;
    }

    // ======================== AJAX ОТПРАВКА ФОРМЫ ========================
    const form = document.getElementById('add-game-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            formSubmitted = true;
            clearAllErrors();

            // Клиентская валидация
            const isValid = validateTitle() && validateDeveloper() && validatePublisher() &&
                validateGenres() && validateReleaseDate() && validatePrice() &&
                validateRating() &&
                validateSummary() && validateDescription() && validatePlatforms() &&
                validateModes() && validateCover() && validateScreenshots();

            if (!isValid) return;

            // Подготовка FormData
            const formData = new FormData();
            formData.append('title', document.getElementById('game-title').value.trim());
            formData.append('developer', document.getElementById('game-developer').value.trim());
            const publisher = document.getElementById('game-publisher').value.trim();
            if (publisher) formData.append('publisher', publisher);
            // Жанры
            const genres = Array.from(document.querySelectorAll('input[name="genres[]"]:checked')).map(cb => cb.value);
            genres.forEach(g => formData.append('genres', g));
            // Дата
            const dateStr = document.getElementById('game-release-date').value;
            const [day, month, year] = dateStr.split('.');
            const formattedDate = `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
            formData.append('releaseDate', formattedDate);
            // Цена
            formData.append('price', document.getElementById('game-price').value);
            // Рейтинг
            const rating = document.getElementById('game-rating')?.value.trim();
            if (rating) formData.append('rating', rating);
            // Описания
            formData.append('summary', document.getElementById('game-summary').value.trim());
            formData.append('description', document.getElementById('game-description').value.trim());
            // Платформы
            const platforms = Array.from(document.querySelectorAll('input[name="platforms[]"]:checked')).map(cb => cb.value);
            platforms.forEach(p => formData.append('platforms', p));
            // Режимы
            const modes = Array.from(document.querySelectorAll('input[name="modes[]"]:checked')).map(cb => cb.value);
            modes.forEach(m => formData.append('modes', m));
            // Системные требования, если выбран PC
            let systemRequirements = '';
            if (document.getElementById('platform-pc')?.checked) {
                const cpu = document.getElementById('req-cpu')?.value.trim() || '';
                const ram = document.getElementById('req-ram')?.value.trim() || '';
                const gpu = document.getElementById('req-gpu')?.value.trim() || '';
                const storage = document.getElementById('req-storage')?.value.trim() || '';
                systemRequirements = `CPU: ${cpu}; RAM: ${ram}; GPU: ${gpu}; Storage: ${storage}`;
            }
            formData.append('systemRequirements', systemRequirements);
            // Файлы
            const coverFile = document.getElementById('game-cover').files[0];
            if (coverFile) formData.append('cover', coverFile);
            const screenshotFiles = document.getElementById('game-screenshots').files;
            Array.from(screenshotFiles).forEach(file => formData.append('screenshots', file));

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            try {
                const response = await fetch('/api/games', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Игра успешно добавлена!');
                    window.location.href = '/catalog.html';
                } else {
                    if (result.errors) {
                        for (const [field, message] of Object.entries(result.errors)) {
                            const errorSpan = document.getElementById(`${field.toLowerCase()}-error`);
                            if (errorSpan) errorSpan.textContent = message;
                        }
                    } else {
                        alert('Ошибка при добавлении игры: ' + (result.title || 'неизвестная ошибка'));
                    }
                }
            } catch (err) {
                console.error(err);
                alert('Сетевая ошибка. Проверьте соединение с сервером.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });

        // Обработчик сброса формы
        form.addEventListener('reset', function() {
            clearAllErrors();
            selectedDate = null;
            datepickerInput.value = '';
            if (coverPreview) coverPreview.innerHTML = '';
            if (screenshotsPreview) screenshotsPreview.innerHTML = '';
            if (selectedGenresContainer) selectedGenresContainer.innerHTML = '';
            genreCheckboxes.forEach(cb => cb.checked = false);
            formSubmitted = false;
            setTimeout(() => { if (pcCheckbox) toggleSystemRequirements(); }, 0);
        });
    }

    // Дополнительный обработчик для клика по любому месту чекбокс-группы (чтобы кликать на весь блок)
    document.querySelectorAll('.checkbox-group').forEach(group => {
        group.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'LABEL') {
                const cb = group.querySelector('input[type="checkbox"]');
                if (cb) {
                    cb.checked = !cb.checked;
                    // Искусственно вызываем событие change, чтобы обновились выбранные жанры и т.д.
                    cb.dispatchEvent(new Event('change'));
                }
            }
        });
    });
});