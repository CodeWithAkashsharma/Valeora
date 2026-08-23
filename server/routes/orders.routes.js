import express from 'express';

const router = express.Router();

let orders = [
  {
    id: 'AUR-5815-2026',
    date: '2026-08-08 09:36',
    customerName: 'Akash Sharma',
    email: 'akash@example.com',
    items: [{ id: 'prod-magnesium', name: 'Aurite High-Absorption Magnesium Glycinate Complex', qty: 1, price: 1899, purchaseType: 'one-time' }],
    subtotal: 1899,
    discount: 0,
    shipping: 0,
    total: 1899,
    status: 'Processing',
    address: 'B-402, Green Glen Layout, Bellandur, Bengaluru 560103',
    phone: '+91 98765 43210'
  }
];

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
