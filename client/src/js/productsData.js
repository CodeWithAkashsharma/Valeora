// Aurite Product Catalog & Science Specifications

export const PRODUCTS = [
  {
    id: "omega-3-triple",
    name: "Aurite Omega-3 Triple Strength",
    tagline: "Heart · Brain · Joints Softgels",
    category: "Vitality & Brain",
    price: 3999,
    costPrice: 1200,
    stockQty: 42,
    subscribePrice: 3399,
    rating: 4.9,
    reviewsCount: 342,
    badge: "Best Seller",
    image: "/images/omega3.jpg",
    galleryImages: ["/images/omega3.jpg", "/images/science_capsule.jpg"],
    servings: "60 Softgels (30-Day Supply)",
    description: "Pure wild-caught Icelandic fish oil concentrated with 1,200mg EPA and 900mg DHA per serving. Micro-encapsulated for zero fishy burps and maximum cellular absorption.",
    highlights: [
      "Triple-strength concentration (2,100mg active Omega-3s)",
      "Molecularly distilled & heavy-metal certified pure",
      "Sustainably sourced Friend of the Sea certified",
      "Supports cardiovascular, cognitive & joint longevity"
    ],
    supplementFacts: {
      servingSize: "2 Softgels",
      servingsPerContainer: "30",
      ingredients: [
        { name: "Total Calories", amount: "20", dv: "*" },
        { name: "Total Fat", amount: "2g", dv: "3%" },
        { name: "Wild Icelandic Fish Oil Concentrate", amount: "2,400mg", dv: "*" },
        { name: "EPA (Eicosapentaenoic Acid)", amount: "1,200mg", dv: "*" },
        { name: "DHA (Docosahexaenoic Acid)", amount: "900mg", dv: "*" },
        { name: "Other Omega-3 Fatty Acids", amount: "150mg", dv: "*" }
      ]
    }
  },
  {
    id: "magnesium-complex",
    name: "Aurite Magnesium Complex",
    tagline: "Nerve & Muscle Support with Vitamin B6",
    category: "Minerals & Sleep",
    price: 2999,
    costPrice: 850,
    stockQty: 8, // Low stock alert trigger
    subscribePrice: 2549,
    rating: 4.95,
    reviewsCount: 418,
    badge: "Clinical Formulation",
    image: "/images/magnesium.jpg",
    galleryImages: ["/images/magnesium.jpg"],
    servings: "90 Tablets (45-Day Supply)",
    description: "High-absorption triple magnesium blend (Glycinate, Malate, Citrate) enhanced with Active Vitamin B6 (P-5-P) to ease nervous tension, promote deep restorative sleep, and prevent muscle cramps.",
    highlights: [
      "Chelated Bisglycinate for 4x higher absorption vs oxide",
      "Gentle on stomach with zero laxative effect",
      "Synergistic Pyridoxal-5-Phosphate (Active Vitamin B6)",
      "Promotes GABA activation & muscle relaxation"
    ],
    supplementFacts: {
      servingSize: "2 Tablets",
      servingsPerContainer: "45",
      ingredients: [
        { name: "Vitamin B6 (as Pyridoxal-5-Phosphate)", amount: "10mg", dv: "588%" },
        { name: "Magnesium (from Bisglycinate, Malate & Citrate)", amount: "400mg", dv: "95%" },
        { name: "Elemental Glycine", amount: "300mg", dv: "*" }
      ]
    }
  },
  {
    id: "daily-greens",
    name: "Aurite Daily Wellness Greens Blend",
    tagline: "Alkalize · Energize · Restore",
    category: "Daily Greens & Gut",
    price: 4499,
    costPrice: 1400,
    stockQty: 26,
    subscribePrice: 3824,
    rating: 4.88,
    reviewsCount: 289,
    badge: "Nutraceutical",
    image: "/images/greens.jpg",
    galleryImages: ["/images/greens.jpg"],
    servings: "15 Sachets (Net Wt. 150g)",
    description: "Bioactive organic greens, clinical adaptogens, and digestive enzymes packaged in light-shielded single-serve sachets to maintain potency and taste crisp without synthetic sweetners.",
    highlights: [
      "42 organic superfoods, spirulina, chlorella & matcha",
      "Full spectrum digestive enzyme matrix",
      "Ashwagandha & Rhodiola stress resilience complex",
      "Zero artificial flavorings, stevia-fresh crisp taste"
    ],
    supplementFacts: {
      servingSize: "1 Sachet (10g)",
      servingsPerContainer: "15",
      ingredients: [
        { name: "Organic Alkalizing Greens Matrix", amount: "4,500mg", dv: "*" },
        { name: "Adaptogenic Resilience Blend", amount: "1,200mg", dv: "*" },
        { name: "Digestive Enzyme & Prebiotic Fiber", amount: "2,000mg", dv: "*" }
      ]
    }
  },
  {
    id: "synbiotic-gut",
    name: "Aurite Synbiotic Gut Restore",
    tagline: "24-Strain Microbiome & Postbiotic Matrix",
    category: "Daily Greens & Gut",
    price: 4999,
    costPrice: 1600,
    stockQty: 5, // Low stock alert trigger
    subscribePrice: 4249,
    rating: 4.96,
    reviewsCount: 512,
    badge: "Patent-Pending Tech",
    image: "/images/science_capsule.jpg",
    galleryImages: ["/images/science_capsule.jpg"],
    servings: "60 Capsule-In-Capsule (30-Day Supply)",
    description: "Dual-chamber outer capsule shields 50 Billion CFU probiotics from gastric acid, delivering 24 clinically validated strains intact directly into the lower GI tract.",
    highlights: [
      "Nested capsule-in-capsule technology (pH 7.4 targeted release)",
      "50 Billion CFU across 24 human probiotic strains",
      "Includes EpiCor postbiotic & PreforPro bacteriophage prebiotics",
      "Requires zero refrigeration (shelf-stable desiccated glass)"
    ],
    supplementFacts: {
      servingSize: "2 Capsules",
      servingsPerContainer: "30",
      ingredients: [
        { name: "Probiotic Microbiome Complex (50 Billion CFU)", amount: "350mg", dv: "*" },
        { name: "PreforPro Prebiotic Matrix", amount: "15mg", dv: "*" },
        { name: "EpiCor Postbiotic Fermentate", amount: "500mg", dv: "*" }
      ]
    }
  }
];

export const REVIEWS = [
  {
    id: 1,
    author: "Dr. Marcus Vance, M.D.",
    role: "Integrative Cardiology",
    title: "Remarkable EPA/DHA Purity & Zero Aftertaste",
    comment: "I recommend Aurite Omega-3 to my cardiovascular patients. The enteric shield technology guarantees zero reflux while maintaining therapeutic triglyceride-lowering levels.",
    rating: 5,
    product: "Omega-3 Triple Strength"
  },
  {
    id: 2,
    author: "Elena Rostova",
    role: "Biohacking Researcher",
    title: "Deepest REM Sleep Scores I've Tracked",
    comment: "My Oura ring showed a 34% increase in deep sleep duration after switching to Aurite Magnesium Bisglycinate. The P-5-P cofactor makes a noticeable difference.",
    rating: 5,
    product: "Magnesium Complex"
  },
  {
    id: 3,
    author: "David Chen",
    role: "Marathon Athlete",
    title: "Digestive Peace & Cellular Recovery",
    comment: "Synbiotic Gut Restore resolved my runner's gut issues within 10 days. Exceptional formulation quality.",
    rating: 5,
    product: "Synbiotic Gut Restore"
  }
];
