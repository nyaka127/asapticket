const { spawn, exec, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const tunnels = [
    { name: 'ASAP TICKETS SYSTEM', port: 3000, color: '\x1b[36m' }
];

console.log('\n\x1b[36m%s\x1b[0m', '=== ASAP TICKETS - GLOBAL TUNNEL HUB ===');
console.log('Fetching live global access links from Cloudflare...\n');

let foundCount = 0;

function openBrowser(url) {
    try {
        // Use cmd /c start to ensure it works properly on all Windows versions
        const command = process.platform === 'win32' ? `cmd /c start "" "${url}"` : `open "${url}"`;
        exec(command);
    } catch (e) {
        console.log(`[!] Could not auto-open browser for ${url}`);
    }
}

function generateQr(label, url, color) {
    console.log(`\n${color}${label} LIVE:\x1b[0m ${url}`);
    try {
        // Generate terminal QR
        const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
        execSync(`${npxCmd} -y qrcode-terminal "${url}" small`, { stdio: 'inherit' });
        
        // Also attempt to save a physical QR image for the user in the public folder
        const fileName = label.toLowerCase().includes('client') ? 'qr_client.png' : 'qr_agent.png';
        const publicDir = path.join(__dirname, 'public');
        if (fs.existsSync(publicDir)) {
           exec(`${npxCmd} -y qrcode "${url}" -o "${path.join(publicDir, fileName)}"`, (err) => {
               if (err) console.error(`[!] Failed to save QR Image for ${label}: ${err.message}`);
               else console.log(`[✓] Permanent QR Image saved: public/${fileName}`);
           });
        }
    } catch (e) {
        console.log('[QR terminal display skipped]');
    }
}

function startTunnel(t, delayMs) {
    setTimeout(() => {
        // Use Cloudflare for both tunnels (more stable than localhost.run)
        const cmdArgs = ['/c', `cloudflared.exe tunnel --url http://127.0.0.1:${t.port} --no-autoupdate`];
        
        const cf = spawn('cmd.exe', cmdArgs, {
            cwd: __dirname
        });

        cf.stdout.on('data', (data) => parseOutput(t, data));
        cf.stderr.on('data', (data) => parseOutput(t, data));

        cf.on('close', (code) => {
            console.log(`\x1b[31m[!] Tunnel for ${t.name} (Port ${t.port}) disconnected. Reconnecting in 5s...\x1b[0m`);
            t.url = undefined; // Reset so it can capture the new URL
            setTimeout(() => startTunnel(t, 0), 5000);
        });
    }, delayMs);
}

// Always open local URLs in the browser immediately so user sees both sites
setTimeout(() => {
    console.log('\n\x1b[36m[*] Opening local sites in browser...\x1b[0m');
    openBrowser('http://localhost:3000/flights');
    setTimeout(() => openBrowser('http://localhost:3001/dashboard/leads'), 1500);
}, 3000);

// Launch the single stable tunnel immediately
tunnels.forEach((t, i) => {
    startTunnel(t, 0); 
});

function parseOutput(tunnel, data) {
    const output = data.toString();
    console.log(`[DEBUG ${tunnel.port}]`, output.trim());
    // Improved regex to be more precise
    const regex = /https:\/\/[a-zA-Z0-9-.]+\.(trycloudflare\.com|loca\.lt|lhr\.life)/gi;
    const match = output.match(regex);

    if (match && !tunnel.url) {
        const url = match[0].trim();
        tunnel.url = url;
        
        try {
            const fs = require('fs');
            const path = require('path');
            fs.appendFileSync('live_links.txt', `URL: ${url}\n`);

            // --- AUTO-DEPLOY CLIENT SITE TO GITHUB PAGES ---
            console.log('\n\x1b[36m[*] Auto-Syncing GitHub Client Site to New Tunnel...\x1b[0m');
            const indexPath = path.join(__dirname, 'tmp', 'gh-pages', 'index.html');
            if (fs.existsSync(indexPath)) {
                let html = fs.readFileSync(indexPath, 'utf8');
                html = html.replace(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/g, url);
                fs.writeFileSync(indexPath, html, 'utf8');
                
                const deployScript = path.join(__dirname, 'tmp', 'auto_github_sync.ps1');
                if (fs.existsSync(deployScript)) {
                     const exec = require('child_process').exec;
                     const deployCmd = process.platform === 'win32' ? `powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File "${deployScript}"` : '';
                     if (deployCmd) {
                         exec(deployCmd, (err, stdout, stderr) => {
                             if (err) console.error(`\x1b[31m[!] GitHub Sync Failed:\x1b[0m ${err.message}`);
                             else console.log(`\n\x1b[32m[✓] GitHub Server Sync Complete (Live in 2 minutes)\x1b[0m`);
                         });
                     }
                }
            }
            // ------------------------------------------------

        } catch(e) {}

        const clientUrl = `${url}/flights`;
        const agentUrl = `${url}/dashboard/leads`;

        generateQr("CLIENT BOOKING SITE", clientUrl, '\x1b[32m');
        generateQr("AGENT DASHBOARD", agentUrl, '\x1b[35m');
        
        openBrowser(clientUrl); 
        setTimeout(() => openBrowser(agentUrl), 1500);

        console.log('\n\x1b[33m%s\x1b[0m', '=====================================================');
        console.log('\x1b[33m%s\x1b[0m', '   SUCCESS! SYSTEM IS LIVE IN YOUR BROWSER');
        console.log('\x1b[33m%s\x1b[0m', '=====================================================');
        console.log(`   CLIENTS: \x1b[32m${clientUrl}\x1b[0m`);
        console.log(`   AGENTS:  \x1b[35m${agentUrl}\x1b[0m`);
        console.log('\x1b[33m%s\x1b[0m', '=====================================================\n');
    }
}

// Keep the process alive
setInterval(() => {}, 60000);
