/**
 * SMEG Service Kyiv - Головний інтерактивний скрипт
 * Пряма клієнтська відправка заявок у Telegram через Telegram Bot API (без PHP та бекенду)
 */

// Плавне сповіщення (Toast / Notification)
function showToast(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const iconSvg = type === "success" 
    ? `<svg class="svg-icon" style="color: #34d399; width: 18px; height: 18px;" viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg class="svg-icon" style="color: #f87171; width: 18px; height: 18px;" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div>${message}</div>
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

// Модальні вікна
window.openQuickModal = function() {
  const modal = document.getElementById("quick-order-modal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    const firstInput = modal.querySelector('input:not([type="hidden"]):not([style*="display:none"])');
    if (firstInput) firstInput.focus();
  }
};

window.closeQuickModal = function() {
  const modal = document.getElementById("quick-order-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. Мобільне меню
     ========================================================================== */
  const mobileBtn = document.getElementById("mobile-menu-toggle");
  const navMenu = document.getElementById("site-nav-menu");

  const closeMobileMenu = () => {
    if (navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
      if (mobileBtn) {
        mobileBtn.setAttribute("aria-expanded", "false");
        mobileBtn.innerHTML = `<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
      }
    }
  };

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      document.body.style.overflow = isOpen ? "hidden" : "";
      mobileBtn.setAttribute("aria-expanded", isOpen);
      mobileBtn.innerHTML = isOpen 
        ? `<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`
        : `<svg class="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`;
    });

    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) {
        closeMobileMenu();
      }
    });
  }

  /* ==========================================================================
     2. Керування модальними вікнами
     ========================================================================== */
  document.querySelectorAll("[data-open-modal]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeMobileMenu();
      window.openQuickModal();
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.closeQuickModal();
    });
  });

  const modalOverlay = document.getElementById("quick-order-modal");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        window.closeQuickModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      window.closeQuickModal();
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     3. Акордеони FAQ
     ========================================================================== */
  document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
      const item = question.parentElement;
      const answer = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach(other => {
        if (other !== item) {
          other.classList.remove("open");
          const otherAnswer = other.querySelector(".faq-answer");
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        item.classList.remove("open");
        answer.style.maxHeight = null;
      }
    });
  });

  /* ==========================================================================
     4. Пряма відправка всіх форм у Telegram Bot API (без PHP)
     ========================================================================== */
  const forms = document.querySelectorAll("form");

  forms.forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Збір значень полів форми
      const nameInput = form.querySelector('[name="name"]') || form.querySelector('input[type="text"]:not([name="website_hp"])');
      const phoneInput = form.querySelector('[name="phone"]') || form.querySelector('input[type="tel"]');
      const deviceInput = form.querySelector('[name="device"]') || form.querySelector('[name="service"]') || form.querySelector('select');
      const messageInput = form.querySelector('[name="message"]') || form.querySelector('[name="comment"]') || form.querySelector('[name="desc"]') || form.querySelector('textarea');
      const honeypotInput = form.querySelector('[name="website_hp"]');

      // Захист від спам-ботів (якщо приховане поле заповнене — ігноруємо)
      if (honeypotInput && honeypotInput.value.trim() !== "") {
        console.warn("Spam bot prevented.");
        form.reset();
        window.closeQuickModal();
        showToast("Дякуємо! Ваша заявка прийнята.", "success");
        return;
      }

      const clientName = nameInput ? nameInput.value.trim() : "Не вказано";
      const clientPhone = phoneInput ? phoneInput.value.trim() : "";
      const clientDevice = deviceInput ? (deviceInput.value || deviceInput.options[deviceInput.selectedIndex]?.text || "Не вказано") : "Не вказано";
      const clientMessage = messageInput && messageInput.value.trim() ? messageInput.value.trim() : "—";

      // Валідація обов'язкового номера телефону
      if (!clientPhone) {
        showToast("Будь ласка, заповніть номер телефону.", "error");
        if (phoneInput) {
          phoneInput.focus();
          phoneInput.style.borderColor = "var(--brand-red)";
        }
        return;
      }

      const phoneDigits = clientPhone.replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        showToast("Вкажіть коректний номер телефону (мінімум 10 цифр).", "error");
        if (phoneInput) {
          phoneInput.focus();
          phoneInput.style.borderColor = "var(--brand-red)";
        }
        return;
      }

      // Отримання поточної дати та часу (Київ)
      const now = new Date();
      const dateTimeStr = now.toLocaleString("uk-UA", {
        timeZone: "Europe/Kyiv",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });

      // Формування красивого HTML-повідомлення для Telegram
      const telegramMessage = 
