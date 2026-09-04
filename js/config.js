/**
 * SMEG Repair Workshop - Конфігураційний файл
 * Тут можна в один клік змінити всі номери телефонів, пошту, адресу, робочі години та налаштування Telegram Bot.
 */
const SITE_CONFIG = {
    brandName: "SMEG Service",
    brandTagline: "Спеціалізована майстерня з ремонту побутової техніки SMEG",

    // Пряма відправка заявок у Telegram-чат (Telegram Bot API)
    telegram: {
        botToken: "8903060860:AAFKSB4OSIJMmKnf8FlRlCOZUdu8_4xc_Cs",
        chatId: "-1004473436337"
    },

    address: {
        city: "Київ",
        street: "вул. Вацлава Гавела, 16, корп. 6",
        full: "м. Київ, вул. Вацлава Гавела, 16, корп. 6",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.2291410143894!2d30.41369327685324!3d50.43685458896081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cc098b1cb3c1%3A0x6b306a44c7bca5e3!2z0LHRg9C70YzQstCw0YAg0JLQsNGG0LvQsNCy0LAg0JPQsNCy0LXQu9CwLCAxNiwg0JrQuNGX0LIsIDAyMDAw!5e0!3m2!1suk!2sua!4v1709400000000!5m2!1suk!2sua"
    },
    phones: [
        { raw: "+380683401208", display: "+38 (068) 340-12-08", primary: true, label: "Київстар / Основний" },
        { raw: "+380756635093", display: "+38 (075) 663-50-93", primary: false, label: "Vodafone / Додатковий" }
    ],
    emails: {
        office: "office@smeg-service.kiev.ua",
        info: "info@smeg-service.kiev.ua",
        support: "smeg.service.kyiv@gmail.com"
    },
    messengers: {
        telegram: "https://t.me/smeg_service_lead_bot",
        viber: "viber://chat?number=%2B380683401208",
        whatsapp: "https://wa.me/380683401208"
    },
    schedule: {
        workdays: "Пн–Пт: 08:30 – 20:30",
        saturday: "Сб: 09:00 – 19:00",
        sunday: "Нд: 10:00 – 17:00 (черговий майстер)",
        urgentService: "Терміновий виїзд майстра: протягом 45–60 хв"
    },
    warranty: {
        parts: "до 12 місяців",
        works: "до 12 місяців",
        diagnosticsPrice: "від 900 грн"
    }
};

// Експортуємо конфіг у глобальний об'єкт window
window.SITE_CONFIG = SITE_CONFIG;

// Автоматичне підставлення даних у сторінки
document.addEventListener("DOMContentLoaded", () => {
    // Оновлення телефонів
    document.querySelectorAll("[data-config-phone]").forEach(el => {
        const idx = parseInt(el.dataset.configPhone || "0", 10);
        const phone = SITE_CONFIG.phones[idx] || SITE_CONFIG.phones[0];
        if (el.tagName === "A") {
            el.href = `tel:${phone.raw}`;
        }
        if (!el.dataset.keepHtml) {
            el.textContent = phone.display;
        }
    });

    // Оновлення адрес
    document.querySelectorAll("[data-config-address]").forEach(el => {
        el.textContent = SITE_CONFIG.address.street;
    });
    document.querySelectorAll("[data-config-address-full]").forEach(el => {
        el.textContent = SITE_CONFIG.address.full;
    });

    // Оновлення email
    document.querySelectorAll("[data-config-email-office]").forEach(el => {
        if (el.tagName === "A") el.href = `mailto:${SITE_CONFIG.emails.office}`;
        el.textContent = SITE_CONFIG.emails.office;
    });
    document.querySelectorAll("[data-config-email-info]").forEach(el => {
        if (el.tagName === "A") el.href = `mailto:${SITE_CONFIG.emails.info}`;
        el.textContent = SITE_CONFIG.emails.info;
    });

    // Оновлення месенджерів
    document.querySelectorAll("[data-config-tg]").forEach(el => {
        el.href = SITE_CONFIG.messengers.telegram;
    });
    document.querySelectorAll("[data-config-viber]").forEach(el => {
        el.href = SITE_CONFIG.messengers.viber;
    });
});