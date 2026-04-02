import { createServer } from 'http';
import { parse } from 'url';
import fs from 'fs';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const originalError = console.error;
console.error = function(...args) {
    fs.appendFileSync('error.log', new Date().toISOString() + ' ' + String(args[0]) + '\n');
    originalError.apply(console, args);
};

// [RATE LIMITER] High-Performance In-Memory store
const rateLimitMap = new Map();
const LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 300; // Expanded for 500+ Simultaneous Users

function isRateLimited(req) {
  // Get real IP (accounting for local tunnels/proxies)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  const data = rateLimitMap.get(ip);
  const elapsed = now - data.firstRequest;

  if (elapsed > LIMIT_WINDOW_MS) {
    // Reset window
    data.count = 1;
    data.firstRequest = now;
    return false;
  }

  data.count++;
  return data.count > MAX_REQUESTS;
}

app.prepare().then(() => {
  // Cleanup old rate limit data to prevent memory leaks every 10 mins
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now - data.firstRequest > LIMIT_WINDOW_MS * 2) {
        rateLimitMap.delete(ip);
      }
    }
  }, 10 * 60 * 1000);

  // Public Booking App (Port 3000)
  createServer((req, res) => {
    try {
      if (isRateLimited(req)) {
        console.warn(`[!] Rate limit triggered for IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
        res.writeHead(429, { 'Content-Type': 'text/plain' });
        res.end('Too many requests. Please wait a minute before trying again.');
        return;
      }

      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Unified tunnel approach allows dashboard on port 3000

      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(3000, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('> Passenger Booking Site ready on http://localhost:3000');
  });

  // Admin Oversight App (Port 3001)
  createServer((req, res) => {
    try {
      // (No rate limit for Admin port - strictly for supervisor use)
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Ensure root on port 3001 always goes to dashboard
      if (pathname === '/') {
        res.writeHead(302, { Location: '/dashboard' });
        res.end();
        return;
      }

      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(3001, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log('> Administrative Dashboard ready on http://localhost:3001');
  });
});
