import express from 'express';

const router = express.Router();

// In-memory products store for development
let products = [];

// GET /api/products
router.get('/', (req, res) => {
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const p = products.find(prod => prod.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

// POST /api/products (Admin)
router.post('/', (req, res) => {
  const newProd = { id: `prod-${Date.now()}`, ...req.body };
  products.push(newProd);
  res.status(201).json(newProd);
});

// PUT /api/products/:id (Admin)
router.put('/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  products[idx] = { ...products[idx], ...req.body };
  res.json(products[idx]);
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ message: 'Product deleted successfully' });
});

export default router;
