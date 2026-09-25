// Valeora Fine Fashion Jewelry Catalog Configuration
// Real live products are loaded directly from the Firestore Database

export const PRODUCTS = [];

export const REVIEWS = [];

export const CATEGORIES = [
  { id: "all", name: "All Jewelry", count: 0 },
  { id: "Necklaces", name: "Necklaces & Pendants", count: 0 },
  { id: "Rings", name: "Rings & Solitaires", count: 0 },
  { id: "Bracelets", name: "Bracelets & Bangles", count: 0 },
  { id: "Chains", name: "Chains & Links", count: 0 },
  { id: "Earrings", name: "Chandelier Drop Earrings", count: 0 }
];

export const SUBCATEGORIES_CONFIG = {
  men: [
    { id: "all", name: "All" },
    { id: "Chains", name: "Chains" },
    { id: "Hand Chains", name: "Hand Chains" },
    { id: "Bracelets", name: "Bracelets" }
  ],
  women: [
    { id: "all", name: "All" },
    { id: "Rings", name: "Rings" },
    { id: "Necklace", name: "Necklace" },
    { id: "Pendant", name: "Pendant" },
    { id: "Earrings", name: "Earrings" },
    { id: "Bracelets", name: "Bracelets" }
  ],
  all: [
    { id: "all", name: "All" },
    { id: "Rings", name: "Rings" },
    { id: "Necklace", name: "Necklace" },
    { id: "Pendant", name: "Pendant" },
    { id: "Earrings", name: "Earrings" },
    { id: "Bracelets", name: "Bracelets" },
    { id: "Chains", name: "Chains" },
    { id: "Hand Chains", name: "Hand Chains" }
  ]
};

export const AUDIENCES = [
  { id: "all", name: "All Options" },
  { id: "her", name: "For Her" },
  { id: "him", name: "For Men" },
  { id: "all-unisex", name: "For Everyone" }
];
