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

// Système de fichiers virtuel (Mise à jour pour Active Directory)
const fileSystem = {
    // Mise à jour de la commande LS avec linux.txt
    "ls": `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top:10px;">
        <span style="color: #ffab40; font-weight:bold;">html.md</span>
        <span style="color: #40c4ff; font-weight:bold;">css.style</span>
        <span style="color: #ffd740; font-weight:bold;">script.js</span>
        <span style="color: #69f0ae; font-weight:bold;">main.py</span>
        <span style="color: #e06c75; font-weight:bold;">linux.txt</span>
        <span style="color: #29b6f6; font-weight:bold;">deploy.ps1</span>
    </div>`,

    "cat html.md": `
    <span class="output-title title-html">HTML5 & CSS3</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[==================  ] 70%</span>
        
        <span class="label">Focus:</span>
        <span class="value">Structure sémantique, Responsive Design</span>
        
        <span class="label">Projets:</span>
        <span class="value">Sites vitrines, Intégration de maquettes</span>
    </div>`,

    "node script.js": `
    <span class="output-title title-js">JavaScript (Bases)</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[==========          ] 45%</span>
        
        <span class="label">Notions:</span>
        <span class="value">Manipulation du DOM, Événements, Fonctions</span>
        
        <span class="label">Usage:</span>
        <span class="value">Validation de formulaires, Menus interactifs</span>
    </div>`,

    "python main.py": `
    <span class="output-title title-py">Python Scripting</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[==========          ] 45%</span>
        <span class="label">Modules:</span>
        <span class="value">os, sys, shutil (Gestion de fichiers)</span>
        <span class="label">Usage:</span>
        <span class="value">Automatisation de tâches, Scripts de sauvegarde</span>
    </div>`,

    // Ajout de la section Linux
    "cat linux.txt": `
    <span class="output-title" style="color: #e06c75; border-bottom: 1px dashed #e06c75; display:inline-block; margin-bottom:10px;">Administration Linux</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[===============     ] 75%</span>
        <span class="label">Distros:</span>
        <span class="value">Debian, Ubuntu, CentOS, Rocky Linux</span>
        <span class="label">Compétences:</span>
        <span class="value">Bash scripting, Permissions, SSH, Systemd</span>
        <span class="label">Projets:</span>
        <span class="value">Serveur VPN automatisé, Gestion de services</span>
    </div>`,

    "active directory": `
    <span class="output-title" style="color: #29b6f6; border-bottom: 1px dashed #29b6f6; display:inline-block; margin-bottom:10px;">Active Directory & Windows Server</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[===============     ] 60%</span>
        
        <span class="label">Services:</span>
        <span class="value">AD DS, DNS, DHCP, GPO</span>
        
        <span class="label">Outils:</span>
        <span class="value">Console RSAT, PowerShell basique</span>
        
        <span class="label">Tâches:</span>
        <span class="value">Gestion utilisateurs/groupes, Droits NTFS</span>
    </div>`
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
        response = "Commandes: ls, cat [fichier], node [fichier], python [fichier], linux, active directory, clear";
    } else if (cleanCmd === "clear") {
        terminalOutput.innerHTML = "";
        return;
    } else if (fileSystem[cleanCmd]) {
        // Correspondance exacte (ex: "node script.js")
        response = fileSystem[cleanCmd];
    } else {
        // Recherche approximative (ex: juste "ls" ou juste "python")
        // Si l'utilisateur tape juste "python", on cherche une clé qui contient python
        const partialKey = Object.keys(fileSystem).find(key => key.includes(cleanCmd) || key.startsWith(cleanCmd));
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