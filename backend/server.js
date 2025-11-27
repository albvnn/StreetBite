import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import standsApiRouter from './controllers/standsapi.route.js';
import menuItemsApiRouter from './controllers/menuitemsapi.route.js';
import reviewsApiRouter from './controllers/reviewsapi.route.js';
import usersApiRouter from './controllers/usersapi.route.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS plus permissive pour le développement
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Gérer explicitement les requêtes OPTIONS (preflight)
app.options('*', cors());

app.use(bodyParser.json());

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  // Ignorer les requêtes de health check pour réduire le bruit dans les logs
  if (req.path !== '/health') {
    console.log(`[${timestamp}] [REQUEST] ${req.method} ${req.path}`, {
      query: Object.keys(req.query).length > 0 ? req.query : undefined,
      body: Object.keys(req.body || {}).length > 0 ? req.body : undefined,
      headers: {
        'content-type': req.headers['content-type'],
        'origin': req.headers.origin
      }
    });
  }

  // Logger la réponse quand elle est envoyée
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    if (req.path !== '/health') {
      const responseData = Array.isArray(data) 
        ? `[Array with ${data.length} items]` 
        : (typeof data === 'object' && data !== null && Object.keys(data).length > 10
            ? `[Object with ${Object.keys(data).length} keys]`
            : data);
      console.log(`[${new Date().toISOString()}] [RESPONSE] ${req.method} ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms`, responseData);
    }
    return originalJson.call(this, data);
  };

  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    if (req.path !== '/health' && res.statusCode !== 204) {
      console.log(`[${new Date().toISOString()}] [RESPONSE] ${req.method} ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    }
    return originalSend.call(this, data);
  };

  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', standsApiRouter);
app.use('/api', menuItemsApiRouter);
app.use('/api', reviewsApiRouter);
app.use('/api', usersApiRouter);

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`StreetBite backend listening on port ${PORT}`);
});

