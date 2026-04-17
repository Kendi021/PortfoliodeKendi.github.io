const preloader = document.getElementById("preloader");

window.addEventListener("load", () => {
    document.body.classList.remove("preloading");
    if (!preloader) return;

    const minimumDisplay = 900;
    const elapsed = performance.now();
    const remainingTime = Math.max(0, minimumDisplay - elapsed);

    setTimeout(() => {
        preloader.classList.add("preloader--hidden");
        preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });
    }, remainingTime);
});

const menuToggle = document.getElementById("fermer-menu");
const container = document.querySelector(".container");
const menuLinks = document.querySelectorAll(".lien-menu");

function setMenuState(isOpen) {
    if (!menuToggle || !container) return;

    container.classList.toggle("afficher-menu", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
}

if (menuToggle && container) {
    menuToggle.addEventListener("click", () => {
        const isOpen = !container.classList.contains("afficher-menu");
        setMenuState(isOpen);
    });

    menuToggle.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        const isOpen = !container.classList.contains("afficher-menu");
        setMenuState(isOpen);
    });
}

menuLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
});

function debounce(func, wait, immediate) {
    let timeout;
    return function (...args) {
        const context = this;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

const animatedElements = document.querySelectorAll("[data-animation]");
const animationClass = "anime";

function animationScroll() {
    const windowTrigger = window.pageYOffset + (window.innerHeight * 3) / 4;
    animatedElements.forEach((element) => {
        element.classList.toggle(animationClass, windowTrigger > element.offsetTop);
    });
}

if (animatedElements.length) {
    animationScroll();
    window.addEventListener("scroll", debounce(animationScroll, 10));
}

function ouvrirModale(idModale) {
    const modale = document.getElementById(idModale);
    if (modale) modale.style.display = "block";
}

function fermerModale(idModale) {
    const modale = document.getElementById(idModale);
    if (modale) modale.style.display = "none";
}

window.addEventListener("click", (event) => {
    if (event.target.className === "modale") {
        event.target.style.display = "none";
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenuState(false);
        document.querySelectorAll(".modale").forEach((modal) => {
            modal.style.display = "none";
        });
    }
});

const fileSystem = {
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
        <span class="value progress-bar">[==============-------] 70%</span>
        <span class="label">Focus:</span>
        <span class="value">Structure sémantique, Responsive Design</span>
        <span class="label">Projets:</span>
        <span class="value">Sites vitrines, Intégration de maquettes</span>
    </div>`,

    "node script.js": `
    <span class="output-title title-js">JavaScript (Bases)</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[==========----------] 45%</span>
        <span class="label">Notions:</span>
        <span class="value">Manipulation du DOM, Événements, Fonctions</span>
        <span class="label">Usage:</span>
        <span class="value">Validation de formulaires, Menus interactifs</span>
    </div>`,

    "python main.py": `
    <span class="output-title title-py">Python Scripting</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[==========----------] 45%</span>
        <span class="label">Modules:</span>
        <span class="value">os, sys, shutil (Gestion de fichiers)</span>
        <span class="label">Usage:</span>
        <span class="value">Automatisation de tâches, Scripts de sauvegarde</span>
    </div>`,

    "cat linux.txt": `
    <span class="output-title" style="color: #e06c75; border-bottom: 1px dashed #e06c75; display:inline-block; margin-bottom:10px;">Administration Linux</span>
    <div class="info-grid">
        <span class="label">Niveau:</span>
        <span class="value progress-bar">[==============-------] 75%</span>
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
        <span class="value progress-bar">[==============-------] 60%</span>
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

let typingTimer;

function focusTerminal() {
    if (window.innerWidth > 820) {
        hiddenInput.focus();
    }
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
    const historyLine = document.createElement("div");
    historyLine.className = "line";
    historyLine.innerHTML = `
        <span class="prompt-arrow">➜</span> <span class="prompt-path">~</span>
        <span class="cmd">${cmd}</span>
    `;
    terminalOutput.appendChild(historyLine);

    const cleanCmd = cmd.toLowerCase().trim();
    let response = "";

    if (cleanCmd === "help") {
        response = "Commandes: ls, cat [fichier], node [fichier], python [fichier], linux, active directory, clear";
    } else if (cleanCmd === "clear") {
        terminalOutput.innerHTML = "";
        return;
    } else if (fileSystem[cleanCmd]) {
        response = fileSystem[cleanCmd];
    } else {
        const partialKey = Object.keys(fileSystem).find((key) => key.includes(cleanCmd) || key.startsWith(cleanCmd));
        if (partialKey) {
            response = fileSystem[partialKey];
        } else {
            response = `<span style="color:#e06c75">Command not found: ${cmd}</span>`;
        }
    }

    if (response) {
        const responseLine = document.createElement("div");
        responseLine.className = "line";
        responseLine.innerHTML = response;
        terminalOutput.appendChild(responseLine);
    }

    terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function runCommand(text) {
    const inputField = hiddenInput;
    const displayField = visibleInput;

    if (typingTimer) clearTimeout(typingTimer);

    inputField.value = "";
    displayField.textContent = "";

    if (window.innerWidth > 820) {
        inputField.focus();
    }

    let i = 0;
    const speed = 50;

    function typeWriter() {
        if (i < text.length) {
            const char = text.charAt(i);
            inputField.value += char;
            displayField.textContent += char;
            i++;
            typingTimer = setTimeout(typeWriter, speed);
        } else {
            typingTimer = setTimeout(() => {
                processCommand(text);
                inputField.value = "";
                displayField.textContent = "";
                terminalScreen.scrollTop = terminalScreen.scrollHeight;
            }, 300);
        }
    }

    typeWriter();
}

document.addEventListener("click", function (e) {
    if (e.target.onclick && e.target.onclick.toString().includes("runCommand")) {
        setTimeout(() => {
            terminalScreen.scrollTop = terminalScreen.scrollHeight;
        }, 400);
    }
}, true);

if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute("data-src");
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
    });
}