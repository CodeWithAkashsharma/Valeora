import express from 'express';

const router = express.Router();

// In-memory returns store for development
let returns = [];

// GET /api/returns
router.get('/', (req, res) => {
  res.json(returns);
});

// POST /api/returns
router.post('/', (req, res) => {
  const newRet = {
    id: `RET-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: 'Requested',
    chat: [
      { sender: 'Aurite Returns Bot', text: 'Return claim logged. Our resolutions officer is reviewing your request.', time: new Date().toISOString().replace('T', ' ').substring(0, 16) }
    ],
    ...req.body
  };
  returns.unshift(newRet);
  res.status(201).json(newRet);
});

// POST /api/returns/:id/chat
router.post('/:id/chat', (req, res) => {
  const ret = returns.find(r => r.id === req.params.id);
  if (!ret) return res.status(404).json({ error: 'Return case not found' });
  const msg = {
    sender: req.body.sender || 'Customer',
    text: req.body.text,
    time: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  ret.chat.push(msg);
  res.json(ret);
});

// PUT /api/returns/:id/status
router.put('/:id/status', (req, res) => {
  const ret = returns.find(r => r.id === req.params.id);
  if (!ret) return res.status(404).json({ error: 'Return case not found' });
  ret.status = req.body.status;
  if (req.body.note) {
    ret.chat.push({
      sender: 'Aurite Returns Bot',
      text: `Status updated to: ${req.body.status}. ${req.body.note}`,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
  }
  res.json(ret);
});

export default router;
