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

/* =========================================
   LOGIQUE DU TERMINAL INTERACTIF (MISE A JOUR)
   ========================================= */

// Système de fichiers virtuel (Contenu riche HTML)
const fileSystem = {
    "ls": `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top:10px;">
        <span style="color: #ff6d00">html.md</span>
        <span style="color: #29b6f6">css.style</span>
        <span style="color: #ffca28">script.js</span>
        <span style="color: #4fc3f7">main.py</span>
        <span style="color: #f06292">git.log</span>
    </div>`,

    "cat html.md": `
    <span class="output-title title-html">HTML5 Expertise</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[==================  ] 90%</span>
        
        <span class="label">Focus:</span>
        <span class="value">Accessibilité (a11y), SEO sémantique, DOM</span>
        
        <span class="label">Projets:</span>
        <span class="value">Landing pages, Dashboards structurés</span>
    </div>`,

    "node script.js": `
    <span class="output-title title-js">JavaScript (ES6+)</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[=================   ] 88%</span>
        
        <span class="label">Stack:</span>
        <span class="value">Vanilla JS, DOM Manipulation, Fetch API</span>
        
        <span class="label">Logique:</span>
        <span class="value">Async/Await, Event Loop, Clean Code</span>
    </div>`,

    "python main.py": `
    <span class="output-title title-py">Python Automation</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[===============     ] 75%</span>
        
        <span class="label">Libs:</span>
        <span class="value">Pandas, Requests, Selenium, Flask</span>
        
        <span class="label">Usage:</span>
        <span class="value">Scripting, Data processing, Bots</span>
    </div>`,

    "git log": `
    <span style="color: #f06292;">commit 8f3a1b (HEAD -> main)</span><br>
    <span style="color: #808080;">Author:</span> Kendi Cadet<br>
    <span style="color: #808080;">Date:</span>   Mon Jan 01 2025<br><br>
    &nbsp;&nbsp;&nbsp;&nbsp;feat: Gestion de versions & CI/CD<br>
    &nbsp;&nbsp;&nbsp;&nbsp;- Branches (merge, rebase)<br>
    &nbsp;&nbsp;&nbsp;&nbsp;- GitHub Actions Basics
    `
};

const terminalOutput = document.getElementById("terminal-output");
const hiddenInput = document.getElementById("hidden-input");
const visibleInput = document.getElementById("visible-input");
const terminalScreen = document.querySelector(".terminal-screen");

function focusTerminal() {
    hiddenInput.focus();
}

hiddenInput.addEventListener("input", () => {
    visibleInput.textContent = hiddenInput.value;
});

hiddenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const input = hiddenInput.value.trim();
        processCommand(input);
        hiddenInput.value = "";
        visibleInput.textContent = "";
    }
});

function processCommand(cmd) {
    // 1. Afficher la commande tapée avec le nouveau prompt
    const historyLine = document.createElement("div");
    historyLine.className = "line";
    historyLine.innerHTML = `
        <span class="prompt-arrow">➜</span> <span class="prompt-path">~</span>
        <span class="cmd">${cmd}</span>
    `;
    terminalOutput.appendChild(historyLine);

    // 2. Traitement
    // On nettoie la commande (minuscule + trim)
    const cleanCmd = cmd.toLowerCase().trim();
    let response = "";

    // Logique simplifiée pour matcher les clés exactes ou partielles
    if (cleanCmd === "help") {
        response = "Commandes: ls, cat [fichier], node [fichier], python [fichier], git log, clear";
    } else if (cleanCmd === "clear") {
        terminalOutput.innerHTML = "";
        return;
    } else if (fileSystem[cleanCmd]) {
        // Correspondance exacte (ex: "node script.js")
        response = fileSystem[cleanCmd];
    } else {
        // Recherche approximative (ex: juste "ls" ou juste "python")
        // Si l'utilisateur tape juste "python", on cherche une clé qui contient python
        const partialKey = Object.keys(fileSystem).find(key => key.startsWith(cleanCmd));
        if (partialKey) {
            response = fileSystem[partialKey];
        } else {
            response = `<span style="color:#e06c75">Command not found: ${cmd}</span>`;
        }
    }

    // 3. Afficher la réponse
    if (response) {
        const responseLine = document.createElement("div");
        responseLine.className = "line";
        responseLine.innerHTML = response;
        terminalOutput.appendChild(responseLine);
    }

    // 4. Scroll en bas
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function runCommand(text) {
    const inputField = document.getElementById("hidden-input");
    const displayField = document.getElementById("visible-input");
    
    // On vide l'input avant de commencer
    inputField.value = "";
    displayField.textContent = "";
    inputField.focus();

    let i = 0;
    const speed = 50; // Vitesse de frappe en ms (plus petit = plus vite)

    function typeWriter() {
        if (i < text.length) {
            // On ajoute une lettre
            let char = text.charAt(i);
            inputField.value += char;
            displayField.textContent += char;
            i++;
            
            // On continue d'écrire avec un petit délai pour l'effet réaliste
            setTimeout(typeWriter, speed);
        } else {
            // Une fois fini, on valide (Entrée) après une petite pause
            setTimeout(() => {
                processCommand(text); // Exécute directement la commande
                inputField.value = ""; // Nettoie le champ réel
                displayField.textContent = ""; // Nettoie l'affichage
            }, 300);
        }
    }

    // Lancer l'animation
    typeWriter();
}

// Init
if (window.innerWidth > 800) focusTerminal();