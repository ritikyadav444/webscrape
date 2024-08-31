const express = require('express');
const requestIp = require('request-ip');
const dns = require('dns');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4001;

app.use(requestIp.mw());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));
app.get('/ho', (req, res) => {
    res.render('test');
});

app.get('/', (req, res) => {
    const clientIp = req.connection.remoteAddress;
    const normalizedIp = clientIp.startsWith('::ffff:') ? clientIp.split('::ffff:')[1] : clientIp;

    if (normalizedIp.startsWith('192.168.') || normalizedIp.startsWith('10.') || normalizedIp.startsWith('172.16.') || normalizedIp.startsWith('127.') || normalizedIp === '::1') {
        const message = `Private or localhost IP detected: ${normalizedIp}`;
        res.render('index', { hostname: null, message });
        console.log(`Private or localhost IP: ${normalizedIp}`);
    } else {
        dns.reverse(normalizedIp, (err, hostnames) => {
            if (err) {
                const message = `Could not resolve hostname for IP: ${normalizedIp}`;
                res.render('index', { hostname: null, message });
                console.log("DNS error:", err.message);
            } else {
                const hostname = hostnames[0];
                res.render('index', { hostname, message: null });
                console.log("Resolved Hostnames:", hostnames);
            }
        });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server is working on http://192.168.1.151:${PORT}`);
});