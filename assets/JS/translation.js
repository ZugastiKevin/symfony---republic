// Traductions des textes
window.translations = {
  fr: {
    // gestion traduction de la nav 
    nav_home: 'Accueil',
    nav_minigames: 'Je teste mes compétences',
    nav_disconnect: 'Se déconnecter',
    nav_connect: 'Se connecter',
    nav_register: 'S\'inscrire',

    // section traduction des minijeux 
    minigames_1_title: 'Relie le mot à sa définition',
    minigames_1_subtitle: 'Fais glisser chaque mot sur la bonne définition !',
    minigames_1_desc: 'Fais correspondre les mots-clés de la République française à leur définition.',
    minigames_word_liberte: "Liberté",
    minigames_word_egalite: "Égalité",
    minigames_word_fraternite: "Fraternité",
    minigames_word_laicite: "Laïcité",
    minigames_word_citoyen: "Citoyen",
    minigames_word_republique: "République",
    minigames_word_democratie: "Démocratie",
    minigames_word_droit: "Droit",
    minigames_word_devise: "Devise",
    minigames_word_constitution: "Constitution",

    minigames_def_liberte: "Droit de faire ce que l’on veut dans le respect de la loi et d’autrui.",
    minigames_def_egalite: "Principe selon lequel tous les citoyens ont les mêmes droits et devoirs.",
    minigames_def_fraternite: "Solidarité et entraide entre les citoyens.",
    minigames_def_laicite: "Principe de séparation des religions et de l’État.",
    minigames_def_citoyen: "Personne qui appartient à un pays et qui a des droits et des devoirs.",
    minigames_def_republique: "Régime politique où le pouvoir appartient au peuple et où les dirigeants sont élus.",
    minigames_def_democratie: "Système où le peuple participe aux décisions par le vote.",
    minigames_def_droit: "Règle qui fixe ce que l’on peut faire ou ne pas faire.",
    minigames_def_devise: "Phrase courte qui exprime les valeurs d’un pays.",
    minigames_def_constitution: "Texte qui organise le fonctionnement de l’État et fixe les droits des citoyens.",
    minigames_1_restart: "Recommencer le jeu",
    minigames_1_label: "Mots :",
    minigames_1_def_label: "Définitions :",

    // Traductions pour le jeu vrai/faux
    vf_q1: "La devise de la République française est Liberté, Égalité, Fraternité.",
    vf_q2: "La laïcité interdit toute religion en France.",
    vf_q3: "Tous les citoyens sont égaux devant la loi.",
    vf_q4: "On peut voter en France à partir de 16 ans.",
    vf_good: "Bonne réponse !",
    vf_bad: "Mauvaise réponse.",
    vf_score: "Score",
    minigames_2_true: "vrai",
    minigames_2_false: "faux",
    minigames_2_title: "Vrai ou Faux",
    minigames_2_next: "Question suivante",

  },
  en: {
    nav_home: 'Home',
    nav_minigames: 'Test my skills',
    nav_disconnect: 'Disconnect',
    nav_connect: 'Connect',
    nav_register: 'Register',

    minigames_1_title: 'Match the word to its definition',
    minigames_1_subtitle: 'Drag each word to the correct definition!',
    minigames_1_desc: 'Match the key words of the French Republic to their definition.',
    minigames_word_liberte: "Liberty",
    minigames_word_egalite: "Equality",
    minigames_word_fraternite: "Fraternity",
    minigames_word_laicite: "Secularism",
    minigames_word_citoyen: "Citizen",
    minigames_word_republique: "Republic",
    minigames_word_democratie: "Democracy",
    minigames_word_droit: "Law",
    minigames_word_devise: "Motto",
    minigames_word_constitution: "Constitution",

    minigames_def_liberte: "Right to do what you want while respecting the law and others.",
    minigames_def_egalite: "Principle that all citizens have the same rights and duties.",
    minigames_def_fraternite: "Solidarity and mutual aid between citizens.",
    minigames_def_laicite: "Principle of separation between religions and the State.",
    minigames_def_citoyen: "Person who belongs to a country and has rights and duties.",
    minigames_def_republique: "Political system where power belongs to the people and leaders are elected.",
    minigames_def_democratie: "System where people participate in decisions by voting.",
    minigames_def_droit: "Rule that defines what one can or cannot do.",
    minigames_def_devise: "Short phrase expressing a country's values.",
    minigames_def_constitution: "Text that organizes the functioning of the State and defines citizens' rights.",
    minigames_1_restart: "Restart the game",
    minigames_1_label: "Words :",
    minigames_1_def_label: "Definitions :",

    // Translations for true/false game
    vf_q1: "The motto of the French Republic is Liberty, Equality, Fraternity.",
    vf_q2: "Secularism forbids any religion in France.",
    vf_q3: "All citizens are equal before the law.",
    vf_q4: "You can vote in France from the age of 16.",
    vf_good: "Good answer!",
    vf_bad: "Wrong answer.",
    vf_score: "Score",
    minigames_2_true: "True",
    minigames_2_false: "Talse",
    minigames_2_title: "True or False",
    minigames_2_next: "Next question",
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
      el.textContent = window.translations[lang][key] || `[${key}]`;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = window.translations[lang][key] || `[${key}]`;
    });
    toggle.textContent = {
      fr: 'Français ⌄',
      en: 'English ⌄',
    }[lang];
    switcher.classList.remove('open');
    localStorage.setItem('lang', lang);

    if (typeof window.renderGame === 'function') window.renderGame();
    if (typeof window.showVFQuestion === 'function') window.showVFQuestion();
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

  // ferme le menu si on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!switcher.contains(e.target)) {
      switcher.classList.remove('open');
    }
  });

  // applique la langue sauvegardée ou fr par défaut
  const savedLang = localStorage.getItem('lang') || 'fr';
  applyTranslation(savedLang);
});