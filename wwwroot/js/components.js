class SiteHeader extends HTMLElement {
  connectedCallback() {
    const base = this.getAttribute('base') || '';
    this.innerHTML = `
  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a class="logo" href="${base}index.html" aria-label="На главную GameView">
        <span class="logo-mark" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
            <path d="M15.9 5.5C15.3 4.5 14.2 4 13 4H7c-1.2 0-2.3.5-2.9 1.5c-2.3 3.5-2.8 8.8-1.2 9.9c1.6 1.1 5.2-3.7 7.1-3.7s5.4 4.8 7.1 3.7c1.6-1.1 1.1-6.4-1.2-9.9M8 9H7v1H6V9H5V8h1V7h1v1h1zm5.4.5c0 .5-.4.9-.9.9s-.9-.4-.9-.9s.4-.9.9-.9s.9.4.9.9m1.9-2c0 .5-.4.9-.9.9s-.9-.4-.9-.9s.4-.9.9-.9s.9.4.9.9" />
          </svg>
        </span>
        <span>GameView</span>
      </a>
      <nav class="main-nav" aria-label="Основная навигация">
        <ul>
          <li><a href="${base}index.html">Главная</a></li>
          <li><a href="${base}catalog.html">Каталог</a></li>
          <li><a href="${base}pages/reviews.html">Обзоры</a></li>
          <li><a href="${base}pages/news.html">Новости</a></li>
          <!-- <li><a href="${base}pages/top-games.html">Рейтинги</a></li> -->
          <li><a href="${base}pages/contacts.html">Контакты</a></li>
        </ul>
      </nav>
      <span class="spacer"></span>
      <a class="user-link" href="${base}pages/auth.html" aria-label="Вход и регистрация">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20.944 18.432a2.577 2.577 0 0 1-2.729 2.5c-2.153.012-4.307 0-6.46 0a.5.5 0 0 1 0-1c2.2 0 4.4.032 6.6 0c1.107-.016 1.589-.848 1.589-1.838V5.63a1.545 1.545 0 0 0-.969-1.471a3.027 3.027 0 0 0-1.061-.095h-6.159a.5.5 0 0 1 0-1c2.225 0 4.465-.085 6.688 0a2.566 2.566 0 0 1 2.5 2.67Z" />
          <path fill="currentColor" d="M15.794 12.354a.459.459 0 0 0 .138-.312a.3.3 0 0 0 .006-.042a.29.29 0 0 0-.006-.041a.455.455 0 0 0-.138-.313l-3.669-3.668a.5.5 0 0 0-.707.707l2.816 2.815H3.492a.5.5 0 0 0 0 1h10.742l-2.816 2.815a.5.5 0 0 0 .707.707Z" />
        </svg>
      </a>
    </div>
  </header>
    `;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const base = this.getAttribute('base') || '';
    this.innerHTML = `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <p>© 2025 GameView. Все права защищены.</p>
      <div class="socials" aria-label="Социальные сети">
        <a class="has-tip" data-tip="VK" href="#" aria-label="VK">
          <i class="fab fa-vk"></i>
          <span class="sr-only">VK</span>
        </a>
        <a class="has-tip" data-tip="WhatsApp" href="#" aria-label="WhatsApp">
          <i class="fab fa-whatsapp"></i>
          <span class="sr-only">WhatsApp</span>
        </a>
        <a class="has-tip" data-tip="Telegram" href="#" aria-label="Telegram">
          <i class="fab fa-telegram"></i>
          <span class="sr-only">Telegram</span>
        </a>
      </div>
    </div>
  </footer>
    `;
  }
}

customElements.define('site-header', SiteHeader);
customElements.define('site-footer', SiteFooter);


