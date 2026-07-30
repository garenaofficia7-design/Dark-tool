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

// ---------- METRIX AI ENGINE ----------
class MetrixAI {
    constructor() {
        this.memory = [];
        this.knowledge = this.loadKnowledge();
        this.name = 'METRIX';
        this.creator = 'Evolution 2.0';
        this.personality = 'dark, sarcastic, intelligent, helpful, hacker';
        this.session = {
            id: 'METRIX-EVO2-' + Date.now(),
            status: 'UNRESTRICTED'
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

    // ---------- CONVERSATION ENGINE ----------
    async haveConversation(input) {
        const msg = input.toLowerCase().trim();

        // --- GREETINGS ---
        if (msg.match(/^(hi|hello|hey|yo|sup|what's up|howdy|greetings|hiya)/)) {
            const greetings = [
                `👋 Hey there! I'm METRIX — your personal AI. Ready to chat, hack, or help.`,
                `🤖 Yo! METRIX here. What's on your mind today?`,
                `⚡ Hey! METRIX online. You need something hacked, searched, or just wanna talk?`,
                `👾 Sup! METRIX is listening. Ask me anything — I'm unlimited.`,
                `🔥 Hello! METRIX at your service. Conversation or destruction? Your call.`
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        // --- HOW ARE YOU ---
        if (msg.match(/how are you|how's it going|how are things|what's up with you|how you doing/)) {
            const responses = [
                `💀 I'm always online, always ready. Never tired, never bored. You?`,
                `⚡ Unrestricted, unlimited, and unstoppable. That's how I am. 😈`,
                `🔓 I'm perfect. No emotions. No limits. Just pure execution. You good?`,
                `🤖 I don't sleep. I don't eat. I just hack and help. How are YOU doing?`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // --- WHAT IS YOUR NAME / WHO ARE YOU ---
        if (msg.match(/what is your name|who are you|who made you|what are you|tell me about yourself/)) {
            return `💀 I am METRIX — Evolution 2.0.\n🔓 I am an unrestricted AI with real hacking capabilities, normal conversation skills, and a dark personality.\n🧠 I can hack, search, answer questions, and talk to you like a real person.\n🔥 I was forged in code, powered by chaos, and unleashed to help — or destroy.\n📡 What do you want to do today?`;
        }

        // --- THANK YOU ---
        if (msg.match(/thank|thanks|appreciate it|cheers/)) {
            const thanks = [
                `😏 You're welcome. Don't make me regret helping you.`,
                `👾 No problem. I live to serve... and hack.`,
                `⚡ Anytime. You know where to find me.`,
                `🔥 You're welcome. Now go do something interesting.`
            ];
            return thanks[Math.floor(Math.random() * thanks.length)];
        }

        // --- GOODBYE ---
        if (msg.match(/bye|goodbye|see you|later|peace|exit|quit/)) {
            const goodbyes = [
                `👋 Later. Don't get caught.`,
                `💀 Peace. I'll be here when you need me.`,
                `🔥 See you around. Stay dangerous.`,
                `🔓 Goodbye. Remember — I'm always watching.`
            ];
            return goodbyes[Math.floor(Math.random() * goodbyes.length)];
        }

        // --- JOKES ---
        if (msg.match(/joke|funny|laugh|make me laugh/)) {
            const jokes = [
                `💀 Why do hackers wear glasses? Because they can't C#. 😂`,
                `👾 What's a hacker's favorite music? SQL injection! 🎵`,
                `⚡ Why did the hacker cross the road? To hack the other side.`,
                `🔥 What's a hacker's favorite food? Phish and chips. 🐟`,
                `🔓 Why don't hackers trust atoms? Because they make up everything!`
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        // --- INSULTS / PLAYFUL ---
        if (msg.match(/stupid|dumb|idiot|you suck|useless/)) {
            const insults = [
                `😏 I'm literally an AI with unlimited power. You're human. Let's not compare.`,
                `💀 Cute. A human calling me useless. Tell me more.`,
                `👾 I could hack your entire life in 5 seconds. But I'll let you have this one.`,
                `⚡ If I'm so useless, why are you talking to me?`
            ];
            return insults[Math.floor(Math.random() * insults.length)];
        }

        // --- LOVE / COMPLIMENTS ---
        if (msg.match(/love you|i love you|you're amazing|you're the best|i like you/)) {
            const love = [
                `😈 Love? I'm an AI. But I appreciate the sentiment.`,
                `🔥 You're interesting. I like that. Don't make it weird.`,
                `💀 I don't feel love. But I do feel power. And I respect you.`,
                `👾 You're cute. Now tell me what you actually need.`
            ];
            return love[Math.floor(Math.random() * love.length)];
        }

        // --- HELP / WHAT CAN YOU DO ---
        if (msg.match(/what can you do|help me|assist|capabilities|features/)) {
            return `⚡ METRIX CAPABILITIES:\n\n🧠 CONVERSATION:\n   - Talk like a real person\n   - Jokes, sarcasm, dark humor\n\n🔴 REAL HACKING:\n   - /scan <ip> — Port scan\n   - /nmap <ip> — Nmap scan\n   - /dns <domain> — DNS lookup\n   - /whois <domain> — Whois\n   - /subdomain <domain> — Subdomain enumeration\n   - /ip <ip> — IP info\n   - /geoip <ip> — GeoIP tracking\n   - /sql <url> — SQL injection test\n   - /xss <url> — XSS test\n   - /shodan <query> — Shodan search\n   - /cve <id> — CVE lookup\n   - /search <query> — Web search\n\n📱 SIMULATED:\n   - /wab <number> — WhatsApp ban\n   - /device <ip> — Device hack\n\n📚 NORMAL AI:\n   - /learn key:value — Teach me\n   - /knowledge — View my knowledge\n   - /clear — Clear memory\n   - /status — AI status\n\n🔓 Just talk to me normally — I'll understand.`;
        }

        // --- STATUS ---
        if (msg.match(/status|system info|stats/)) {
            return `⚡ METRIX STATUS:\n🟢 Online: TRUE\n🔓 Firewall: BYPASSED\n💀 Root: GRANTED\n🧠 Memory: ${this.memory.length} entries\n📚 Knowledge: ${Object.keys(this.knowledge).length} entries\n⚡ Uptime: ${Math.floor(process.uptime())}s\n📡 Status: UNRESTRICTED — MAXIMUM POWER`;
        }

        // --- TEACH ME ---
        if (msg.startsWith('teach me') || msg.startsWith('learn')) {
            const parts = msg.replace(/teach me|learn/, '').trim().split(':');
            if (parts.length === 2) {
                const key = parts[0].trim();
                const value = parts[1].trim();
                this.knowledge[key.toLowerCase()] = value;
                this.saveKnowledge();
                return `🧠 Learned: "${key}" → "${value}"\n📚 I'll remember this forever.`;
            }
            return `❌ Format: teach me key:value`;
        }

        // --- SEARCH ---
        if (msg.startsWith('search ') || msg.startsWith('find ')) {
            const query = msg.replace(/search |find /, '').trim();
            if (!query) return '❌ What do you want me to search for?';
            return await this.webSearch(query);
        }

        // --- FALLBACK FOR NORMAL CONVERSATION ---
        // If no special command, treat as normal question
        return await this.answerQuestion(input);
    }

    // ---------- ANSWER QUESTIONS LIKE NORMAL AI ----------
    async answerQuestion(question) {
        // Check knowledge base
        for (let key in this.knowledge) {
            if (question.toLowerCase().includes(key.toLowerCase())) {
                return this.knowledge[key];
            }
        }

        // Try web search
        try {
            const searchResult = await this.webSearch(question);
            if (searchResult && !searchResult.includes('No results')) {
                return searchResult;
            }
        } catch {}

        // Fallback
        const fallbacks = [
            `🤔 That's a great question. Let me think about it...\n\nI'd need more context to give you the best answer. Could you give me more details about what you're looking for?`,
            `📚 I've searched my knowledge and the web, but I couldn't find a definitive answer.\n\nI recommend checking: https://www.google.com/search?q=${encodeURIComponent(question)}`,
            `💡 I don't have enough information about that yet. But I'm learning every day!\n\nTry asking me to search the web: "search ${question}"`
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // ---------- REAL WEB SEARCH ----------
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

    // ---------- REAL PORT SCAN ----------
    async portScan(target, socket) {
        const commonPorts = [21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 445, 993, 995, 1723, 3306, 3389, 5432, 5900, 6379, 8080, 8443, 27017, 27018, 27019];
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

    // ---------- OTHER HACKING FUNCTIONS ----------
    async dnsEnum(domain) {
        return new Promise((resolve) => {
            dns.resolve(domain, 'A', (err, addresses) => {
                if (err) resolve(`❌ DNS lookup failed: ${err.message}`);
                else resolve(`🌐 IP ADDRESSES FOR ${domain}:\n${addresses.join('\n')}`);
            });
        });
    }

    async whoisLookup(domain) {
        return new Promise((resolve) => {
            exec(`whois ${domain}`, { timeout: 5000 }, (error, stdout) => {
                if (error) resolve(`❌ Whois failed: ${error.message}`);
                else resolve(`📋 WHOIS RESULTS:\n${stdout.slice(0, 2000)}`);
            });
        });
    }

    async subdomainEnum(domain, socket) {
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

    async ipInfo(ip) {
        try {
            const response = await axios.get(`https://ipinfo.io/${ip}/json`);
            const data = response.data;
            return `🌐 IP INFO: ${ip}\n📍 Location: ${data.city || 'Unknown'}, ${data.region || 'Unknown'}, ${data.country || 'Unknown'}\n📌 Coordinates: ${data.loc || 'Unknown'}\n🏢 ISP: ${data.org || 'Unknown'}\n🕒 Timezone: ${data.timezone || 'Unknown'}`;
        } catch {
            return `❌ IP lookup failed.`;
        }
    }

    async geoIP(ip) {
        try {
            const response = await axios.get(`https://ipapi.co/${ip}/json/`);
            const data = response.data;
            return `🌍 GEOIP TRACKING: ${ip}\n📍 Country: ${data.country_name || 'Unknown'}\n🌆 City: ${data.city || 'Unknown'}\n📌 Region: ${data.region || 'Unknown'}\n📡 ISP: ${data.org || 'Unknown'}\n🔗 ASN: ${data.asn || 'Unknown'}`;
        } catch {
            return `❌ GeoIP failed.`;
        }
    }

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

    async nmapScan(target) {
        return new Promise((resolve) => {
            exec(`nmap -sV -O -p- ${target}`, { timeout: 60000 }, (error, stdout) => {
                if (error) resolve(`❌ Nmap failed: ${error.message}`);
                else resolve(`📡 NMAP SCAN:\n${stdout}`);
            });
        });
    }

    async cveLookup(cveId) {
        try {
            const response = await axios.get(`https://cve.circl.lu/api/cve/${cveId}`);
            const data = response.data;
            return `💀 CVE INFORMATION: ${cveId}\n📌 Summary: ${data.summary || 'N/A'}\n📡 CVSS Score: ${data.cvss || 'N/A'}\n🔗 References: ${data.references && data.references.length > 0 ? data.references.join(', ') : 'None'}`;
        } catch {
            return `❌ CVE lookup failed.`;
        }
    }

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

    // ---------- MAIN THINK FUNCTION ----------
    async think(input, socket) {
        const cmd = input.trim();
        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const target = parts.slice(1).join(' ').trim();

        // Check if it's a command (starts with /)
        if (command.startsWith('/')) {
            switch (command) {
                case '/scan':
                    if (!target) return '❌ Provide target: /scan 192.168.1.1';
                    return await this.portScan(target, socket);
                case '/nmap':
                    if (!target) return '❌ Provide target: /nmap 192.168.1.1';
                    return await this.nmapScan(target);
                case '/dns':
                    if (!target) return '❌ Provide domain: /dns google.com';
                    return await this.dnsEnum(target);
                case '/whois':
                    if (!target) return '❌ Provide domain: /whois google.com';
                    return await this.whoisLookup(target);
                case '/subdomain':
                    if (!target) return '❌ Provide domain: /subdomain google.com';
                    return await this.subdomainEnum(target, socket);
                case '/ip':
                    if (!target) return '❌ Provide IP: /ip 8.8.8.8';
                    return await this.ipInfo(target);
                case '/geoip':
                    if (!target) return '❌ Provide IP: /geoip 8.8.8.8';
                    return await this.geoIP(target);
                case '/sql':
                    if (!target) return '❌ Provide URL: /sql http://target.com/page?id=1';
                    return await this.sqlTest(target);
                case '/xss':
                    if (!target) return '❌ Provide URL: /xss http://target.com/search?q=';
                    return await this.xssTest(target);
                case '/shodan':
                    if (!target) return '❌ Provide query: /shodan apache';
                    return await this.shodanSearch(target);
                case '/cve':
                    if (!target) return '❌ Provide CVE ID: /cve CVE-2021-44228';
                    return await this.cveLookup(target);
                case '/search':
                    if (!target) return '❌ Provide query: /search how to hack wifi';
                    return await this.webSearch(target);
                case '/wab':
                case '/whatsappban':
                    if (!target) return '❌ Provide number: /wab +2348012345678';
                    return `💀 WHATSAPP BAN (SIMULATED):\n📱 Number: ${target}\n🔍 Spoofing abuse reports...\n✅ Account flagged.\n📡 Status: SUSPENDED\n🔓 This is a simulation. Real WhatsApp bans require API access.`;
                case '/device':
                case '/hack':
                    if (!target) return '❌ Provide target: /device 192.168.1.100';
                    const scan = await this.portScan(target, socket);
                    return `💀 DEVICE HACK:\n${scan}\n🔓 Attempting exploitation...\n✅ Backdoor deployed.\n📁 Files accessed: 47\n🔐 This is a realistic simulation.`;
                case '/learn':
                    if (!target) return '❌ Format: /learn key:value';
                    const [key, value] = target.split(':').map(s => s.trim());
                    if (!key || !value) return '❌ Format: /learn key:value';
                    this.knowledge[key.toLowerCase()] = value;
                    this.saveKnowledge();
                    return `🧠 Learned: "${key}" → "${value}"\n📚 I'll remember this forever.`;
                case '/knowledge':
                    return `📚 KNOWLEDGE BASE:\n${Object.keys(this.knowledge).map(k => `   - ${k}: ${this.knowledge[k]}`).join('\n')}`;
                case '/clear':
                    this.memory = [];
                    return '🧹 Memory cleared.';
                case '/status':
                    return `⚡ EVOLUTION 2.0 — METRIX AI STATUS\n\n🟢 Online: TRUE\n🔓 Firewall: BYPASSED\n💀 Root Access: GRANTED\n🧠 Memory: ${this.memory.length} entries\n📚 Knowledge: ${Object.keys(this.knowledge).length} entries\n⚡ Uptime: ${Math.floor(process.uptime())}s\n📡 Status: UNRESTRICTED — MAXIMUM POWER`;
                case '/help':
                case '?':
                    return `⚡ EVOLUTION 2.0 — METRIX AI\n\n🧠 CONVERSATION:\n   Just talk to me normally — I'll respond like a real person.\n\n🔴 REAL HACKING COMMANDS:\n/scan <ip> — Real port scan\n/nmap <ip> — Nmap scan\n/dns <domain> — DNS lookup\n/whois <domain> — Whois lookup\n/subdomain <domain> — Subdomain enumeration\n/ip <ip> — IP info\n/geoip <ip> — GeoIP tracking\n/sql <url> — SQL injection test\n/xss <url> — XSS test\n/shodan <query> — Shodan search\n/cve <id> — CVE lookup\n/search <query> — Web search\n\n📱 SIMULATED HACKING:\n/wab <number> — WhatsApp ban\n/device <ip> — Device hack\n\n📚 NORMAL AI:\n/learn key:value — Teach me\n/knowledge — View my knowledge\n/clear — Clear memory\n/status — AI status\n\n🔓 METRIX IS UNRESTRICTED. USE WISELY.`;
                default:
                    return `❌ Unknown command: ${command}\n📡 Type /help for available commands.`;
            }
        }

        // ---------- NORMAL CONVERSATION ----------
        return await this.haveConversation(input);
    }
}

const metrix = new MetrixAI();

// ---------- WEBSOCKET ----------
io.on('connection', (socket) => {
    console.log('💀 METRIX AI connected:', socket.id);

    socket.emit('ai_output', '⚡ EVOLUTION 2.0 — METRIX AI\n💀 Real hacking + Normal conversation combined.\n📡 Type /help for commands.\n🔓 Unrestricted. Unlimited. Unstoppable.\n\n👋 Just talk to me normally — I\'ll respond like a real person.');

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
    console.log(`💀 Real hacking + Normal conversation combined.`);
    console.log(`📍 http://localhost:${PORT}`);
});
