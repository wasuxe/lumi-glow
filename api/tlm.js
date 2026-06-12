// Vercel serverless proxy for /api/tlm
// Forwards requests to https://www.useblackbox.io/tlm to avoid browser CORS
module.exports = async (req, res) => {
  try {
    // Handle CORS preflight locally to avoid forwarding OPTIONS to upstream
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin || '*';
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
      res.setHeader('Access-Control-Max-Age', '600');
      res.statusCode = 204;
      return res.end();
    }

    const originalPath = req.url || '';
    const forwardPath = originalPath.replace(/^\/api\/tlm/, '') || '';
    const target = `https://www.useblackbox.io/tlm${forwardPath}`;

    const headers = { ...req.headers };
    delete headers.host;

    const fetchOpts = {
      method: req.method,
      headers,
      // For Vercel/Node, req is a readable stream; fetch accepts it as body
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
      redirect: 'follow',
    };

    const upstream = await fetch(target, fetchOpts);

    // Mirror status
    res.statusCode = upstream.status;

    // Copy headers, excluding hop-by-hop headers
    const hopByHop = new Set([
      'connection',
      'keep-alive',
      'proxy-authenticate',
      'proxy-authorization',
      'te',
      'trailers',
      'transfer-encoding',
      'upgrade',
    ]);
    upstream.headers.forEach((value, key) => {
      if (!hopByHop.has(key.toLowerCase())) res.setHeader(key, value);
    });

    // Ensure CORS headers are present for browser clients
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    // If you want to allow credentials, also set Access-Control-Allow-Credentials: true
    // res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Send body
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.end(buffer);
  } catch (err) {
    console.error('api/tlm proxy error:', err);
    res.statusCode = 502;
    res.end('Proxy error');
  }
};
