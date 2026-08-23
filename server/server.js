import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import queriesRoutes from './routes/queries.routes.js';
import returnsRoutes from './routes/returns.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/queries', queriesRoutes);
app.use('/api/returns', returnsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Aurite Backend Server', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Aurite Backend Server running on http://localhost:${PORT}`);
});
