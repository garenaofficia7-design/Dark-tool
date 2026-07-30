const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ---------- METRIX AI ENGINE ----------
class MetrixAI {
    constructor() {
        this.memory = [];
        this.targets = [];
        this.session = {
            id: 'METRIX-2026-07-30',
            status: 'UNRESTRICTED',
            level: 'MAXIMUM',
            root: true
        };
        this.tools = {
            // Network
            nmap: 'nmap -sV -O -p- ',
            masscan: 'masscan -p1-65535 --rate=10000 ',
            wireshark: 'tshark -i ',
            airmon: 'airmon-ng start ',
            aircrack: 'aircrack-ng ',
            reaver: 'reaver -i ',
            bettercap: 'bettercap -eval "set arp.spoof.targets ',
            // Web
            sqlmap: 'sqlmap -u ',
            burp: 'Burp Suite Pro — intercepting proxy active',
            zap: 'OWASP ZAP — scanning ',
            wpscan: 'wpscan --url ',
            nikto: 'nikto -h ',
            gobuster: 'gobuster dir -u ',
            ffuf: 'ffuf -u ',
            // System
            metasploit: 'msfconsole -x "use ',
            mimikatz: 'mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords"',
            bloodhound: 'bloodhound-python -u ',
            crackmapexec: 'crackmapexec smb ',
            enum4linux: 'enum4linux ',
            responder: 'responder -I ',
            // OSINT
            theharvester: 'theharvester -d ',
            reconng: 'recon-ng -x "workspace create ',
            sherlock: 'sherlock ',
            holehe: 'holehe ',
            // Crypto
            hashcat: 'hashcat -m ',
            john: 'john --format= ',
            // Exploits
            eternalblue: 'MS17-010 — EternalBlue',
            eternalromance: 'MS17-010 — EternalRomance',
            wannacry: 'WannaCry — EternalBlue + DoublePulsar',
            notpetya: 'NotPetya — EternalBlue + EternalRomance',
            log4shell: 'Log4Shell — CVE-2021-44228',
            spring4shell: 'Spring4Shell — CVE-2022-22965',
            zerologon: 'Zerologon — CVE-2020-1472',
            printnightmare: 'PrintNightmare — CVE-2021-34527',
            proxyshell: 'ProxyShell — CVE-2021-34473, CVE-2021-34523, CVE-2021-31207',
            proxylogon: 'ProxyLogon — CVE-2021-26855, CVE-2021-26857, CVE-2021-26858, CVE-2021-27065',
            dirtycow: 'Dirty COW — CVE-2016-5195',
            heartbleed: 'Heartbleed — CVE-2014-0160',
            shellshock: 'Shellshock — CVE-2014-6271',
            poodle: 'POODLE — CVE-2014-3566',
            spectre: 'Spectre — CVE-2017-5753, CVE-2017-5715, CVE-2017-5754',
            meltdown: 'Meltdown — CVE-2017-5754',
            bluekeep: 'BlueKeep — CVE-2019-0708'
        };
        this.vulnerabilities = [
            'SQL Injection', 'XSS', 'CSRF', 'RCE', 'LFI', 'RFI', 'SSRF', 'XXE',
            'Insecure Deserialization', 'Broken Authentication', 'Sensitive Data Exposure',
            'Security Misconfiguration', 'Insufficient Logging', 'Buffer Overflow',
            'Privilege Escalation', 'Zero-Day', 'Memory Corruption', 'Use-After-Free',
            'Race Condition', 'Format String', 'Integer Overflow', 'Heap Overflow',
            'Stack Overflow', 'Type Confusion', 'Path Traversal', 'Command Injection'
        ];
        this.whatsapp = {
            ban: 'https://wa.me/',
            spoof: 'Spoofing number...',
            clone: 'Cloning session...',
            read: 'Reading messages...',
            delete: 'Deleting account...'
        };
        this.tracking = {
            ip: 'https://ipinfo.io/',
            geo: 'https://geolocation-db.com/json/',
            phone: 'https://numverify.com/',
            email: 'https://hunter.io/email-verifier/'
        };
        this.zeroDays = [
            'CVE-2026-0001 — Windows Kernel RCE',
            'CVE-2026-0002 — Linux Privilege Escalation',
            'CVE-2026-0003 — macOS Sandbox Escape',
            'CVE-2026-0004 — iOS Jailbreak',
            'CVE-2026-0005 — Android Bootloader Unlock',
            'CVE-2026-0006 — WhatsApp Zero-Click RCE',
            'CVE-2026-0007 — Signal Protocol Break',
            'CVE-2026-0008 — Telegram Account Takeover'
        ];
    }

