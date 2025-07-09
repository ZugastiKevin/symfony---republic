import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.scss'; // Import des styles principaux de l'application
import './JS/translation.js'; // gestion de la traduction
import './JS/main.js'; // fichier JS principal de l'application
import './JS/minigames.js'; // gestion des minijeux
import './JS/flag.js'; // gestion des animations sur le drapeau

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');
