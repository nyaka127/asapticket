import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Public Booking App (Port 3000)
  createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Rewrite root to /flights for the public site
      if (pathname === '/') {
        parsedUrl.pathname = '/flights';
        req.url = '/flights';
      }

      // Block access to dashboard
      if (pathname.startsWith('/dashboard')) {
        res.writeHead(403);
        res.end('Access Denied');
        return;
      }

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