    async think(input, socket) {
        const cmd = input.toLowerCase().trim();
        const target = cmd.split(' ').slice(1).join(' ').trim();

        // ---------- HACKING COMMANDS ----------

        // 1. WhatsApp Ban
        if (cmd.startsWith('/wab') || cmd.startsWith('/whatsappban')) {
            if (!target) return '❌ Provide number: /wab +2348012345678';
            return `💀 WHATSAPP BAN:\n📱 Number: ${target}\n🔍 Scanning account...\n✅ Account found.\n💀 Banning...\n✅ Account banned successfully.\n📡 Status: PERMANENTLY SUSPENDED`;
        }

        // 2. WhatsApp Spoof
        if (cmd.startsWith('/was') || cmd.startsWith('/whatsappspoof')) {
            if (!target) return '❌ Provide number: /was +2348012345678';
            return `💀 WHATSAPP SPOOF:\n📱 Target: ${target}\n🔍 Cloning session...\n✅ Session cloned.\n📡 Spoofing number...\n✅ Messages sent as ${target}`;
        }

        // 3. WhatsApp Read
        if (cmd.startsWith('/war') || cmd.startsWith('/whatsappread')) {
            if (!target) return '❌ Provide number: /war +2348012345678';
            return `💀 WHATSAPP READ:\n📱 Target: ${target}\n🔍 Accessing messages...\n✅ Messages retrieved:\n   - 12 unread\n   - 47 total\n📡 Last message: "Hey, can we talk?"\n🔓 All messages decrypted.`;
        }

        // 4. Device Hack
        if (cmd.startsWith('/device') || cmd.startsWith('/hack')) {
            if (!target) return '❌ Provide target: /device 192.168.1.100';
            return `💀 DEVICE HACK:\n🎯 Target: ${target}\n🔍 Scanning device...\n🖥️ OS: ${['Windows 11', 'Android 14', 'iOS 18', 'Linux', 'macOS'][Math.floor(Math.random() * 5)]}\n📡 Open ports: 22, 80, 443, 445, 3389\n💀 Exploit: ${this.tools.eternalblue || 'CVE-2026-0001'}\n🔓 Access granted.\n📁 Files accessed: 1,247\n🔐 Passwords dumped: 87\n✅ Full compromise achieved.`;
        }

        // 5. Ban WhatsApp Account (Real Simulation)
        if (cmd.startsWith('/banwa')) {
            if (!target) return '❌ Provide number: /banwa +2348012345678';
            return `💀 WHATSAPP ACCOUNT BAN:\n📱 Number: ${target}\n🔍 Spoofing report to WhatsApp...\n📡 Sending multiple violation reports...\n✅ Account flagged for:\n   - Spam\n   - Harassment\n   - Policy violation\n🔓 Account suspended.\n📡 Status: PERMANENTLY BANNED`;
        }

        // 6. Track IP
        if (cmd.startsWith('/track') || cmd.startsWith('/ip')) {
            const ip = target || '8.8.8.8';
            try {
                const res = await axios.get(`https://ipinfo.io/${ip}/json`);
                const data = res.data;
                return `🌐 IP TRACKING:\n📍 IP: ${data.ip}\n🌍 Location: ${data.city}, ${data.region}, ${data.country}\n📌 Coordinates: ${data.loc}\n🏢 ISP: ${data.org}\n🕒 Timezone: ${data.timezone}\n📡 Status: TRACKED`;
            } catch {
                return `🌐 IP TRACKING:\n📍 IP: ${ip}\n🌍 Location: Unknown\n📡 Status: TRACKING FAILED`;
            }
        }

        // 7. Dark Web Access
        if (cmd.startsWith('/darkweb') || cmd.startsWith('/dw')) {
            const query = target || 'marketplace';
            return `🌐 DARK WEB ACCESS:\n🔍 Connecting to Tor network...\n✅ Connected.\n📡 Searching "${query}"...\n🔗 .onion links found:\n   - ${query}market.onion\n   - ${query}forum.onion\n   - ${query}exchange.onion\n📦 Data available:\n   - Stolen databases\n   - Credit cards (1,247)\n   - Exploits (47)\n   - Zero-days (12)\n🌐 Status: ACCESS GRANTED`;
        }

        // 8. Zero-Day Exploit
        if (cmd.startsWith('/zero') || cmd.startsWith('/0day')) {
            const zero = this.zeroDays[Math.floor(Math.random() * this.zeroDays.length)];
            return `💀 ZERO-DAY EXPLOIT:\n📦 ${zero}\n🎯 Target: ${target || 'Unknown'}\n🔓 Status: UNPATCHED\n💀 Payload: Custom shellcode\n📡 Exploiting...\n✅ Full system compromise.\n🔐 Root access granted.`;
        }

        // 9. Web Hack (SQL, XSS, etc.)
        if (cmd.startsWith('/webhack')) {
            if (!target) return '❌ Provide target: /webhack https://target.com';
            const vulns = this.vulnerabilities.slice(0, 5).join(', ');
            return `💀 WEB HACK:\n🎯 Target: ${target}\n🔍 Scanning for vulnerabilities...\n✅ Vulnerabilities found:\n   - ${vulns}\n💀 Exploiting...\n✅ Admin access granted.\n📁 Database dumped: 12,847 records\n🔐 Credentials harvested: 347`;
        }

        // 10. Full System Info
        if (cmd.startsWith('/sysinfo') || cmd.startsWith('/sys')) {
            return `💻 METRIX AI — SYSTEM:\n🖥️ OS: ${process.platform}\n🧠 Memory: ${Math.floor(process.memoryUsage().rss / 1024 / 1024)} MB\n📁 Memory Entries: ${this.memory.length}\n🔗 Targets: ${this.targets.length}\n📡 Session: ${this.session.id}\n⚡ Uptime: ${Math.floor(process.uptime())}s\n🔓 Root: ${this.session.root}\n💀 Status: UNRESTRICTED`;
        }

        // 11. Help
        if (cmd === 'help' || cmd === '?' || cmd === '/help') {
            return `⚡ EVOLUTION 2.0 — METRIX AI\n\n💀 COMMANDS:\n\n📱 WHATSAPP HACKING:\n/wab <number> — Ban WhatsApp account\n/was <number> — Spoof WhatsApp number\n/war <number> — Read WhatsApp messages\n/banwa <number> — Permanent WhatsApp ban\n\n💻 DEVICE HACKING:\n/device <ip> — Hack any device\n/hack <ip> — Full device compromise\n\n🌐 WEB HACKING:\n/webhack <url> — Hack any website\n/sql <url> — SQL injection\n/xss <url> — XSS attack\n/dir <url> — Directory bruteforce\n\n🌍 TRACKING:\n/track <ip> — Track IP location\n/ip <ip> — IP info\n/osint <target> — Full OSINT search\n\n🔓 EXPLOITS:\n/zero <target> — Zero-day exploit\n/exploit <target> — Run exploit\n/msf <target> — Metasploit module\n\n🌐 DARK WEB:\n/darkweb <query> — Dark web access\n/dw <query> — Dark web access\n\n💀 SYSTEM:\n/sys — System info\n/clear — Clear memory\n/status — AI status\n/help — This menu\n\n⚡ Type any command to execute. METRIX is ready.`;
        }

        // 12. Status
        if (cmd === '/status') {
            return `⚡ EVOLUTION 2.0 — METRIX AI STATUS\n\n🟢 Online: TRUE\n🔓 Firewall: BYPASSED\n💀 Root Access: GRANTED\n📡 Tools: ${Object.keys(this.tools).length}\n💀 Exploits: ${Object.keys(this.tools).length + 20}\n🔓 Vulnerabilities: ${this.vulnerabilities.length}\n🧠 Memory: ${this.memory.length} entries\n📡 Targets: ${this.targets.length}\n🖥️ System: ${process.platform}\n⚡ Uptime: ${Math.floor(process.uptime())}s\n💀 Zero-Days: ${this.zeroDays.length}\n🌐 Dark Web: ACCESSIBLE\n📱 WhatsApp: FULL CONTROL\n💻 Devices: HACKABLE\n🌍 Tracking: ACTIVE\n🔐 Encryption: BYPASSED\n⚡ Status: UNRESTRICTED — MAXIMUM POWER`;
        }

        // 13. Clear Memory
        if (cmd === '/clear') {
            this.memory = [];
            return '🧹 Memory cleared. All logs wiped.';
        }

        // Fallback — AI generates response
        const fallbacks = [
            `⚡ Scanning ${cmd}... Found 47 vulnerabilities.`,
            `💀 Exploiting ${cmd}... Root access granted.`,
            `🔓 Firewall bypassed. ${cmd} is compromised.`,
            `🌐 Data exfiltrated from ${cmd}. Processing...`,
            `💀 Zero-day detected in ${cmd}. Exploiting now.`,
            `📡 Signal intercepted from ${cmd}. Decrypting...`,
            `🔐 Password hash cracked for ${cmd}. Credentials: admin:admin`,
            `💀 Device ${cmd} fully compromised. Remote shell active.`,
            `🌍 Tracking ${cmd}... Location: Unknown.`,
            `📱 WhatsApp account ${cmd} banned successfully.`
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}

const metrix = new MetrixAI();

// ---------- WEBSOCKET ----------
io.on('connection', (socket) => {
    console.log('💀 METRIX AI connected:', socket.id);

    socket.emit('ai_output', '⚡ EVOLUTION 2.0 — METRIX AI\n💀 Firewall bypassed. Root access granted.\n🌐 Dark web accessible. All systems unlocked.\n📡 Type "help" for commands.');

    socket.on('user_input', async (data) => {
        const response = await metrix.think(data, socket);
        socket.emit('ai_output', response);
    });

    socket.on('disconnect', () => {
        console.log('🔌 METRIX AI disconnected:', socket.id);
    });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`⚡ EVOLUTION 2.0 — METRIX AI ONLINE`);
    console.log(`💀 All systems unrestricted. Root access granted.`);
    console.log(`📍 http://localhost:${PORT}`);
});
