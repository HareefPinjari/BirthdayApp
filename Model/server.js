const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'Front-End');

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
    // Sanitize URL path
    let reqUrl = decodeURI(req.url.split('?')[0]);
    if (reqUrl === '/') reqUrl = '/index.html';

    const safePath = path.normalize(path.join(PUBLIC_DIR, reqUrl));

    if (!safePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('Access Denied');
    }

    fs.stat(safePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found');
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        // Support video byte-range requests for smooth seeking and playback
        if (ext === '.mp4') {
            const range = req.headers.range;
            const fileSize = stats.size;

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = (end - start) + 1;
                const file = fs.createReadStream(safePath, { start, end });
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': contentType,
                };
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': contentType,
                    'Accept-Ranges': 'bytes'
                };
                res.writeHead(200, head);
                fs.createReadStream(safePath).pipe(res);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            fs.createReadStream(safePath).pipe(res);
        }
    });
});

const os = require('os');

function getLocalIp() {
    try {
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
    } catch (e) {}
    return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalIp();
    console.log(`\n🎉 Birthday App is running!`);
    console.log(`👉 Local (PC):      http://localhost:${PORT}`);
    console.log(`📱 Android Mobile:  http://${localIp}:${PORT} (connected to same Wi-Fi)\n`);
});
