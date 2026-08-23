import express from 'express';

const router = express.Router();

let queries = [
  {
    id: 'QRY-901',
    customerName: 'Akash Sharma',
    email: 'akash@example.com',
    phone: '+91 98765 43210',
    subject: 'Return Request for #AUR-5815-2026: Damaged Outer Packaging / Broken Seal',
    message: 'Hello Aurite Support team,\n\nI received my order #AUR-5815-2026 today, but the outer packaging seal was crushed and tampered during transit. I am submitting this query to request a hassle-free return or replacement. Please review and arrange courier pickup.\n\nThank you,\nAkash Sharma',
    status: 'Answered',
    date: '2026-08-08 09:36',
    replies: [
      { sender: 'Admin', text: 'Hello Akash, we sincerely apologize for the transit mishandling. Please upload an image or confirm your availability for courier reverse pickup.', time: '2026-08-08 09:42' }
    ]
  }
];

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
