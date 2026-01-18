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
   LOGIQUE DU TERMINAL INTERACTIF
   ========================================= */

// Système de fichiers virtuel (Le contenu de vos compétences)
const fileSystem = {
    "skills/html.txt": `
<span class="comment"># Compétences HTML5 & Sémantique</span>
> Structure : <span class="green">Sémantique stricte (header, main, aside...)</span>
> Accessibilité : <span class="green">Normes WCAG 2.1 & ARIA</span>
> SEO : <span class="green">Optimisation des balises méta & hiérarchie</span>
    `,
    "skills/css.css": `
<span class="comment">/* Styles & Design Responsive */</span>
.competences {
    display: <span class="blue">flex</span>;
    architecture: <span class="blue">BEM Methodology</span>;
    frameworks: [<span class="str">"Tailwind"</span>, <span class="str">"Bootstrap"</span>];
    animation: <span class="blue">Keyframes & Transitions complexes</span>;
}
    `,
    "skills/javascript.js": `
<span class="comment">// Dynamisme & Logique Front-end</span>
const <span class="yellow">kendiSkills</span> = {
    es6: <span class="blue">true</span>,
    domManipulation: <span class="str">"Expert"</span>,
    async: <span class="blue">async</span> () => { <span class="purple">await</span> fetch('API'); },
    frameworks: [<span class="str">"React"</span>, <span class="str">"Vue.js"</span>]
};
    `,
    "skills/script.py": `
<span class="comment"># Automation & Back-end</span>
def <span class="blue">automate_tasks</span>():
    libs = [<span class="str">"Pandas"</span>, <span class="str">"Requests"</span>, <span class="str">"Selenium"</span>]
    return <span class="str">"Scripts efficaces & Maintenance"</span>
    `,
    "skills/active_directory.config": `
<span class="comment"># Administration Système Windows</span>
[User_Management]
Creation = <span class="green">Automated (PowerShell)</span>
GPO = <span class="green">Securité & Deploiement</span>
DHCP_DNS = <span class="green">Configuration Avancée</span>
    `,
    "skills/git.log": `
<span class="red">commit 8f3a1b (HEAD -> main)</span>
Author: Kendi Cadet
Date:   Mon Jan 01 2024

    feat: Gestion de versions & CI/CD
    - Maîtrise des branches (merge, rebase)
    - Collaboration via GitHub/GitLab
    - Résolution de conflits
    `
};

// Variables DOM
const terminalOutput = document.getElementById("terminal-output");
const hiddenInput = document.getElementById("hidden-input");
const visibleInput = document.getElementById("visible-input");
const terminalScreen = document.querySelector(".terminal-screen");

// Focus sur l'input caché quand on clique sur le terminal
function focusTerminal() {
    hiddenInput.focus();
}

// Mise à jour de l'affichage lors de la frappe
hiddenInput.addEventListener("input", (e) => {
    visibleInput.textContent = hiddenInput.value;
});

// Gestion de la touche Entrée
hiddenInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const command = hiddenInput.value.trim();
        processCommand(command);
        hiddenInput.value = ""; // Reset input
        visibleInput.textContent = "";
    }
});

// Traitement des commandes
function processCommand(cmd) {
    // 1. Créer la ligne de l'historique (ce que l'utilisateur vient de taper)
    const historyLine = document.createElement("div");
    historyLine.className = "line";
    historyLine.innerHTML = `<span class="prompt">user@portfolio:~/skills$</span> <span class="cmd">${cmd}</span>`;
    terminalOutput.appendChild(historyLine);

    // 2. Traiter la commande
    const args = cmd.split(" ");
    const command = args[0].toLowerCase();
    const argument = args[1];

    let response = "";

    switch (command) {
        case "help":
            response = `Commandes disponibles :
- <span class="yellow">ls</span> : Lister les fichiers de compétences
- <span class="yellow">cat [fichier]</span> : Afficher le contenu (ex: cat skills/html.txt)
- <span class="yellow">clear</span> : Effacer l'écran
- <span class="yellow">whoami</span> : Qui suis-je ?`;
            break;
            
        case "ls":
            // Génération de la grille de fichiers avec couleurs
            response = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
                <span class="txt-col">html.txt</span>
                <span class="css-col">css.css</span>
                <span class="js-col">javascript.js</span>
                <span class="py-col">script.py</span>
                <span class="conf-col">active_directory.config</span>
                <span class="log-col">git.log</span>
            </div>`;
            break;

        case "cat":
            if (!argument) {
                response = "Usage: cat [nom_du_fichier]";
            } else {
                // Recherche tolérante (ex: "cat html" trouve "skills/html.txt")
                const fileKey = Object.keys(fileSystem).find(key => key.includes(argument));
                if (fileKey) {
                    response = fileSystem[fileKey];
                } else {
                    response = `Erreur : Le fichier '${argument}' n'existe pas. Tapez 'ls' pour voir la liste.`;
                }
            }
            break;

        case "clear":
            terminalOutput.innerHTML = "";
            return; // Pas besoin d'afficher une réponse vide
            
        case "whoami":
            response = "Kendi Cadet - Technicien Support IT & Développeur en devenir.";
            break;

        case "":
            break; // Touche entrée vide

        default:
            response = `Commande '${command}' introuvable. Tapez 'help'.`;
    }

    // 3. Afficher la réponse (si elle existe)
    if (response) {
        const responseLine = document.createElement("div");
        responseLine.className = "line response";
        responseLine.innerHTML = response;
        terminalOutput.appendChild(responseLine);
    }

    // 4. Scroll automatique vers le bas
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

// Fonction pour exécuter une commande depuis les boutons (Sidebar)
function runCommand(text) {
    // Effet visuel : on écrit la commande dans l'input, puis on valide
    hiddenInput.value = text;
    visibleInput.textContent = text;
    hiddenInput.focus();
    
    // Petit délai pour simuler la frappe humaine avant validation
    setTimeout(() => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        hiddenInput.dispatchEvent(event);
    }, 200);
}

// Initialisation : Focus au chargement (si sur desktop)
if (window.innerWidth > 800) {
    focusTerminal();
}