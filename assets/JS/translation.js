// Traductions des textes
const translations = {
  fr: {
    nav_home: 'Accueil',
    nav_minigames: 'Je teste mes compétences',
    nav_disconnect: 'Se déconnecter',
    nav_connect: 'Se connecter',
    nav_register: 'S\'inscrire',
    // Ajoute d'autres clés ici
  },
  en: {
    nav_home: 'Home',
    nav_minigames: 'Test my skills',
    nav_disconnect: 'Disconnect',
    nav_connect: 'Connect',
    nav_register: 'Register',
    // Ajoute d'autres clés ici
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const switcher = document.querySelector('.lang-switcher');
  if (!switcher) return;
  const toggle = switcher.querySelector('.lang-toggle');
  const options = switcher.querySelectorAll('.lang-options li');

  function applyTranslation(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[lang][key] || `[${key}]`;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = translations[lang][key] || `[${key}]`;
    });
    toggle.textContent = {
      fr: 'Français ⌄',
      en: 'English ⌄',
    }[lang];
    switcher.classList.remove('open');
    localStorage.setItem('lang', lang);
  }

  // Ouvre/ferme le menu au clic sur le bouton
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    switcher.classList.toggle('open');
  });

  // Sélection d'une langue
  options.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = opt.getAttribute('data-lang');
      applyTranslation(lang);
    });
  });

  // Ferme le menu si on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!switcher.contains(e.target)) {
      switcher.classList.remove('open');
    }
  });

  // Applique la langue sauvegardée ou fr par défaut
  const savedLang = localStorage.getItem('lang') || 'fr';
  applyTranslation(savedLang);
});