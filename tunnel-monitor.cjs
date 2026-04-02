const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Monitor two free Cloudflare Quick Tunnel logs
const files = {
    passenger: path.join(__dirname, 'passenger_1.log'),
    agent: path.join(__dirname, 'agent_1.log')
};

const state = { passenger: null, agent: null };
const startTime = Date.now();

console.log('\n\x1b[36m%s\x1b[0m', '=== ASAP TICKETS - FREE GLOBAL LINK MONITOR ===');
console.log('Scanning for live tunnel URLs... (Waiting for logs to generate)\n');

function getUrl(content) {
    // Detects both Cloudflare (*.trycloudflare.com) and LocalTunnel (*.loca.lt) patterns
    // Also captures localhost.run if used in the future
    const regex = /https:\/\/[a-zA-Z0-9-]+\.(trycloudflare\.com|loca\.lt|lhr\.life)/gi;
    const matches = [...content.matchAll(regex)];
    return matches.length > 0 ? matches[matches.length - 1][0] : null;
}

function generateQr(label, url) {
    console.log(`\n\x1b[32m${label} LIVE:\x1b[0m ${url}`);
    try {
        // Use -y to avoid interactive prompts
        execSync(`npx -y qrcode-terminal "${url}" small`, { stdio: 'inherit' });
    } catch (e) {
        console.log('[QR skipped - scan the link above instead]');
    }
}

let dotCount = 0;
const monitorInterval = setInterval(() => {
    let foundNew = false;
    
    for (const [key, file] of Object.entries(files)) {
        if (fs.existsSync(file)) {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const url = getUrl(content);

                if (url && url !== state[key]) {
                    state[key] = url;
                    foundNew = true;
                    
                    if (key === 'passenger') {
                        generateQr("🏆 CLIENT BOOKING SITE", url);
                    } else {
                        generateQr("🕵️  AGENT DASHBOARD", url);
                    }

                    // Print summary when both are found
                    if (state.passenger && state.agent) {
                        console.log('\n\x1b[33m%s\x1b[0m', '=====================================================');
                        console.log('\x1b[33m%s\x1b[0m', '   BOTH LINKS ARE LIVE! Share these with clients:');
                        console.log('\x1b[33m%s\x1b[0m', '=====================================================');
                        console.log(`   1. CLIENT:  ${state.passenger}`);
                        console.log(`   2. AGENT:   ${state.agent}`);
                        console.log('\x1b[33m%s\x1b[0m', '=====================================================\n');
                        console.log('Monitoring for any changes... Press Ctrl+C to close monitor window.');
                        // We keep running in case a tunnel restarts and gets a new URL
                    }
                }
            } catch (err) { /* file busy */ }
        }
    }

    // Keep the user informed that we are still working
    if (!state.passenger || !state.agent) {
        dotCount = (dotCount + 1) % 4;
        process.stdout.write(`\rWaiting for tunnel sync${'.'.repeat(dotCount)}${' '.repeat(3-dotCount)}`);
    }

    // If wait > 60s and still nothing, show a tip
    if (Date.now() - startTime > 60000 && !state.passenger && !state.agent) {
        if (dotCount === 0) { // Only print once every cycle
             console.log('\n\x1b[33m[TIP] Tunnels taking long? Ensure the website is building in the other window.\x1b[0m');
        }
    }

}, 1000); // Check every second for faster response