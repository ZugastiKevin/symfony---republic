document.addEventListener('DOMContentLoaded', () => {
    const flag = document.getElementById('french-flag');
    
    // si le flag est pas chargé on arrête l'exécution
    if (!flag) {
        console.warn('Erreur : Le drapeau n\'a pas été trouvé !');
        return;
    }

    let windStrength = 0.6;
    let windDirection = 1;
    let windPhase = 0;
    
    // début de l'animation du drapeau
    function simulateWind() {
        const targetWindStrength = 0.3 + Math.random() * 0.8;
        windStrength += (targetWindStrength - windStrength) * 0.1; 
        
        // possibilité pour la direction de changer mais assez rarement
        if (Math.random() < 0.05) { 
            windDirection *= -0.9; // réalise un changement doux
        }
        
        windPhase += 0.01; 
        
        const stripes = flag.querySelectorAll('.flag-stripe');
        stripes.forEach((stripe, index) => {
            const delay = index * 0.2;
            const personalWind = windStrength * (0.7 + Math.sin(windPhase + index) * 0.3);
            
            stripe.style.animationDuration = `${4 + personalWind * 2}s`;
            stripe.style.animationDelay = `${delay}s`;
        });
        
        // movement de base du flag
        const gentleRotation = Math.sin(windPhase) * 1.5 * windStrength;
        const gentleTilt = Math.cos(windPhase * 0.7) * 0.8 * windStrength;
        
        flag.style.transform = `
            rotateY(${gentleRotation}deg) 
            rotateZ(${gentleTilt}deg)
            translateX(${Math.sin(windPhase * 0.5) * 2}px)
        `;
    }
    
    // simulation de vent douce et lente
    setInterval(simulateWind, 150);
    simulateWind();

    // animation pour le click
    flag.addEventListener('click', () => {
        flag.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        flag.style.transform = 'scale(1.15) rotateY(8deg) rotateZ(3deg)';
        flag.style.filter = 'brightness(1.15) saturate(1.2)';
        
        setTimeout(() => {
            flag.style.transform = 'scale(1.05) rotateY(-3deg) rotateZ(-1deg)';
        }, 400);
        
        setTimeout(() => {
            flag.style.transform = 'scale(1) rotateY(0deg) rotateZ(0deg)';
            flag.style.filter = '';
        }, 800);

        setTimeout(() => {
            flag.style.transition = '';
            simulateWind();
        }, 1200);
    });

    // animation au scroll avec gestion de la taille
    let ticking = false;
    
    function updateFlagOnScroll() {
        const scrollY = window.scrollY;
        const maxRotation = 6;
        const rotateX = Math.min(scrollY / 30, maxRotation); 
        const rotateY = Math.sin(scrollY * 0.005) * 2;
        
        
        const maxScale = 1.1; // size max de l'augmentation quand on scroll
        const scale = Math.min(0.6 + (scrollY / 2000), maxScale); // augmentation progressive
        
        flag.style.transform = `
            perspective(1200px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            translateZ(${scrollY * 0.05}px)
            scale(${scale})
        `;
        ticking = false;
    }
    
    function requestTickOnScroll() {
        if (!ticking) {
            requestAnimationFrame(updateFlagOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTickOnScroll, { passive: true });

    // augmentation de la taille du drapeau pour aider a la simulation du vent.
    function naturalBreathing() {
        const time = Date.now() * 0.0008; 
        const breathScale = 1 + Math.sin(time) * 0.02; 
        const breathRotate = Math.cos(time * 1.3) * 0.5;
        
        if (!flag.style.transition) {
            flag.style.transform = `
                scale(${breathScale}) 
                rotateY(${breathRotate}deg)
                translateY(${Math.sin(time * 0.7) * 1}px)
            `;
        }
        
        requestAnimationFrame(naturalBreathing);
    }
    
    naturalBreathing(); // chargement de l'animation

    console.log('flag loaded');
});