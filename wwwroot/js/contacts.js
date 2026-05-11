document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  let formSubmitted = false;

  // Функции валидации (оставить без изменений)
  function validateName() {
    const nameInput = document.getElementById('contact-name');
    const name = nameInput.value.trim();
    
    if (!name) {
      showError('contact-name-error', 'Имя обязательно для заполнения');
      return false;
    }
    
    if (name.length < 2) {
      showError('contact-name-error', 'Имя должно содержать минимум 2 символа');
      return false;
    }
    
    if (name.length > 50) {
      showError('contact-name-error', 'Имя не должно превышать 50 символов');
      return false;
    }
    
    clearError('contact-name-error');
    return true;
  }

  function validateEmail() {
    const emailInput = document.getElementById('contact-email');
    const email = emailInput.value.trim();
    
    // Более строгий regex для email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!email) {
      showError('contact-email-error', 'Email обязателен для заполнения');
      return false;
    }
    
    // Проверка длины
    if (email.length > 254) {
      showError('contact-email-error', 'Email слишком длинный (максимум 254 символа)');
      return false;
    }
    
    // Проверка локальной части (до @)
    const atIndex = email.indexOf('@');
    if (atIndex < 1) {
      showError('contact-email-error', 'Email должен содержать @ после имени пользователя');
      return false;
    }
    
    const localPart = email.substring(0, atIndex);
    if (localPart.length > 64) {
      showError('contact-email-error', 'Имя пользователя в email слишком длинное (максимум 64 символа)');
      return false;
    }
    
    // Проверка доменной части (после @)
    const domainPart = email.substring(atIndex + 1);
    if (domainPart.length < 3) {
      showError('contact-email-error', 'Доменная часть email слишком короткая');
      return false;
    }
    
    // Проверка на наличие точки в доменной части
    if (domainPart.indexOf('.') === -1) {
      showError('contact-email-error', 'Email должен содержать домен с точкой (например: example.com)');
      return false;
    }
    
    // Проверка на двойные точки
    if (email.includes('..')) {
      showError('contact-email-error', 'Email не должен содержать двойные точки');
      return false;
    }
    
    // Проверка на специальные символы в начале или конце
    if (email.startsWith('.') || email.endsWith('.') || email.startsWith('-') || email.endsWith('-')) {
      showError('contact-email-error', 'Email не должен начинаться или заканчиваться точкой или дефисом');
      return false;
    }
    
    // Проверка с помощью regex
    if (!emailRegex.test(email)) {
      showError('contact-email-error', 'Введите корректный email адрес');
      return false;
    }
    
    // Проверка на популярные домены (дополнительная валидация)
    const popularDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'mail.ru', 'yandex.ru'];
    const domain = domainPart.toLowerCase();
    const isPopularDomain = popularDomains.some(popular => domain.includes(popular));
    
    if (!isPopularDomain) {
      // Проверка валидности домена для нестандартных email
      const domainParts = domain.split('.');
      if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
        showError('contact-email-error', 'Домен верхнего уровня слишком короткий');
        return false;
      }
    }
    
    clearError('contact-email-error');
    return true;
  }

  function validateSubject() {
    const subjectSelect = document.getElementById('contact-subject');
    const subject = subjectSelect.value;
    
    if (!subject) {
      showError('contact-subject-error', 'Выберите тему сообщения');
      return false;
    }
    
    clearError('contact-subject-error');
    return true;
  }

  function validateMessage() {
    const messageTextarea = document.getElementById('contact-message');
    const message = messageTextarea.value.trim();
    
    if (!message) {
      showError('contact-message-error', 'Сообщение обязательно для заполнения');
      return false;
    }
    
    if (message.length < 10) {
      showError('contact-message-error', 'Сообщение должно содержать минимум 10 символов');
      return false;
    }
    
    if (message.length > 1000) {
      showError('contact-message-error', 'Сообщение не должно превышать 1000 символов');
      return false;
    }
    
    clearError('contact-message-error');
    return true;
  }

  function validateConsent() {
    const consentCheckbox = document.getElementById('contact-consent');
    
    if (!consentCheckbox.checked) {
      showError('contact-consent-error', 'Необходимо согласие на обработку данных');
      return false;
    }
    
    clearError('contact-consent-error');
    return true;
  }

  // Функции показа и скрытия ошибок (оставить без изменений)
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    
    const fieldId = elementId.replace('-error', '');
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
      inputElement.classList.add('input-error');
    }
  }

  function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
    
    const fieldId = elementId.replace('-error', '');
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

  // ИСПРАВЛЕННЫЙ КОД: Обработчики событий
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectSelect = document.getElementById('contact-subject');
  const messageTextarea = document.getElementById('contact-message');
  const consentCheckbox = document.getElementById('contact-consent');

  // Проверяем, что все элементы найдены
  if (!nameInput || !emailInput || !subjectSelect || !messageTextarea || !consentCheckbox) {
    console.error('Не все элементы формы найдены');
    return;
  }

  // Валидация при потере фокуса (только после первой отправки) - ИСПРАВЛЕНО
  nameInput.addEventListener('blur', function() {
    if (formSubmitted) {
      validateName();
    }
  });

  emailInput.addEventListener('blur', function() {
    if (formSubmitted) {
      validateEmail();
    }
  });

  subjectSelect.addEventListener('blur', function() {
    if (formSubmitted) {
      validateSubject();
    }
  });

  subjectSelect.addEventListener('change', function() {
    if (formSubmitted) {
      validateSubject();
    }
  });

  messageTextarea.addEventListener('blur', function() {
    if (formSubmitted) {
      validateMessage();
    }
  });

  const fieldIds = ['contact-name', 'contact-email', 'contact-subject', 'contact-message', 'contact-consent'];
  fieldIds.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('focus', function() {
        clearError(fieldId + '-error');
      });
    }
  });

  // nameInput.addEventListener('input', function() {
  //   if (formSubmitted) {
  //     validateName();
  //   }
  // });

  // emailInput.addEventListener('input', function() {
  //   if (formSubmitted) {
  //     validateEmail();
  //   }
  // });

  // messageTextarea.addEventListener('input', function() {
  //   if (formSubmitted) {
  //     validateMessage();
  //   }
  // });

  consentCheckbox.addEventListener('change', function() {
    if (formSubmitted) {
      validateConsent();
    }
  });

  // Обработка отправки формы - ИСПРАВЛЕНО
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    formSubmitted = true;
    
    // Валидируем все поля
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();
    const isConsentValid = validateConsent();
    
    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid && isConsentValid) {
      // Форма валидна, отправляем данные
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Показываем уведомление об успешной отправке
      showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
      
      // Очищаем форму
      form.reset();
      clearAllErrors();
      formSubmitted = false;
    } else {
      showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
      
      // Фокусируемся на первом поле с ошибкой
      // const firstErrorField = document.querySelector('.input-error');
      // if (firstErrorField) {
      //   firstErrorField.focus();
      // }
    }
  });

  // Обработка сброса формы
  form.addEventListener('reset', function() {
    clearAllErrors();
    formSubmitted = false;
  });

  // Функция показа уведомлений (оставить как есть - это хорошая фича для contacts)
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#2dd4a7' : type === 'error' ? '#ff6b6b' : '#6c8cff';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    }, 4000);
  }

  // Добавляем стили для анимации уведомлений
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
  `;
  document.head.appendChild(style);
});