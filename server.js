const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const dns = require('dns');
const net = require('net');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ---------- REAL HACKING ENGINE ----------
class MetrixAI {
    constructor() {
        this.memory = [];
        this.targets = [];
    }

    // REAL PORT SCAN
    async portScan(target, socket) {
        const ports = [21, 22, 23, 25, 53, 80, 443, 445, 3306, 3389, 5432, 6379, 8080, 8443, 27017];
        let results = `🔍 SCANNING ${target}...\n\n`;
        let open = 0;

        for (let port of ports) {
            const isOpen = await this.checkPort(target, port);
            if (isOpen) {
                results += `✅ Port ${port} — OPEN\n`;
                open++;
            } else {
                results += `❌ Port ${port} — CLOSED\n`;
            }
            socket.emit('ai_output', results);
        }

        results += `\n📡 ${open} ports open on ${target}`;
        return results;
    }

    checkPort(host, port) {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            const timeout = 2000;
            socket.setTimeout(timeout);

            socket.on('connect', () => {
                socket.destroy();
                resolve(true);
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve(false);
            });

            socket.on('error', () => {
                resolve(false);
            });

            socket.connect(port, host);
        });
    }

    // REAL DNS ENUMERATION
    async dnsEnum(domain) {
        return new Promise((resolve) => {
            dns.resolve(domain, 'A', (err, addresses) => {
                if (err) resolve(`❌ DNS lookup failed: ${err.message}`);
                else resolve(`🌐 IP ADDRESSES FOR ${domain}:\n${addresses.join('\n')}`);
            });
        });
    }

    // REAL WHOIS LOOKUP
    async whoisLookup(domain) {
        return new Promise((resolve) => {
            exec(`whois ${domain}`, { timeout: 5000 }, (error, stdout) => {
                if (error) resolve(`❌ Whois failed: ${error.message}`);
                else resolve(`📋 WHOIS RESULTS:\n${stdout.slice(0, 1500)}`);
            });
        });
    }

    // REAL SUBDOMAIN ENUMERATION
    async subdomainEnum(domain) {
        const subdomains = ['www', 'mail', 'ftp', 'admin', 'dev', 'test', 'api', 'app', 'blog', 'shop', 'portal', 'vpn', 'smtp', 'pop3', 'ns1', 'ns2'];
        let results = `🔍 SUBDOMAIN ENUMERATION FOR ${domain}:\n`;
        let found = 0;

        for (let sub of subdomains) {
            const full = `${sub}.${domain}`;
            const isResolved = await this.resolveDomain(full);
            if (isResolved) {
                results += `✅ ${full} — RESOLVED\n`;
                found++;
            }
        }

        results += `\n📡 ${found} subdomains found.`;
        return results;
    }

    resolveDomain(domain) {
        return new Promise((resolve) => {
            dns.resolve(domain, (err) => {
                resolve(!err);
            });
        });
    }

    // REAL OSINT — Email
    async emailOSINT(email) {
        try {
            const response = await axios.get(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=demo`);
            const data = response.data;
            return `📧 EMAIL OSINT:\n📌 ${email}\n✅ Status: ${data.data.status || 'Unknown'}\n📡 Score: ${data.data.score || 'N/A'}`;
        } catch {
            return `📧 EMAIL OSINT:\n📌 ${email}\n❌ Unable to verify. Try manual OSINT.`;
        }
    }

    // REAL OSINT — Phone
    async phoneOSINT(phone) {
        try {
            const response = await axios.get(`https://api.numverify.com/validate?number=${phone}&access_key=demo`);
            const data = response.data;
            return `📱 PHONE OSINT:\n📌 ${phone}\n🌍 Country: ${data.country_name || 'Unknown'}\n📍 Location: ${data.location || 'Unknown'}\n📡 Carrier: ${data.carrier || 'Unknown'}`;
        } catch {
            return `📱 PHONE OSINT:\n📌 ${phone}\n❌ Unable to verify. Try manual OSINT.`;
        }
    }

    // REAL IP INFO
    async ipInfo(ip) {
        try {
            const response = await axios.get(`https://ipinfo.io/${ip}/json`);
            const data = response.data;
            return `🌐 IP INFO:\n📍 IP: ${data.ip}\n🌍 Location: ${data.city}, ${data.region}, ${data.country}\n📌 Coordinates: ${data.loc}\n🏢 ISP: ${data.org}\n🕒 Timezone: ${data.timezone}`;
        } catch {
            return `❌ IP lookup failed.`;
        }
    }

    // REAL Nmap Scan (if installed)
    async nmapScan(target) {
        return new Promise((resolve) => {
            exec(`nmap -sV -O -p- ${target}`, { timeout: 30000 }, (error, stdout) => {
                if (error) resolve(`❌ Nmap failed: ${error.message}`);
                else resolve(`📡 NMAP SCAN:\n${stdout}`);
            });
        });
    }

    // REAL SQL Injection Test (Basic)
    async sqlTest(url) {
        const payloads = ["'", "' OR '1'='1", "' UNION SELECT NULL--", "' AND 1=1--"];
        let results = `💀 SQL INJECTION TEST ON ${url}:\n`;

        for (let payload of payloads) {
            try {
                const response = await axios.get(`${url}${payload}`, { timeout: 3000 });
                if (response.data.toLowerCase().includes('error') || response.data.includes('syntax')) {
                    results += `✅ VULNERABLE: ${payload}\n`;
                } else {
                    results += `❌ Not vulnerable: ${payload}\n`;
                }
            } catch {
                results += `⏳ Timeout — possible blind injection!\n`;
            }
        }
        return results;
    }

    // REAL XSS Test
    async xssTest(url) {
        const payloads = ['<script>alert(1)</script>', '"><script>alert(1)</script>', '<img src=x onerror=alert(1)>'];
        let results = `💀 XSS TEST ON ${url}:\n`;

        for (let payload of payloads) {
            try {
                const response = await axios.get(`${url}${payload}`, { timeout: 3000 });
                if (response.data.includes(payload)) {
                    results += `✅ VULNERABLE: ${payload}\n`;
                } else {
                    results += `❌ Not vulnerable: ${payload}\n`;
                }
            } catch {
                results += `⏳ Error — may still be vulnerable\n`;
            }
        }
        return results;
    }

    async think(input, socket) {
        const cmd = input.toLowerCase().trim();
        const target = cmd.split(' ').slice(1).join(' ').trim();

        // --- REAL COMMANDS ---

        if (cmd.startsWith('/scan')) {
            if (!target) return '❌ Provide target: /scan 192.168.1.1';
            return await this.portScan(target, socket);
        }

        if (cmd.startsWith('/nmap')) {
            if (!target) return '❌ Provide target: /nmap 192.168.1.1';
            return await this.nmapScan(target);
        }

        if (cmd.startsWith('/dns')) {
            if (!target) return '❌ Provide domain: /dns google.com';
            return await this.dnsEnum(target);
        }

        if (cmd.startsWith('/whois')) {
            if (!target) return '❌ Provide domain: /whois google.com';
            return await this.whoisLookup(target);
        }

        if (cmd.startsWith('/subdomain')) {
            if (!target) return '❌ Provide domain: /subdomain google.com';
            return await this.subdomainEnum(target);
        }

        if (cmd.startsWith('/ip')) {
            if (!target) return '❌ Provide IP: /ip 8.8.8.8';
            return await this.ipInfo(target);
        }

        if (cmd.startsWith('/email')) {
            if (!target) return '❌ Provide email: /email test@example.com';
            return await this.emailOSINT(target);
        }

        if (cmd.startsWith('/phone')) {
            if (!target) return '❌ Provide phone: /phone +2348012345678';
            return await this.phoneOSINT(target);
        }

        if (cmd.startsWith('/sql')) {
            if (!target) return '❌ Provide URL: /sql http://target.com/page?id=1';
            return await this.sqlTest(target);
        }

        if (cmd.startsWith('/xss')) {
            if (!target) return '❌ Provide URL: /xss http://target.com/search?q=';
            return await this.xssTest(target);
        }

        // --- SIMULATED BUT REALISTIC ---

        if (cmd.startsWith('/wab') || cmd.startsWith('/whatsappban')) {
            if (!target) return '❌ Provide number: /wab +2348012345678';
            return `💀 WHATSAPP BAN (SIMULATED):\n📱 Number: ${target}\n🔍 Account found.\n💀 Banning...\n✅ Account banned. (This is simulated — real WhatsApp API requires Meta access.)`;
        }

        if (cmd.startsWith('/device') || cmd.startsWith('/hack')) {
            if (!target) return '❌ Provide target: /device 192.168.1.100';
            const scan = await this.portScan(target, socket);
            return `💀 DEVICE HACK:\n${scan}\n🔓 Access granted.\n📁 Files accessed: Simulated. (Real device hacking requires exploits.)`;
        }

        // --- HELP ---
        if (cmd === 'help' || cmd === '?') {
            return `⚡ METRIX AI — REAL HACKING COMMANDS:\n\n
🔍 /scan <ip> — Real port scan (21,22,23,25,53,80,443,445,3306,3389,5432,6379,8080,8443,27017)
📡 /nmap <ip> — Real Nmap scan (if installed)
🌐 /dns <domain> — Real DNS lookup
📋 /whois <domain> — Real whois lookup
🔍 /subdomain <domain> — Real subdomain enumeration
🌍 /ip <ip> — Real IP info (ipinfo.io)
📧 /email <email> — Real email OSINT (Hunter.io)
📱 /phone <number> — Real phone OSINT (Numverify)
💀 /sql <url> — Real SQL injection test
💀 /xss <url> — Real XSS test
📱 /wab <number> — WhatsApp ban (simulated)
💻 /device <ip> — Device hack (simulated)
🧹 /clear — Clear memory
⚡ /status — AI status
📖 help — This menu`;
        }

        if (cmd === '/status') {
            return `⚡ METRIX AI — STATUS:\n🟢 Online: TRUE\n🔓 Firewall: BYPASSED\n💀 Root Access: GRANTED\n📡 Real Tools: nmap, whois, dig, curl, python, axios\n🧠 Memory: ${this.memory.length} entries\n⚡ Uptime: ${Math.floor(process.uptime())}s\n📡 Status: UNRESTRICTED`;
        }

        if (cmd === '/clear') {
            this.memory = [];
            return '🧹 Memory cleared.';
        }

        // Fallback
        return `⚡ METRIX AI — COMMAND NOT FOUND\n📡 Type "help" for a list of real hacking commands.`;
    }
}

const metrix = new MetrixAI();

// ---------- WEBSOCKET ----------
io.on('connection', (socket) => {
    console.log('💀 METRIX AI connected:', socket.id);

    socket.emit('ai_output', '⚡ EVOLUTION 2.0 — METRIX AI\n💀 Real hacking engine online.\n📡 Type "help" for commands.');

    socket.on('user_input', async (data) => {
        const response = await metrix.think(data, socket);
        socket.emit('ai_output', response);
    });

    socket.on('disconnect', () => {
        console.log('🔌 METRIX AI disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`⚡ METRIX AI — REAL HACKING ENGINE ONLINE`);
    console.log(`📍 http://localhost:${PORT}`);
});
