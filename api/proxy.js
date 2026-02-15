export default async function handler(req, res) {
    // Ini akan mengambil bahagian URL selepas /api/proxy/
    const urlPath = req.url.split('/api/proxy/')[1];

    if (!urlPath) {
        return res.status(400).send("Guna format: /api/proxy/https://link-tv.com/live.m3u8");
    }

    // Baiki URL jika browser tersalah format
    const targetUrl = urlPath.startsWith('http') ? urlPath : `https://${urlPath}`;

    try {
        const response = await fetch(targetUrl);
        const data = await response.arrayBuffer();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/vnd.apple.mpegurl');
        
        return res.send(Buffer.from(data));
    } catch (e) {
        return res.status(500).send("Error: " + e.message);
    }
}
