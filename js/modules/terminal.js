/**
 * Module d'animation du terminal
 * Gère l'animation de typing du terminal
 */

const CODE_SEQUENCES = [
    { text: "Booting Fake OS...", class: "comment", delay: 0 },
    { text: "[INIT] Loading compiler...", class: "init", delay: 400 },
    { text: "[OK]   Compiler found: gcc 13.2.0", class: "ok", delay: 700 },
    { text: "", class: "", delay: 1000 },
    { text: "[WRITE] Creating file: main.c", class: "write", delay: 1200 },
    { text: "// Début du code C", class: "comment", delay: 1500 },
    { text: "int main() {", class: "white", delay: 1700 },
    { text: '    printf("Hello, Code en Clair!\\n");', class: "white", delay: 1900 },
    { text: '    printf("Compilation réussie !\\n");', class: "white", delay: 2100 },
    { text: "    return 0;", class: "white", delay: 2300 },
    { text: "}", class: "white", delay: 2500 },
    { text: "[OK]   File main.c saved.", class: "ok", delay: 2800 },
    { text: "", class: "", delay: 3100 },
    { text: "[BUILD] Running: gcc main.c -o main", class: "build", delay: 3300 },
    { text: "[LINK] Linking objects...", class: "link", delay: 3600 },
    { text: "[WARN]  Unused variable detected.", class: "warn", delay: 3900 },
    { text: "[OK]   Build finished: 0 error(s), 1 warning(s).", class: "ok", delay: 4200 },
    { text: "", class: "", delay: 4500 },
    { text: "[RUN]  ./main", class: "run", delay: 4700 },
    { text: "Hello, Code en Clair!", class: "white", delay: 5000 },
    { text: "Compilation réussie !", class: "white", delay: 5200 },
    { text: "", class: "", delay: 5400 },
    { text: "[DONE] Process finished successfully.", class: "done", delay: 5700 },
    { text: ">", class: "white", delay: 6000 }
];

let currentSequence = 0;
let loopCount = 0;

function typeNextLine(terminalOutput) {
    if (currentSequence >= CODE_SEQUENCES.length) {
        loopCount++;
        
        if (loopCount >= 1) {
            setTimeout(() => {
                terminalOutput.innerHTML = "";
                currentSequence = 0;
                loopCount = 0;
                typeNextLine(terminalOutput);
            }, 3000);
            return;
        }
        
        setTimeout(() => {
            terminalOutput.innerHTML = "";
            currentSequence = 0;
            typeNextLine(terminalOutput);
        }, 3000);
        return;
    }

    const line = CODE_SEQUENCES[currentSequence];
    const lineElement = document.createElement("div");
    lineElement.className = `terminal-line ${line.class}`;
    lineElement.textContent = line.text || " ";
    
    terminalOutput.appendChild(lineElement);
    currentSequence++;

    setTimeout(() => typeNextLine(terminalOutput), line.delay);
}

export function initTerminal() {
    const terminalOutput = document.getElementById("terminalOutput");
    if (!terminalOutput) return;
    
    currentSequence = 0;
    loopCount = 0;
    
    setTimeout(() => typeNextLine(terminalOutput), 1000);
}
