// Vercel serverless proxy for /api/tlm
// Forwards requests to https://www.useblackbox.io/tlm to avoid browser CORS
module.exports = async (req, res) => {
  try {
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

    // Send body
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.end(buffer);
  } catch (err) {
    console.error('api/tlm proxy error:', err);
    res.statusCode = 502;
    res.end('Proxy error');
  }
};
