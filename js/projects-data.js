/* Jade Group — project data
   One entry per project. Copy sourced from jadegroup.mu.
   location/floors may be null → the field is hidden on the detail page.
   images is optional; when present it contains local project photography. */

window.JADE_PROJECTS = [
  /* ---------- Offices ---------- */
  {
    slug: "alexander-house",
    name: "Alexander House",
    category: "Offices",
    location: "35 Cybercity, Ebène",
    floors: "Ground + 4 floors",
    blurb: "Among the first buildings built in Ebène — the fine touch of Jade Group in the Cybercity.",
    body: "Alexander House is the fine touch of the Jade Group in the Ebène Cybercity. Its unique concept and architectural style create a charming sanctuary within the area, all contributing to an efficient yet pleasant office environment. It is also home to Jade Group's own offices.",
    features: ["On-site parking", "24/7 security & CCTV", "Parking attendant", "Access control", "Building Manager & maintenance team", "Generators and lifts"],
    images: ["img/projects/alexander-house-night.jpg", "img/projects/alexander-house-2.jpg"]
  },
  {
    slug: "barclays-house",
    name: "Barclays House",
    category: "Offices",
    location: "Ebène Cybercity",
    floors: "Ground + 6 floors",
    blurb: "Also known as Jade Tower — home to the Barclays Bank Ltd. head office.",
    body: null,
    features: null,
    images: ["img/projects/barclays-house.jpg", "img/projects/barclays-house-2.jpg"]
  },
  {
    slug: "raffles-tower",
    name: "Raffles Tower",
    category: "Offices",
    location: "Ebène Cybercity",
    floors: "Ground + 12 floors",
    blurb: "A modern tower overlooking the motorway and Ebène — today known as Standard Chartered Tower.",
    body: null,
    features: null,
    images: ["img/projects/raffles-tower.jpg", "img/projects/raffles-tower-2.jpg"]
  },
  {
    slug: "st-james-court",
    name: "St. James Court",
    category: "Offices",
    location: null,
    floors: "Ground + 8 floors",
    blurb: "A very spacious and well-located office building.",
    body: null,
    features: null,
    images: ["img/projects/st-james-court.jpg", "img/projects/st-james-court-2.jpg"]
  },
  {
    slug: "fon-sing-building",
    name: "Fon Sing Building",
    category: "Offices",
    location: "Edith Cavell Street, Port Louis",
    floors: "Ground + 6 floors",
    blurb: "An established landmark in Edith Cavell Street.",
    body: null,
    features: null
  },
  {
    slug: "jade-house",
    name: "Jade House",
    category: "Offices",
    location: null,
    floors: "Ground + 3 floors",
    blurb: "Commercial units on the ground floor, offices on the three floors above.",
    body: null,
    features: null
  },
  {
    slug: "jade-court",
    name: "Jade Court",
    category: "Offices",
    location: null,
    floors: "Ground + 6 floors",
    blurb: "A mix of commercial and office space.",
    body: null,
    features: null
  },
  {
    slug: "moorgate-house",
    name: "Moorgate House",
    category: "Offices",
    location: "Port Louis",
    floors: "Ground + 10 floors",
    blurb: "Located in the heart of the business area of Port Louis.",
    body: null,
    features: null,
    images: ["img/projects/moorgate-house.jpg", "img/projects/moorgate-house-2.jpg"]
  },
  {
    slug: "chancery-house",
    name: "Chancery House",
    category: "Offices",
    location: null,
    floors: "Ground + 7 floors",
    blurb: "A favourite among lawyers, with plenty of atrium space.",
    body: null,
    features: null
  },
  {
    slug: "lancaster-court",
    name: "Lancaster Court",
    category: "Offices",
    location: null,
    floors: "Ground + first floor",
    blurb: "A quiet but central location.",
    body: null,
    features: null
  },
  {
    slug: "pcl-building",
    name: "PCL Building",
    category: "Offices",
    location: null,
    floors: "Ground + 6 floors",
    blurb: "A good location close to the main Government Office.",
    body: null,
    features: null
  },
  {
    slug: "tn-tower",
    name: "TN Tower",
    category: "Offices",
    location: null,
    floors: null,
    blurb: "Details on request.",
    body: null,
    features: null
  },

  /* ---------- Commercial ---------- */
  {
    slug: "le-manhattan",
    name: "Le Manhattan",
    category: "Commercial",
    location: "Curepipe",
    floors: "Ground + 2 floors",
    blurb: "A leisure and commercial complex in Curepipe.",
    body: null,
    features: null,
    images: ["img/projects/le-manhattan.jpg"]
  },
  {
    slug: "orchard-center",
    name: "Orchard Center",
    category: "Commercial",
    location: null,
    floors: "Ground + 2 floors",
    blurb: "A very popular commercial complex with over 130 units.",
    body: null,
    features: null,
    images: ["img/projects/orchard-center.jpg"]
  },
  {
    slug: "le-windsor",
    name: "Le Windsor",
    category: "Commercial",
    location: null,
    floors: "Ground + 2 floors",
    blurb: "An accessible and practical stop for locals — a mix of commercial and office space.",
    body: null,
    features: null
  },
  {
    slug: "galeries-evershine",
    name: "Galeries Evershine",
    category: "Commercial",
    location: null,
    floors: "Ground + 2 floors",
    blurb: "A commercial complex over three levels.",
    body: null,
    features: null
  },
  {
    slug: "courts-warehouse",
    name: "Courts Warehouse",
    category: "Commercial",
    location: "Central Plaines Wilhems",
    floors: null,
    blurb: "A tailor-made warehouse for Courts.",
    body: null,
    features: null
  },
  {
    slug: "galeries-st-ignace",
    name: "Galeries St Ignace",
    category: "Commercial",
    location: "Rose Hill",
    floors: "Ground + 4 floors",
    blurb: "Well located in Rose Hill, offering a mix of office and commercial space.",
    body: null,
    features: null
  },
  {
    slug: "arcades-cliderlex",
    name: "Arcades Cliderlex",
    category: "Commercial",
    location: null,
    floors: "Ground + 5 floors",
    blurb: "A mixture of residential, office and commercial units.",
    body: null,
    features: null
  },

  /* ---------- Residential ---------- */
  {
    slug: "orchard-towers",
    name: "Orchard Towers",
    category: "Residential",
    location: null,
    floors: "10 floors",
    blurb: "Annexed to the commercial complex of Orchard Centre.",
    body: null,
    features: null,
    images: ["img/projects/orchard-towers.jpg"]
  },
  {
    slug: "florian-view",
    name: "Florian View",
    category: "Residential",
    location: null,
    floors: "Ground + 8 floors",
    blurb: "Residential apartments over nine levels.",
    body: null,
    features: null
  },
  {
    slug: "residence-beau-soleil",
    name: "Residence Beau Soleil",
    category: "Residential",
    location: null,
    floors: null,
    blurb: "A bungalow atmosphere with all the residential comfort.",
    body: null,
    features: null
  },
  {
    slug: "residence-la-croisette",
    name: "Residence la Croisette",
    category: "Residential",
    location: "West Coast",
    floors: null,
    blurb: "An exclusive view of the West Coast sea for day-long enjoyment of the landscape.",
    body: "Residence La Croisette offers an exclusive view of the West Coast sea for a day-long enjoyment of the landscape. The distinctive stone-cladded entrance wall provides a welcoming and well-presented gated residence within which lives a harmonious community.",
    features: null,
    images: ["img/projects/residence-la-croisette.jpg"]
  },

  /* ---------- Land Parceling ---------- */
  {
    slug: "residence-trianon",
    name: "RiverEdge Trianon",
    category: "Land Parceling",
    location: "Trianon",
    floors: null,
    blurb: "A popular area close to tennis courts, commercial areas and Ebène Cybercity.",
    body: null,
    features: null,
    images: ["img/projects/riveredge-trianon.jpg"]
  },
  {
    slug: "domaine-du-mesnil",
    name: "Domaine du Mesnil",
    category: "Land Parceling",
    location: "Trianon",
    floors: null,
    blurb: "Spacious plots of land with easy access to the Trianon commercial areas and Ebène Cybercity.",
    body: null,
    features: null
  },
  {
    slug: "splendid-village",
    name: "Splendid Village",
    category: "Land Parceling",
    location: null,
    floors: null,
    blurb: "A wide selection for all budgets — bungalows, villas and houses.",
    body: null,
    features: null
  },
  {
    slug: "morcellement-bambous",
    name: "Morcellement Bambous",
    category: "Land Parceling",
    location: "Bambous",
    floors: null,
    blurb: "An accessible riverside development.",
    body: null,
    features: null
  },

  /* ---------- Upcoming ---------- */
  {
    slug: "burford-house",
    name: "Burford House",
    category: "Upcoming",
    location: "Cybercity, Ebène",
    floors: "6 storeys",
    blurb: "An exclusive new luxurious and modern office building with ample facilities.",
    body: "An exclusive new luxurious and modern office building of six storeys with ample facilities is under way — from the promoters of Raffles Tower, Barclays House and Alexander House.",
    features: null,
    images: ["img/projects/burford-house.jpg"]
  },
  {
    slug: "kingsgate-tower",
    name: "Kingsgate Tower",
    category: "Upcoming",
    location: "Cybercity, Ebène",
    floors: null,
    blurb: "Details to be announced.",
    body: null,
    features: null,
    images: ["img/projects/kingsgate-tower.jpg"]
  }
];
