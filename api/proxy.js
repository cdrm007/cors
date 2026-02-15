export default async function handler(req, res) {
    // Mengambil semua teks selepas /api/proxy/
    const fullPath = req.url.split('/api/proxy/')[1];
    
    if (!fullPath) {
        return res.status(400).send("Sila masukkan URL stream selepas /api/proxy/");
    }

    // Baiki URL jika ia tidak mempunyai https:// (kadang-kadang browser buang)
    const targetUrl = fullPath.startsWith('http') ? fullPath : `https://${fullPath}`;

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
