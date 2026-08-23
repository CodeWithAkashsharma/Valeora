import express from 'express';

const router = express.Router();

// Mock in-memory user store for demo/manual development
let users = [
  { id: 'usr-1', name: 'Akash Sharma', email: 'akash@example.com', phone: '+91 98765 43210', address: 'B-402, Green Glen Layout, Bellandur, Bengaluru 560103', role: 'user', isBlocked: false },
  { id: 'usr-2', name: 'Dr. Priya Sharma', email: 'priya.s@techcorp.io', phone: '+91 98111 22334', address: '12-A, Cyber Hills, Gachibowli, Hyderabad 500032', role: 'user', isBlocked: false }
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Admin check
  if (email === 'admin@aurite.com' && password === 'admin123') {
    return res.json({
      user: { id: 'admin-1', name: 'Aurite Administrator', email: 'admin@aurite.com', role: 'admin' },
      token: 'mock-jwt-admin-token'
    });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials or user not found' });
  }
  if (user.isBlocked) {
    return res.status(403).json({ error: 'Your account has been suspended by administration.' });
  }

  res.json({ user, token: `mock-jwt-token-${user.id}` });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, phone, password, address } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'User with this email already registered' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    address: address || '',
    role: 'user',
    isBlocked: false
  };
  users.push(newUser);

  res.status(201).json({ user: newUser, token: `mock-jwt-token-${newUser.id}` });
});

// POST /api/auth/send-otp
router.post('/send-otp', (req, res) => {
  const { phone } = req.body;
  const demoOtp = '849201';
  res.json({ message: 'OTP sent successfully', phone, demoOtp });
});

// GET /api/auth/users (Admin only)
router.get('/users', (req, res) => {
  res.json(users);
});

// POST /api/auth/toggle-block/:id (Admin only)
router.post('/toggle-block/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.isBlocked = !user.isBlocked;
  res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
});

export default router;
