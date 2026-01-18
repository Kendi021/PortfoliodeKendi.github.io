// Menu mobile
document.querySelectorAll("#fermer-menu").forEach(function(element) {
    element.addEventListener("click", () => {
        document.querySelector(".container").classList.toggle("afficher-menu");
    });
});

// Debounce (pour optimiser l'animation au scroll)
function debounce(func, wait, immediate) {
    let timeout;
    return function(...args) {
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Scroll animation (recherche les éléments avec data-animation)
const cible = document.querySelectorAll("[data-animation]");
const classeAnimation = "anime";

function animationScroll() {
    // Calcul pour déclencher l'animation un peu avant le bas de l'écran
    const hautFenetre = window.pageYOffset + ((window.innerHeight * 3) / 4);
    cible.forEach(function(element) {
        if ((hautFenetre) > element.offsetTop) {
            element.classList.add(classeAnimation);
        } else {
            element.classList.remove(classeAnimation);
        }
    });
}

if (cible.length) {
    animationScroll(); // Exécuter une fois au chargement
    window.addEventListener('scroll', debounce(function() {
        animationScroll();
    }, 10));
}

// Logique de la Modale (Pop-up Projets)
function ouvrirModale(idModale) {
    const modale = document.getElementById(idModale);
    if(modale) modale.style.display = "block";
}

function fermerModale(idModale) {
    const modale = document.getElementById(idModale);
    if(modale) modale.style.display = "none";
}

// Fermer la modale si on clique en dehors
window.onclick = function(event) {
    if (event.target.className === 'modale') {
        event.target.style.display = "none";
    }
};