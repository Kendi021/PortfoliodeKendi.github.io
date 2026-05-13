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
const commandHistory = [];
let historyIndex = -1;

function addToHistory(cmd) {
    if (cmd && cmd !== 'clear') {
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
    }
}

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
        addToHistory(input);
        processCommand(input);
        hiddenInput.value = "";
        visibleInput.textContent = "";
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            hiddenInput.value = commandHistory[historyIndex];
            visibleInput.textContent = hiddenInput.value;
        }
    } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            hiddenInput.value = commandHistory[historyIndex];
            visibleInput.textContent = hiddenInput.value;
        } else {
            historyIndex = commandHistory.length;
            hiddenInput.value = "";
            visibleInput.textContent = "";
        }
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
    if (typingTimer) clearTimeout(typingTimer);

    hiddenInput.value = "";
    visibleInput.textContent = "";

    if (window.innerWidth > 820) hiddenInput.focus();

    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            hiddenInput.value += text.charAt(i);
            visibleInput.textContent += text.charAt(i);
            i++;
            typingTimer = setTimeout(typeWriter, 50);
        } else {
            typingTimer = setTimeout(() => {
                processCommand(text);
                hiddenInput.value = "";
                visibleInput.textContent = "";
                terminalScreen.scrollTop = terminalScreen.scrollHeight;
            }, 300);
        }
    }

    typeWriter();
}

// ================================================
// TERMINAL DE DÉMO VPN
// ================================================

// ==========================================
// VPN Demo Terminal
// ==========================================
(function () {
    const STEPS = [
        { type: 'cmd', text: 'sudo bash auto-vpn.sh', delay: 600 },
        { type: 'comment', text: '# angristan/openvpn-install — déploiement auto', delay: 700 },
        { type: 'blank', text: '', delay: 200 },
        { type: 'info', text: '[•] Détection de l\'IP publique...', delay: 900 },
        { type: 'data', text: '    Adresse IP : 203.0.113.42', delay: 300 },
        { type: 'blank', text: '', delay: 150 },
        { type: 'info', text: '[•] Téléchargement de openvpn-install.sh...', delay: 1000 },
        { type: 'data', text: '    [████████████████████] 100%', delay: 800 },
        { type: 'ok', text: '[✓] Script téléchargé', delay: 350 },
        { type: 'blank', text: '', delay: 150 },
        { type: 'info', text: '[•] Protocole   : UDP — Port : 1194', delay: 500 },
        { type: 'info', text: '[•] DNS         : Système', delay: 350 },
        { type: 'info', text: '[•] Client      : client-admin', delay: 350 },
        { type: 'info', text: '[•] Chiffrement : AES-256-GCM / TLS 1.3', delay: 350 },
        { type: 'blank', text: '', delay: 150 },
        { type: 'info', text: '[•] Installation des paquets...', delay: 1300 },
        { type: 'data', text: '    openvpn ...................... ok', delay: 280 },
        { type: 'data', text: '    easy-rsa ..................... ok', delay: 280 },
        { type: 'data', text: '    iptables ..................... ok', delay: 280 },
        { type: 'blank', text: '', delay: 150 },
        { type: 'info', text: '[•] Génération de l\'infrastructure PKI...', delay: 1200 },
        { type: 'ok', text: '[✓] Autorité de certification créée (CA)', delay: 450 },
        { type: 'ok', text: '[✓] Certificat serveur signé', delay: 400 },
        { type: 'ok', text: '[✓] Clé Diffie-Hellman générée', delay: 400 },
        { type: 'blank', text: '', delay: 150 },
        { type: 'info', text: '[•] Activation du service systemd...', delay: 700 },
        { type: 'ok', text: '[✓] openvpn@server.service démarré', delay: 350 },
        { type: 'blank', text: '', delay: 150 },
        { type: 'info', text: '[•] Génération du profil client...', delay: 900 },
        { type: 'ok', text: '[✓] /root/client-admin.ovpn créé', delay: 500 },
        { type: 'blank', text: '', delay: 200 },
        { type: 'success', text: '╔══════════════════════════════════════╗', delay: 120 },
        { type: 'success', text: '║   DÉPLOIEMENT TERMINÉ AVEC SUCCÈS   ║', delay: 80 },
        { type: 'success', text: '╚══════════════════════════════════════╝', delay: 80 },
    ];

    let running = false;

    function runVpnDemo() {
        const output = document.getElementById('vpnDemoOutput');
        const playBtn = document.getElementById('vpnDemoPlay');
        if (!output || !playBtn || running) return;

        running = true;
        output.innerHTML = '';
        playBtn.disabled = true;
        playBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> En cours...';

        let cumDelay = 0;
        STEPS.forEach(function (step, index) {
            cumDelay += step.delay;
            setTimeout(function () {
                const line = document.createElement('span');
                line.className = 'vpn-line vpn-line--' + step.type;
                line.textContent = step.text;
                output.appendChild(line);
                output.scrollTop = output.scrollHeight;

                if (index === STEPS.length - 1) {
                    running = false;
                    playBtn.disabled = false;
                    playBtn.innerHTML = '<i class="fas fa-redo"></i> Rejouer';
                }
            }, cumDelay);
        });
    }

    function initVpnTabs() {
        document.querySelectorAll('.vpn-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                const target = tab.dataset.pane;
                document.querySelectorAll('.vpn-tab').forEach(function (t) {
                    t.classList.toggle('vpn-tab--active', t === tab);
                    t.setAttribute('aria-selected', String(t === tab));
                });
                document.querySelectorAll('.vpn-pane').forEach(function (pane) {
                    pane.classList.toggle('vpn-pane--hidden', pane.id !== target);
                });
            });
        });
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('#vpnDemoPlay')) {
            runVpnDemo();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVpnTabs);
    } else {
        initVpnTabs();
    }
}());