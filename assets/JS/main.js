// Fichier JS principal de l'application pour toutes les petites fonctionalités
document.addEventListener('DOMContentLoaded', () => {
    
    // Détecteur de scroll simple
    window.addEventListener('scroll', () => {
        const element = document.getElementById('header'); // Changé de 'navbar' à 'header'
        
        if (window.scrollY > 10) {
            element.classList.add('scrolled');
        } else {
            element.classList.remove('scrolled');
        }
    });

});

// Desactivation du scroll sur les page connexion et inscription 

document.addEventListener('DOMContentLoaded', () => {
    
    // detection du scroll
    window.addEventListener('scroll', () => {
        const element = document.getElementById('header');
        
        if (window.scrollY > 10) {
            element.classList.add('scrolled');
        } else {
            element.classList.remove('scrolled');
        }
    });

    // supression du scroll sur les pages de connexion/inscription
    const isLoginPage = document.querySelector('.login-page');
    const isRegisterPage = document.querySelector('.register-page');
    
    if (isLoginPage || isRegisterPage) {
        // desactive le scroll
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        
        // quand on change de page active le scroll a nouveau
        window.addEventListener('beforeunload', () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
        });
    }

});