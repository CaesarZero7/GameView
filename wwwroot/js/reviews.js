document.addEventListener('DOMContentLoaded', function() {
  const reviewCards = document.querySelectorAll('.review-card');
  const WORD_LIMIT = 100;

  // Обработчик сворачивания/разворачивания комментариев
  document.querySelectorAll('.comments-title').forEach(title => {
    title.addEventListener('click', function() {
      const commentsSection = this.closest('.comments-section');
      commentsSection.classList.toggle('collapsed');
    });
  });

  reviewCards.forEach(card => {
    const reviewText = card.querySelector('.review-text');
    const readMoreBtn = card.querySelector('.read-more');
    const reviewTextWrapper = card.querySelector('.review-text-wrapper');
    
    if (!reviewText) return;

    const originalText = reviewText.textContent.trim();
    const words = originalText.split(/\s+/);
    
    // Показываем кнопку ТОЛЬКО если текст длиннее лимита
    if (words.length <= WORD_LIMIT) {
      if (readMoreBtn) {
        readMoreBtn.style.display = 'none';
      }
    } else {
      // Для длинных текстов обрезаем и добавляем функциональность
      const truncatedText = words.slice(0, WORD_LIMIT).join(' ') + '...';
      reviewText.textContent = truncatedText;
      reviewText.classList.add('collapsed');
      reviewText.dataset.fullText = originalText;

      readMoreBtn.addEventListener('click', function() {
        const isExpanded = reviewTextWrapper.classList.contains('expanded');
        
        if (isExpanded) {
          // Сворачиваем
          reviewText.textContent = truncatedText;
          reviewText.classList.add('collapsed');
          readMoreBtn.textContent = 'Читать полностью';
          reviewTextWrapper.classList.remove('expanded');
        } else {
          // Разворачиваем
          reviewText.textContent = originalText;
          reviewText.classList.remove('collapsed');
          readMoreBtn.textContent = 'Свернуть';
          reviewTextWrapper.classList.add('expanded');
        }
      });
    }

    // Обработчик формы комментария
    const commentForm = card.querySelector('.comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const textarea = this.querySelector('textarea');
        const commentText = textarea.value.trim();
        
        if (commentText) {
          // Здесь можно добавить логику отправки комментария на сервер
          console.log('Новый комментарий:', commentText);
          
          // В реальном приложении здесь будет AJAX-запрос
          // Пока просто показываем уведомление
          showNotification('Комментарий отправлен! В реальном приложении он появится после модерации.');
          textarea.value = '';
        }
      });
    }

    // Обработчик кнопок "Ответить" в комментариях
    const replyButtons = card.querySelectorAll('.reply-btn');
    replyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const commentText = this.closest('.comment').querySelector('.comment-text').textContent;
        const commentAuthor = this.closest('.comment').querySelector('.comment-author').textContent;
        
        // Фокус на текстовое поле и добавление упоминания
        const textarea = card.querySelector('.comment-form textarea');
        textarea.value = `@${commentAuthor}, `;
        textarea.focus();
        
        showNotification(`Ответ на комментарий ${commentAuthor}`);
      });
    });

    // Обработчик голосования за комментарии
    const commentVoteButtons = card.querySelectorAll('.comment-vote-btn');
    commentVoteButtons.forEach(button => {
      button.addEventListener('click', function() {
        const voteType = this.dataset.vote;
        const comment = this.closest('.comment');
        const likeBtn = comment.querySelector('[data-vote="like"]');
        const dislikeBtn = comment.querySelector('[data-vote="dislike"]');
        
        // Проверяем, не голосовал ли уже пользователь за противоположный вариант
        const oppositeBtn = voteType === 'like' ? dislikeBtn : likeBtn;
        const isOppositeVoted = oppositeBtn.classList.contains('voted');
        
        if (isOppositeVoted) {
          // Убираем голос с противоположной кнопки
          const oppositeCount = parseInt(oppositeBtn.querySelector('.count').textContent);
          oppositeBtn.querySelector('.count').textContent = Math.max(0, oppositeCount - 1);
          oppositeBtn.classList.remove('voted');
        }
        
        // Переключаем состояние текущей кнопки
        const isCurrentVoted = this.classList.contains('voted');
        const countElement = this.querySelector('.count');
        let count = parseInt(countElement.textContent);
        
        if (isCurrentVoted) {
          // Убираем голос
          count = Math.max(0, count - 1);
          this.classList.remove('voted');
        } else {
          // Добавляем голос
          count++;
          this.classList.add('voted');
        }
        
        countElement.textContent = count;
        
        // Добавляем визуальную обратную связь
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 200);
      });
    });
  });

  // Обработчик голосования за обзоры
  const voteButtons = document.querySelectorAll('.review-actions .icon-btn');
  voteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const reviewCard = this.closest('.review-card');
      const likeBtn = reviewCard.querySelector('[aria-label="Полезно"]');
      const dislikeBtn = reviewCard.querySelector('[aria-label="Не полезно"]');
      
      // Определяем тип голоса
      const isLike = this === likeBtn;
      const oppositeBtn = isLike ? dislikeBtn : likeBtn;
      
      // Проверяем, не голосовал ли уже пользователь за противоположный вариант
      const isOppositeVoted = oppositeBtn.classList.contains('voted');
      
      if (isOppositeVoted) {
        // Убираем голос с противоположной кнопки
        const oppositeCount = parseInt(oppositeBtn.querySelector('.count').textContent);
        oppositeBtn.querySelector('.count').textContent = Math.max(0, oppositeCount - 1);
        oppositeBtn.classList.remove('voted');
      }
      
      // Переключаем состояние текущей кнопки
      const isCurrentVoted = this.classList.contains('voted');
      const countElement = this.querySelector('.count');
      let count = parseInt(countElement.textContent);
      
      if (isCurrentVoted) {
        // Убираем голос
        count = Math.max(0, count - 1);
        this.classList.remove('voted');
      } else {
        // Добавляем голос
        count++;
        this.classList.add('voted');
      }
      
      countElement.textContent = count;
      
      // Добавляем визуальную обратную связь
      this.style.transform = 'scale(1.1)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 200);
    });
  });

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
    }, 3000);
  }

  // Функционал сортировки и фильтрации
  const filterForm = document.querySelector('form[aria-label="Фильтры обзоров"]');
  const sortRadios = document.querySelectorAll('input[name="sort"]');
  
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });
    
    filterForm.addEventListener('reset', function() {
      setTimeout(() => {
        applyFilters();
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
  
  function applyFilters() {
    const gameFilter = document.querySelector('select[name="game"]').value;
    const ratingFilter = document.querySelector('select[name="rating"]').value;
    const dateFilter = document.querySelector('select[name="date"]').value;
    
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach(card => {
      let shouldShow = true;
      
      // Фильтр по игре
      if (gameFilter) {
        const gameBadge = card.querySelector('.badge');
        if (!gameBadge || !gameBadge.textContent.includes(gameFilter)) {
          shouldShow = false;
        }
      }
      
      // Фильтр по рейтингу
      if (ratingFilter) {
        const ratingBadge = card.querySelector('.year-badge');
        if (ratingBadge) {
          const ratingText = ratingBadge.textContent;
          const rating = parseFloat(ratingText.match(/(\d+\.?\d*)/)?.[1] || 0);
          
          switch (ratingFilter) {
            case '9–10':
              if (rating < 9) shouldShow = false;
              break;
            case '7–8':
              if (rating < 7 || rating >= 9) shouldShow = false;
              break;
            case '5–6':
              if (rating < 5 || rating >= 7) shouldShow = false;
              break;
            case 'до 4':
              if (rating >= 5) shouldShow = false;
              break;
          }
        }
      }
      
      // Фильтр по дате (упрощенная версия)
      if (dateFilter) {
        const dateText = card.querySelector('.muted').textContent;
        const currentDate = new Date();
        const reviewDate = new Date(dateText.match(/(\d{2})\.(\d{2})\.(\d{4})/)?.[0] || currentDate);
        
        switch (dateFilter) {
          case 'За месяц':
            const monthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (reviewDate < monthAgo) shouldShow = false;
            break;
          case 'За год':
            const yearAgo = new Date(currentDate.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (reviewDate < yearAgo) shouldShow = false;
            break;
        }
      }
      
      // Показываем/скрываем карточку
      if (shouldShow) {
        card.style.display = 'block';
        card.classList.add('fade-in');
      } else {
        card.style.display = 'none';
        card.classList.remove('fade-in');
      }
    });
    
    showNotification(`Применены фильтры: ${gameFilter || 'Все игры'}, ${ratingFilter || 'Любой рейтинг'}, ${dateFilter || 'За всё время'}`);
  }
  
  function applySorting(sortType) {
    const reviewList = document.querySelector('.review-list');
    const reviewCards = Array.from(document.querySelectorAll('.review-card'));
    
    reviewCards.sort((a, b) => {
      switch (sortType) {
        case 'date':
          // Сортировка по дате (новые сначала)
          const dateA = new Date(a.querySelector('.muted').textContent.match(/(\d{2})\.(\d{2})\.(\d{4})/)?.[0] || 0);
          const dateB = new Date(b.querySelector('.muted').textContent.match(/(\d{2})\.(\d{2})\.(\d{4})/)?.[0] || 0);
          return dateB - dateA;
          
        case 'rating':
          // Сортировка по рейтингу (высокие сначала)
          const ratingA = parseFloat(a.querySelector('.year-badge').textContent.match(/(\d+\.?\d*)/)?.[1] || 0);
          const ratingB = parseFloat(b.querySelector('.year-badge').textContent.match(/(\d+\.?\d*)/)?.[1] || 0);
          return ratingB - ratingA;
          
        case 'usefulness':
          // Сортировка по полезности (по лайкам)
          const likesA = parseInt(a.querySelector('.review-actions .icon-btn .count').textContent || 0);
          const likesB = parseInt(b.querySelector('.review-actions .icon-btn .count').textContent || 0);
          return likesB - likesA;
          
        default:
          return 0;
      }
    });
    
    // Перестраиваем DOM
    reviewCards.forEach(card => {
      reviewList.appendChild(card);
      card.classList.add('fade-in');
    });
    
    showNotification(`Сортировка: ${getSortLabel(sortType)}`);
  }
  
  function getSortLabel(sortType) {
    switch (sortType) {
      case 'date': return 'по дате';
      case 'rating': return 'по рейтингу';
      case 'usefulness': return 'по полезности';
      default: return 'по умолчанию';
    }
  }
  
  // Инициализация сортировки по умолчанию
  const defaultSort = document.querySelector('input[name="sort"]:checked');
  if (defaultSort) {
    applySorting(defaultSort.value);
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