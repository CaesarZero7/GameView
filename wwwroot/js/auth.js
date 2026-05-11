const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// Простое переключение между формами
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Добавляем обработчики для форм
document.addEventListener('DOMContentLoaded', function() {
  const signUpForm = document.querySelector('.sign-up form');
  const signInForm = document.querySelector('.sign-in form');

  // Обработчик для формы регистрации
  if (signUpForm) {
    signUpForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;
      
      if (!name || !email || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
      }
      
      if (password.length < 6) {
        alert('Пароль должен содержать минимум 6 символов');
        return;
      }
      
      console.log('Регистрация:', { name, email, password });
      alert('Регистрация успешна! (Демо-режим)');
    });
  }

  // Обработчик для формы входа
  if (signInForm) {
    signInForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      const password = this.querySelector('input[type="password"]').value;
      
      if (!email || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
      }
      
      console.log('Вход:', { email, password });
      alert('Вход выполнен! (Демо-режим)');
    });
  }

  // Обработчик для ссылки "Забыли пароль?"
  const forgotPasswordLink = document.querySelector('.forgot-password');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Функция восстановления пароля будет доступна в ближайшее время');
    });
  }

  // Обработчики для социальных кнопок
  const socialLinks = document.querySelectorAll('.social-icons a');
  socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const platform = this.querySelector('i').className;
      alert(`Вход через ${getSocialPlatformName(platform)} будет доступен в ближайшее время`);
    });
  });
});

// Функция для получения названия социальной платформы
function getSocialPlatformName(className) {
  if (className.includes('google')) return 'Google';
  if (className.includes('facebook')) return 'Facebook';
  if (className.includes('github')) return 'GitHub';
  if (className.includes('linkedin')) return 'LinkedIn';
  return 'социальную сеть';
}