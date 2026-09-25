import express from 'express';

const router = express.Router();

// In-memory queries store for development
let queries = [];

// GET /api/queries
router.get('/', (req, res) => {
  res.json(queries);
});

// POST /api/queries
router.post('/', (req, res) => {
  const newQ = {
    id: `QRY-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Open',
    replies: [],
    ...req.body
  };
  queries.unshift(newQ);
  res.status(201).json(newQ);
});

// POST /api/queries/:id/reply
router.post('/:id/reply', (req, res) => {
  const q = queries.find(item => item.id === req.params.id);
  if (!q) return res.status(404).json({ error: 'Query not found' });
  const reply = {
    sender: req.body.sender || 'Admin',
    text: req.body.text,
    time: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  q.replies.push(reply);
  if (reply.sender === 'Admin') q.status = 'Answered';
  res.json(q);
});

// PUT /api/queries/:id/status
router.put('/:id/status', (req, res) => {
  const q = queries.find(item => item.id === req.params.id);
  if (!q) return res.status(404).json({ error: 'Query not found' });
  q.status = req.body.status;
  res.json(q);
});

export default router;
