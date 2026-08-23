import express from 'express';

const router = express.Router();

let products = [
  {
    id: 'prod-magnesium',
    name: 'Aurite High-Absorption Magnesium Glycinate Complex',
    category: 'Vitality & Brain',
    price: 1899,
    rating: 4.9,
    reviewCount: 412,
    stock: 145,
    highlights: [
      'Chelated Magnesium Bisglycinate for 99.4% gentle absorption',
      'Infused with Vitamin B6 (P-5-P) for neurotransmitter synthesis',
      'Zero laxative distress; promotes deep, restorative REM sleep',
      'Third-party HPLC tested for heavy metal purity & potency'
    ]
  },
  {
    id: 'prod-omega3',
    name: 'Aurite Ultra-Pure Triple-Strength Omega-3 Triglycerides',
    category: 'Heart & Longevity',
    price: 2499,
    rating: 4.85,
    reviewCount: 388,
    stock: 82,
    highlights: [
      '1,200mg Total Omega-3s with 800mg EPA & 400mg DHA',
      'Molecularly distilled wild-caught deep-sea Norwegian fish oil',
      'Enteric-coated with organic sweet orange oil to prevent fishy burps',
      'Certified IFOS 5-Star for low oxidation (TOTOX < 5)'
    ]
  },
  {
    id: 'prod-greens',
    name: 'Aurite Daily Phyto-Nutrient Super Greens & Probiotics',
    category: 'Digestion & Gut',
    price: 2199,
    rating: 4.8,
    reviewCount: 295,
    stock: 210,
    highlights: [
      '38 Certified Organic raw superfoods, alkalizing greens & adaptogens',
      '10 Billion CFU multi-strain spore probiotics with prebiotic inulin',
      'Comprehensive digestive enzyme matrix (Bromelain, Papain, Amylase)',
      'Subtle natural green apple & organic peppermint leaf taste'
    ]
  }
];

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
