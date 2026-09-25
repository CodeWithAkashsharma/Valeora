import express from 'express';

const router = express.Router();

// In-memory orders store for development
let orders = [];

// GET /api/orders
router.get('/', (req, res) => {
  res.json(orders);
});

// POST /api/orders
router.post('/', (req, res) => {
  const newOrder = {
    id: `AUR-${Math.floor(1000 + Math.random() * 9000)}-2026`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Processing',
    ...req.body
  };
  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// PUT /api/orders/:id/status
router.put('/:id/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status;
  res.json(order);
});

export default router;
