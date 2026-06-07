export const brand = {
  name: "Transformers",
  fullName: "Transformers Unisex Salon & Beauty Atelier",
  tagline: "Create your own style",
  promise: "Step in. Feel the transformation.",
  phonePrimary: "8825700807",
  phoneSecondary: "9600450807",
  whatsapp: "8825700807",
  email: "transformerssalon777@gmail.com",
  website: "transformerssalon.in",
  instagram: "transformers_unisex_salon",
  address: "No 5, Iyyanar Kovil Street, Pillaithottam, Puducherry - 605013",
  mapsQuery: "No 5, Iyyanar Kovil Street, Pillaithottam, Puducherry 605013",
};

export const brandAssets = {
  logoWide: "/brand/brand-logo-wide.jpeg",
  mascot: "/brand/fox-mascot.png",
  foxLogo: "/brand/fox-logo.png",
  grandOpening: "/brand/grand-opening.jpeg",
  contactCard: "/brand/contact-card.jpeg",
};

export const serviceCategories = [
  {
    id: "men",
    name: "Men",
    description: "Sharp grooming, clean detailing, and confident finishing.",
  },
  {
    id: "women",
    name: "Women",
    description: "Hair artistry, skin rituals, bridal glow, and occasion styling.",
  },
];

export const services = [
  { id: "men-haircuts", category: "men", name: "Haircuts", description: "Precision cuts shaped for face, texture, and daily styling." },
  { id: "men-beard", category: "men", name: "Beard Styling", description: "Line work, trimming, shaping, and polished beard finishes." },
  { id: "men-color", category: "men", name: "Hair Coloring", description: "Global color, touch-ups, and tone-led transformations." },
  { id: "men-spa", category: "men", name: "Hair Spa", description: "Repair-focused rituals for scalp comfort and stronger-looking hair." },
  { id: "men-facial", category: "men", name: "Facial", description: "Skin reset experiences for freshness, texture, and glow." },
  { id: "women-haircuts", category: "women", name: "Haircuts", description: "Classic and creative shapes with salon-finished movement." },
  { id: "women-styling", category: "women", name: "Hair Styling", description: "Blowouts, event styling, waves, and polished occasion looks." },
  { id: "women-color", category: "women", name: "Hair Coloring", description: "Gloss, root touch-up, global color, and dimensional color work." },
  { id: "women-keratin", category: "women", name: "Keratin", description: "Smooth, refined hair rituals designed for lasting manageability." },
  { id: "women-smoothening", category: "women", name: "Smoothening", description: "Frizz-control transformations with a luxury finishing experience." },
  { id: "women-makeup", category: "women", name: "Makeup", description: "Soft glam, party makeup, and camera-ready beauty artistry." },
  { id: "women-bridal", category: "women", name: "Bridal Makeup", description: "Bridal beauty direction from skin prep to final veil-ready detail." },
  { id: "women-facial", category: "women", name: "Facial", description: "Glow rituals for hydration, clarity, and a fresh complexion." },
];

export const offers = [
  {
    id: "grand-opening",
    title: "Grand Opening Transformation Offer",
    description: "A launch-season salon experience curated across hair, beard, facial, and beauty rituals.",
    expiryLabel: "Limited period",
    image: brandAssets.grandOpening,
  },
  {
    id: "combo-rituals",
    title: "Combo Rituals",
    description: "Bundled grooming and beauty experiences for guests who want a complete refresh.",
    expiryLabel: "Ask in salon",
    image: brandAssets.mascot,
  },
];

export const gallery = [
  { id: "mascot", title: "Fox mascot identity", image: brandAssets.mascot, category: "Brand" },
  { id: "wordmark", title: "Transformers salon mark", image: brandAssets.logoWide, category: "Brand" },
  { id: "opening", title: "Grand opening creative", image: brandAssets.grandOpening, category: "Campaign" },
  { id: "contact", title: "Contact identity card", image: brandAssets.contactCard, category: "Contact" },
];

export const businessHours = [
  { day: "Monday - Saturday", hours: "9:00 AM - 9:00 PM" },
  { day: "Sunday", hours: "10:00 AM - 7:00 PM" },
];
