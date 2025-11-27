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

app.use(cors());
app.use(bodyParser.json());

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

