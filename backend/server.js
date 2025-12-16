import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import standsApiRouter from './controllers/standsapi.route.js';
import menuItemsApiRouter from './controllers/menuitemsapi.route.js';
import reviewsApiRouter from './controllers/reviewsapi.route.js';
import usersApiRouter from './controllers/usersapi.route.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS simplifiée et permissive pour le développement
app.use(cors({
  origin: true, // Permet toutes les origines
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(bodyParser.json());

// Middleware pour logger toutes les requêtes (après CORS)
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  // Ignorer les requêtes de health check et OPTIONS pour réduire le bruit dans les logs
  if (req.path !== '/health' && req.method !== 'OPTIONS') {
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
    if (req.path !== '/health' && req.method !== 'OPTIONS') {
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
    if (req.path !== '/health' && res.statusCode !== 204 && req.method !== 'OPTIONS') {
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

// Gestionnaire d'erreur pour le serveur
const server = app.listen(PORT, () => {
  console.log(`StreetBite backend listening on port ${PORT}`);
});

// Gestion des erreurs du serveur
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;
  
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Ne pas arrêter le serveur immédiatement, laisser une chance de se récupérer
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Ne pas arrêter le serveur immédiatement
});

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

