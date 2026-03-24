// Simple icon generator script
// Run with: node generate-icons.js

const fs = require('fs');
const http = require('http');

// Create simple SVG icons that can be converted to PNG
function generateIconSVG(size) {
    const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" rx="${size * 0.15}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.4}" font-weight="bold" fill="#00ff9d" text-anchor="middle" dominant-baseline="middle">SC</text>
    <circle cx="${size * 0.25}" cy="${size * 0.75}" r="${size * 0.05}" fill="#00ff9d"/>
    <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${size * 0.05}" fill="#00ff9d"/>
</svg>`;
    return svg;
}

console.log('Icon generator script');
console.log('To generate PNG icons, you will need ImageMagick or similar:');
console.log('');
console.log('For 192x192 icon:');
console.log('  convert -background none -size 192x192 xc:none -fill "#1a1a2e" -draw "roundrectangle 0,0,192,192,30,30" -pointsize 72 -fill "#00ff9d" -gravity center -annotate +0+0 "SC" icon-192.png');
console.log('');
console.log('For 512x512 icon:');
console.log('  convert -background none -size 512x512 xc:none -fill "#1a1a2e" -draw "roundrectangle 0,0,512,512,75,75" -pointsize 192 -fill "#00ff9d" -gravity center -annotate +0+0 "SC" icon-512.png');
console.log('');
console.log('Alternatively, use online tools like:');
console.log('  - https://realfavicongenerator.net/');
console.log('  - https://www.favicon-generator.org/');
console.log('');
console.log('Required files:');
console.log('  - icon-192.png (192x192)');
console.log('  - icon-512.png (512x512)');

// Write SVG files as placeholders
fs.writeFileSync('icon-192.svg', generateIconSVG(192));
fs.writeFileSync('icon-512.svg', generateIconSVG(512));

console.log('');
console.log('✓ Created SVG placeholder files');
console.log('✓ Convert these to PNG for the PWA');
