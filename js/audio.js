// SELCAL Audio Generator using Web Audio API

let audioContext = null;
let masterGainNode = null;
let currentVolume = 0.5; // Default 50%

// Initialize Audio Context
function initAudioContext() {
    if (!audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();

        // Create master gain node for volume control
        masterGainNode = audioContext.createGain();
        masterGainNode.gain.value = currentVolume;
        masterGainNode.connect(audioContext.destination);
    }

    // Resume context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    return audioContext;
}

// Play SELCAL tone (two frequencies simultaneously)
// SELCAL transmits pairs of tones at the same time
function playSelcalTone(freq1, freq2, duration) {
    return new Promise((resolve, reject) => {
        try {
            const ctx = initAudioContext();

            const now = ctx.currentTime;

            // Create first oscillator
            const osc1 = ctx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(freq1, now);

            // Create second oscillator
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(freq2, now);

            // Create gain nodes for each oscillator
            const gain1 = ctx.createGain();
            const gain2 = ctx.createGain();

            // Set initial gain to 0
            gain1.gain.setValueAtTime(0, now);
            gain2.gain.setValueAtTime(0, now);

            // Attack envelope (quick fade in)
            gain1.gain.linearRampToValueAtTime(0.5, now + 0.05);
            gain2.gain.linearRampToValueAtTime(0.5, now + 0.05);

            // Release envelope (fade out)
            gain1.gain.linearRampToValueAtTime(0, now + duration / 1000);
            gain2.gain.linearRampToValueAtTime(0, now + duration / 1000);

            // Connect oscillators to gain nodes
            osc1.connect(gain1);
            osc2.connect(gain2);

            // Connect gain nodes to master gain (volume control)
            gain1.connect(masterGainNode);
            gain2.connect(masterGainNode);

            // Start oscillators
            osc1.start(now);
            osc2.start(now);

            // Stop oscillators after duration
            osc1.stop(now + duration / 1000 + 0.1);
            osc2.stop(now + duration / 1000 + 0.1);

            // Resolve promise after duration
            setTimeout(resolve, duration + 100);

        } catch (error) {
            console.error('Error playing SELCAL tone:', error);
            reject(error);
        }
    });
}

// Play individual tone (for testing)
function playSingleTone(frequency, duration = 500) {
    return new Promise((resolve, reject) => {
        try {
            const ctx = initAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, now);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
            gain.gain.linearRampToValueAtTime(0, now + duration / 1000);

            osc.connect(gain);
            gain.connect(masterGainNode);

            osc.start(now);
            osc.stop(now + duration / 1000 + 0.1);

            setTimeout(resolve, duration + 100);

        } catch (error) {
            console.error('Error playing single tone:', error);
            reject(error);
        }
    });
}

// Stop all audio
function stopAllAudio() {
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
}

// Test all SELCAL tones (for debugging)
async function testAllTones() {
    const tones = Object.values(SELCAL_TONES);

    for (let i = 0; i < tones.length; i++) {
        console.log(`Playing tone ${i + 1}: ${tones[i]} Hz`);
        await playSingleTone(tones[i], 300);
        await sleep(100);
    }
}

// Get available SELCAL tones
function getAvailableTones() {
    return Object.entries(SELCAL_TONES).map(([letter, freq]) => ({
        letter,
        frequency: freq
    })).sort((a, b) => a.frequency - b.frequency);
}

// Validate SELCAL code
function validateSelcalCode(code) {
    // Code must be 4 characters
    if (!code || code.length !== 4) {
        return false;
    }

    // All characters must be valid SELCAL letters
    const validLetters = Object.keys(SELCAL_TONES);
    for (let char of code) {
        if (!validLetters.includes(char)) {
            return false;
        }
    }

    // No repeated letters within a pair (AB-CD: A≠B, C≠D)
    // But same letter can appear in different pairs (e.g., AB-AC is allowed)
    // Actually, let me check SELCAL rules more carefully...

    // Standard SELCAL rules:
    // - First pair: tones 1 and 2 (letters A and B)
    // - Second pair: tones 3 and 4 (letters C and D)
    // - Within each pair, tones must be different (A≠B, C≠D)
    // - Same tone can appear in different pairs (e.g., A and C can be the same)

    if (code[0] === code[1]) {
        return false; // First pair must have different tones
    }

    if (code[2] === code[3]) {
        return false; // Second pair must have different tones
    }

    return true;
}

// Get SELCAL code as formatted string
function formatSelcalCode(code) {
    if (!code || code.length !== 4) {
        return '';
    }
    return `${code[0]}${code[1]}-${code[2]}${code[3]}`;
}

// Utility: Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Set volume level (0.0 to 1.0)
function setVolume(level) {
    // Clamp volume between 0 and 1
    currentVolume = Math.max(0, Math.min(1, level));

    // Update master gain if audio context exists
    if (audioContext && masterGainNode) {
        masterGainNode.gain.setValueAtTime(currentVolume, audioContext.currentTime);
    }

    return currentVolume;
}

// Get current volume level
function getVolume() {
    return currentVolume;
}

// Export functions for use in selcal.js
window.playSelcalTone = playSelcalTone;
window.playSingleTone = playSingleTone;
window.stopAllAudio = stopAllAudio;
window.getAvailableTones = getAvailableTones;
window.validateSelcalCode = validateSelcalCode;
window.formatSelcalCode = formatSelcalCode;
window.testAllTones = testAllTones;
window.setVolume = setVolume;
window.getVolume = getVolume;
