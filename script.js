// Menu mobile
document.querySelectorAll("#Close-menu").forEach(function(element) {
    element.addEventListener("click", () => {
        document.querySelector(".container").classList.toggle("show-menu");
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

// Scroll animation
const target = document.querySelectorAll("[data-anime]");
const animationClass = "animate";

function animeScroll() {
    // Calcul pour déclencher l'animation un peu avant le bas de l'écran
    const windowTop = window.pageYOffset + ((window.innerHeight * 3) / 4);
    target.forEach(function(element) {
        if ((windowTop) > element.offsetTop) {
            element.classList.add(animationClass);
        } else {
            element.classList.remove(animationClass);
        }
    });
}

if (target.length) {
    animeScroll(); // Exécuter une fois au chargement
    window.addEventListener('scroll', debounce(function() {
        animeScroll();
    }, 10));
}

// Modal Logic (Pop-up Projets)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = "block";
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) modal.style.display = "none";
}

// Fermer la modale si on clique en dehors
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
    }
};