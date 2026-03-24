// SELCAL Emulator Logic

// SELCAL Tones (16 standard frequencies in Hz)
const SELCAL_TONES = {
    'A': 312.6,
    'B': 346.7,
    'C': 384.6,
    'D': 426.6,
    'E': 472.9,
    'F': 523.3,
    'G': 578.7,
    'H': 639.9,
    'J': 707.3,
    'K': 781.8,
    'L': 864.3,
    'M': 955.0,
    'P': 1055.2,
    'Q': 1165.0,
    'R': 1285.8,
    'S': 1419.2
};

// Application State
let selectedCode = [null, null, null, null]; // 4 positions
let currentPosition = 0;

// DOM Elements
const digitElements = [
    document.getElementById('digit1'),
    document.getElementById('digit2'),
    document.getElementById('digit3'),
    document.getElementById('digit4')
];

const toneElements = [
    document.getElementById('tone1'),
    document.getElementById('tone2'),
    document.getElementById('tone3'),
    document.getElementById('tone4')
];

const statusMessage = document.getElementById('statusMessage');
const testBtn = document.getElementById('testBtn');
const clearBtn = document.getElementById('clearBtn');

// Initialize
function init() {
    setupEventListeners();
    updateDisplay();
}

// Setup Event Listeners
function setupEventListeners() {
    // Keypad buttons
    document.querySelectorAll('.keypad-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const letter = btn.dataset.letter;
            selectLetter(letter);
        });
    });

    // Control buttons
    clearBtn.addEventListener('click', clearSelection);
    testBtn.addEventListener('click', testSelcal);
}

// Select a letter for current position
function selectLetter(letter) {
    if (currentPosition >= 4) {
        // Code already complete, start over
        clearSelection();
    }

    selectedCode[currentPosition] = letter;
    updateDisplay();

    // Move to next position or enable test button
    if (currentPosition < 3) {
        currentPosition++;
        updateStatus(`SELECT LETTER ${currentPosition + 1}`);
    } else {
        updateStatus('SELCAL CODE COMPLETE - PRESS TEST');
        testBtn.disabled = false;
    }
}

// Update all displays
function updateDisplay() {
    // Update digit display
    digitElements.forEach((digit, index) => {
        if (selectedCode[index]) {
            digit.textContent = selectedCode[index];
            digit.classList.remove('active');
            digit.classList.add('assigned');
        } else {
            digit.textContent = '-';
            digit.classList.add('active');
            digit.classList.remove('assigned');
        }
    });

    // Update tone display
    toneElements.forEach((tone, index) => {
        if (selectedCode[index]) {
            const freq = SELCAL_TONES[selectedCode[index]];
            tone.textContent = `${freq.toFixed(1)} Hz`;
            tone.style.color = '#00ff9d';
        } else {
            tone.textContent = '-- Hz';
            tone.style.color = '#8892b0';
        }
    });

    // Highlight current position
    digitElements.forEach((digit, index) => {
        if (index === currentPosition && !selectedCode[index]) {
            digit.classList.add('active');
            digit.style.animation = 'pulse 1s infinite';
        } else {
            digit.style.animation = 'none';
        }
    });

    // Update keypad button states
    document.querySelectorAll('.keypad-btn').forEach(btn => {
        const letter = btn.dataset.letter;
        if (selectedCode.includes(letter)) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}

// Clear current selection
function clearSelection() {
    selectedCode = [null, null, null, null];
    currentPosition = 0;
    testBtn.disabled = true;
    updateDisplay();
    updateStatus('SELECT SELCAL CODE');
}

// Test SELCAL code
async function testSelcal() {
    if (selectedCode.includes(null)) {
        updateStatus('COMPLETE SELCAL CODE FIRST');
        return;
    }

    updateStatus('TRANSMITTING SELCAL...');
    testBtn.disabled = true;

    // Get frequencies
    const frequencies = selectedCode.map(letter => SELCAL_TONES[letter]);

    // Play the tones (first pair, then second pair)
    try {
        // Play first pair of tones simultaneously
        await playSelcalTone(frequencies[0], frequencies[1], 1000);

        // Small pause between pairs
        await sleep(100);

        // Play second pair of tones simultaneously
        await playSelcalTone(frequencies[2], frequencies[3], 1000);

        updateStatus('SELCAL TRANSMISSION COMPLETE');
    } catch (error) {
        console.error('Error playing SELCAL:', error);
        updateStatus('AUDIO ERROR - CHECK BROWSER');
    }

    testBtn.disabled = false;
}

// Update status message
function updateStatus(message) {
    statusMessage.textContent = message;
    statusMessage.classList.add('loading');

    setTimeout(() => {
        statusMessage.classList.remove('loading');
    }, 500);
}

// Utility: Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration.scope);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