`🔥 <b>Нова заявка: SMEG Service</b>
👤 <b>Клієнт:</b> ${clientName}
📞 <b>Телефон:</b> ${clientPhone}
⚙️ <b>Техніка:</b> ${clientDevice}
💬 <b>Проблема:</b> ${clientMessage}
⏰ <i>${dateTimeStr}</i>`;

      // Отримання конфігурації Telegram
      const cfg = window.SITE_CONFIG || (typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : {});
      const botToken = (cfg.telegram && cfg.telegram.botToken) || "8903060860:AAFKSB4OSIJMmKnf8FlRlCOZUdu8_4xc_Cs";
      const chatId = (cfg.telegram && cfg.telegram.chatId) || "-5342810428";

      // Блокування кнопки сабміту та індикація відправки
      const submitBtn = form.querySelector('button[type="submit"]');
      let originalBtnContent = "";
      if (submitBtn) {
        originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";
        submitBtn.style.cursor = "not-allowed";
        submitBtn.innerHTML = `<span>Відправляємо...</span>`;
      }

      try {
        // Якщо токен ще не вставлений (демо-режим)
        if (botToken === "ВСТАВ_СВІЙ_ТОКЕН_ТУТ" || !botToken) {
          console.info("Telegram Bot Token не налаштовано в js/config.js. Емуляція успішної відправки.");
          await new Promise(resolve => setTimeout(resolve, 600));
          
          form.reset();
          form.querySelectorAll("input, select, textarea").forEach(el => el.style.borderColor = "");
          window.closeQuickModal();
          showToast("Дякуємо! Ваша заявка прийнята. Майстер зателефонує вам протягом 10 хвилин", "success");
          return;
        }

        // Прямий POST-запит до Telegram Bot API
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: "HTML"
          })
        });

        const data = await response.json();

        if (response.ok && data.ok) {
          // Успіх
          form.reset();
          form.querySelectorAll("input, select, textarea").forEach(el => el.style.borderColor = "");
          window.closeQuickModal();
          showToast("Дякуємо! Ваша заявка прийнята. Майстер зателефонує вам протягом 10 хвилин", "success");
        } else {
          // Помилка відповіді Telegram API
          console.error("Telegram API error:", data);
          alert("Сталася помилка. Будь ласка, зателефонуйте нам за номером у шапці");
        }
      } catch (err) {
        console.error("Помилка відправки в Telegram:", err);
        alert("Сталася помилка. Будь ласка, зателефонуйте нам за номером у шапці");
      } finally {
        // Розблокування кнопки
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = "";
          submitBtn.style.cursor = "";
          submitBtn.innerHTML = originalBtnContent;
        }
      }
    });
  });

  /* ==========================================================================
     5. Автодоповнення номера телефону (+380)
     ========================================================================== */
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener("focus", () => {
      if (!input.value.trim()) {
        input.value = "+380";
      }
      input.style.borderColor = "";
    });

    input.addEventListener("input", () => {
      input.style.borderColor = "";
    });
  });

  /* ==========================================================================
     6. Кнопка "Вгору" (Scroll to Top)
     ========================================================================== */
  const scrollToTopBtn = document.getElementById("scroll-to-top-btn");
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
      } else {
        scrollToTopBtn.classList.remove("visible");
      }
    });
  }
});

