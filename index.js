const express = require('express');
const geoip = require('geoip-lite');
const dns = require('dns');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    const ip =
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null) || req.socket.remoteAddress;

    let responseText = '';
    let hostnameResolved = false;
    let geoResolved = false;

    dns.reverse(ip, (err, hostnames) => {
        if (err) {
            responseText += 'Hostname not found. ';
        } else {
            responseText += `Client Hostname: ${hostnames[0]}. `;
        }
        hostnameResolved = true;
        if (geoResolved) {
            res.send(responseText);
        }
    });

    const geo = geoip.lookup(ip);
    if (!geo) {
        responseText += 'Geolocation not found. ';
    } else {
        responseText += `IP: ${ip}, Your location: ${geo.city}, Country: ${geo.country}, Region: ${geo.region}, Timezone: ${geo.timezone}, LL: ${geo.ll}, Range: ${geo.range}. `;
    }
    geoResolved = true;
    if (hostnameResolved) {
        res.send(responseText);
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on http://192.168.1.151:${PORT}`);
});