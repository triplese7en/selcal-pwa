# SELCAL Emulator - Airbus Cockpit Style

A Progressive Web App (PWA) that emulates the aviation SELCAL (Selective Calling) system with authentic Airbus A320 cockpit aesthetics.

## Features

- **Authentic SELCAL Tones**: Uses the standard 16 SELCAL frequencies (312.6 Hz to 1419.2 Hz)
- **Airbus Cockpit UI**: Professional dark theme inspired by Airbus A320 displays
- **Offline Capable**: Full PWA support - works without internet connection
- **Touch Optimized**: Designed for both desktop and mobile devices
- **Real-time Feedback**: Displays selected tones and frequencies in real-time
- **Accurate Audio**: Web Audio API generates precise sine waves at correct frequencies

## SELCAL Codes

A SELCAL code consists of 4 letters (e.g., AB-CD), representing 4 tones:
- First pair (A-B): Two tones played simultaneously
- Second pair (C-D): Two tones played simultaneously
- Each pair is transmitted separately with a short pause

### Available Letters

| Letter | Frequency (Hz) |
|--------|----------------|
| A | 312.6 |
| B | 346.7 |
| C | 384.6 |
| D | 426.6 |
| E | 472.9 |
| F | 523.3 |
| G | 578.7 |
| H | 639.9 |
| J | 707.3 |
| K | 781.8 |
| L | 864.3 |
| M | 955.0 |
| P | 1055.2 |
| Q | 1165.0 |
| R | 1285.8 |
| S | 1419.2 |

Note: Letters I, N, O, T, U, V, W, X, Y, Z are not used in SELCAL.

## Installation

### PWA Installation

1. Open the app in a modern browser (Chrome, Firefox, Safari, Edge)
2. Click the install icon in the address bar (or share menu on mobile)
3. Follow the prompts to install as an app

### Manual Installation

1. Clone or download this repository
2. Serve the files using a web server (e.g., `python -m http.server` or `npx serve`)
3. Access via `http://localhost:8000`

## Usage

1. **Select Letters**: Tap/click letters on the keypad to build your SELCAL code
2. **Review Tones**: Selected letters show their corresponding frequencies
3. **Test SELCAL**: Press "TEST SELCAL" to hear the transmission
4. **Clear**: Press "CLEAR" to reset and start over

## Technical Details

### Audio Generation

- Uses Web Audio API for precise tone generation
- Sine waves at exact SELCAL frequencies
- Simultaneous dual-tone transmission (pairs)
- Envelope shaping for smooth attack/release

### PWA Features

- Service Worker for offline caching
- Web App Manifest for installability
- Responsive design for all screen sizes
- Optimized performance with minimal external dependencies

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### File Structure

```
selcal-pwa/
├── index.html          # Main HTML structure
├── manifest.json       # PWA manifest
├── sw.js              # Service worker for offline support
├── css/
│   └── cockpit.css    # Airbus cockpit styling
├── js/
│   ├── selcal.js      # SELCAL logic and UI handling
│   └── audio.js       # Audio generation with Web Audio API
└── README.md          # This file
```

### Build & Deploy

No build process required - it's pure HTML/CSS/JavaScript!

To deploy:

1. **GitHub Pages**: Enable in repository settings
2. **Netlify**: Drag and drop folder
3. **Vercel**: Connect repository
4. **Custom Hosting**: Serve static files from any web server

## License

MIT License - Feel free to use and modify for educational purposes.

## Aviation Context

SELCAL (Selective Calling) is used in aviation to alert flight crews that a ground station is attempting to establish communication. Each aircraft is assigned a unique 4-letter SELCAL code. When the ground station transmits this code, the aircraft's SELCAL decoder activates a chime and flashes a light, alerting the crew.

This emulator is for educational and training purposes only. It does not interface with actual aviation radio systems.

## Credits

- Design: Inspired by Airbus A320 cockpit displays
- Frequencies: Standard ICAO SELCAL specification
- Technology: Web Audio API, Service Workers, PWA standards

---

**Version**: 1.0.0
**Last Updated**: March 2026
