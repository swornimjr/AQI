require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Pin = require('./models/Pin');

const IMAGES = [
  'https://images.unsplash.com/photo-1691387824643-227cc84127cf?w=900&q=80',
  'https://images.unsplash.com/photo-1691387896833-dba10ea7d614?w=900&q=80',
  'https://images.unsplash.com/photo-1579967327980-2a4117da0e4a?w=900&q=80',
  'https://images.unsplash.com/photo-1706114350113-3063f27619c7?w=900&q=80',
  'https://images.unsplash.com/photo-1636045466232-539c7bd7817e?w=900&q=80',
  'https://images.unsplash.com/photo-1568899628856-f89334666546?w=900&q=80',
  'https://images.unsplash.com/photo-1610906745360-921a9e9f2215?w=900&q=80',
  'https://images.unsplash.com/photo-1602560517095-e9408456ddfb?w=900&q=80',
  'https://images.unsplash.com/photo-1578313097818-dfe8d38aa758?w=900&q=80',
  'https://images.unsplash.com/photo-1646731865705-f1b03825399d?w=900&q=80',
  'https://images.unsplash.com/photo-1655158083995-5fba782d100b?w=900&q=80',
  'https://images.unsplash.com/photo-1625581957574-98e845c238df?w=900&q=80',
  'https://images.unsplash.com/photo-1758854486633-95d4be711750?w=900&q=80',
  'https://images.unsplash.com/photo-1696964257183-78ce2a93424b?w=900&q=80',
  'https://images.unsplash.com/photo-1608044800181-134fb7f78bba?w=900&q=80',
];

const SEED_USERS = [
  {
    username: 'aqua_sensei',
    email: 'aqua_sensei@example.com',
    password: 'password123',
    bio: 'Nature Aquarium enthusiast. ADA devotee. 15 years of aquascaping.',
    currentTanks: '90P Nature Aquarium, 30C Wabi-kusa',
  },
  {
    username: 'planted_pathways',
    email: 'planted_pathways@example.com',
    password: 'password123',
    bio: 'Dutch style enthusiast. High-tech planted tanks since 2010.',
    currentTanks: '120cm Dutch showcase, 60cm Nature',
  },
  {
    username: 'jungle_scape',
    email: 'jungle_scape@example.com',
    password: 'password123',
    bio: 'Low tech, high nature. South American biotopes are my passion.',
    currentTanks: '75G Jungle Tank, 10G Nano',
  },
];

const PIN_TEMPLATES = [
  {
    imageUrl: IMAGES[0],
    title: 'ADA 90P — Wabi-sabi Morning Haze',
    description: 'A soft, misty Nature Aquarium inspired by Japanese forest floors after rain. Hemianthus carpet grown in over 8 weeks.',
    style: 'Nature Aquarium',
    tankSize: 'Medium',
    dimensions: '90 × 45 × 45 cm',
    substrate: 'ADA Aqua Soil',
    co2: 'Injected',
    flora: ['Hemianthus callitrichoides', 'Eleocharis acicularis', 'Rotala rotundifolia'],
    fauna: ['Cardinal Tetra', 'Amano Shrimp', 'Otocinclus'],
    equipment: ['ADA 90P', 'Eheim 2217', 'ADA Co2 System', 'Twinstar 900'],
    progressionStage: 'Mature',
    saves: 47,
    userIndex: 0,
  },
  {
    imageUrl: IMAGES[1],
    title: 'Minimalist Iwagumi — Zen Stone Garden',
    description: 'Classic three-stone Sanzon Iwagumi using Seiryu stone. The golden ratio rules every placement.',
    style: 'Iwagumi',
    tankSize: 'Medium',
    dimensions: '60 × 30 × 36 cm',
    substrate: 'ADA Aqua Soil',
    co2: 'Injected',
    flora: ['Hemianthus callitrichoides Cuba', 'Eleocharis sp. mini'],
    fauna: ['Neon Tetra', 'Amano Shrimp'],
    equipment: ['ADA 60P', 'Eheim Skim 350', 'CO2 Beetle Counter'],
    progressionStage: 'Growing In',
    saves: 83,
    userIndex: 0,
  },
  {
    imageUrl: IMAGES[2],
    title: 'Dutch Masterpiece — Street of Plants',
    description: 'A fully planted Dutch-style aquarium with strict row structure and contrasting leaf shapes and colors.',
    style: 'Dutch',
    tankSize: 'Large',
    dimensions: '120 × 50 × 50 cm',
    substrate: 'Dirted',
    co2: 'Injected',
    flora: ['Alternanthera reineckii', 'Rotala macrandra', 'Ludwigia arcuata', 'Hygrophila corymbosa'],
    fauna: ['Neon Tetra', 'Rummy Nose Tetra'],
    equipment: ['Fluval 406', 'Kessil A360 Tuna Sun', 'GLA CO2 System'],
    progressionStage: 'Mature',
    saves: 61,
    userIndex: 1,
  },
  {
    imageUrl: IMAGES[3],
    title: 'Amazon Basin — Wild Jungle Scape',
    description: 'An overgrown recreation of the Amazon river basin. No CO2, no ferts — nature does the work.',
    style: 'Jungle',
    tankSize: 'Large',
    dimensions: '150 × 60 × 60 cm',
    substrate: 'Dirted',
    co2: 'None',
    flora: ['Amazon Sword', 'Java Fern', 'Anubias nana', 'Bolbitis heudelotii'],
    fauna: ['Discus', 'Angelfish', 'Corydoras sterbai'],
    equipment: ['Fluval FX6', 'Fluval Plant 3.0'],
    progressionStage: 'Mature',
    saves: 39,
    userIndex: 2,
  },
  {
    imageUrl: IMAGES[4],
    title: 'Nano Forest — Hemianthus Paradise',
    description: 'A lush carpet tank in a tiny footprint. Proof that small tanks can be just as rewarding.',
    style: 'Nature Aquarium',
    tankSize: 'Nano',
    dimensions: '30 × 18 × 24 cm',
    substrate: 'ADA Aqua Soil',
    co2: 'Injected',
    flora: ['Hemianthus callitrichoides', 'Marsilea hirsuta'],
    fauna: ['Neon Tetra', 'Cherry Shrimp'],
    equipment: ['ADA Mini M', 'Lily Pipe', 'Ista CO2 Kit'],
    progressionStage: 'Growing In',
    saves: 28,
    userIndex: 0,
  },
  {
    imageUrl: IMAGES[5],
    title: 'SE Asia Biotope — Clear Mountain Stream',
    description: 'Biotope inspired by shallow mountain streams of Thailand. Every plant and fish native to the region.',
    style: 'Biotope',
    tankSize: 'Small',
    dimensions: '45 × 30 × 30 cm',
    substrate: 'Gravel',
    co2: 'None',
    flora: ['Java Fern', 'Cryptocoryne wendtii', 'Hygrophila difformis'],
    fauna: ['Ember Tetra', 'Celestial Pearl Danio', 'Otocinclus'],
    equipment: ['Tetra Whisper', 'Chihiros WRGB II 45'],
    progressionStage: 'Mature',
    saves: 19,
    userIndex: 2,
  },
  {
    imageUrl: IMAGES[6],
    title: 'Blackwater Amazon — Tannin Dream',
    description: 'Dark, moody blackwater setup with Indian almond leaves and driftwood. The fish colours absolutely pop.',
    style: 'Blackwater',
    tankSize: 'Medium',
    dimensions: '80 × 40 × 40 cm',
    substrate: 'Sand',
    co2: 'None',
    flora: ['Java Fern', 'Anubias barteri', 'Amazon Sword'],
    fauna: ['Apistogramma cacatuoides', 'Cardinal Tetra', 'Otocinclus'],
    equipment: ['Eheim Ecco Pro 300', 'Fluval Plant Nano'],
    progressionStage: 'Mature',
    saves: 54,
    userIndex: 2,
  },
  {
    imageUrl: IMAGES[7],
    title: 'Sunrise Valley — Nature Aquarium 90cm',
    description: 'Mid-ground hills of Rotala catching the warm light. This tank runs 10 hours of photoperiod daily.',
    style: 'Nature Aquarium',
    tankSize: 'Medium',
    dimensions: '90 × 45 × 45 cm',
    substrate: 'ADA Aqua Soil',
    co2: 'Injected',
    flora: ['Rotala rotundifolia', 'Hemianthus micranthemoides', 'Myriophyllum sp. Guyana'],
    fauna: ['Rummy Nose Tetra', 'Amano Shrimp'],
    equipment: ['ADA 90P', 'Eheim 2217', 'ADA Pollen Glass CO2 Diffuser'],
    progressionStage: 'Mature',
    saves: 72,
    userIndex: 0,
  },
  {
    imageUrl: IMAGES[8],
    title: 'Waterfall Paludarium — Mist Falls',
    description: 'Half underwater, half above. The waterfall runs over spider wood into a planted underwater section.',
    style: 'Paludarium',
    tankSize: 'Medium',
    dimensions: '60 × 45 × 60 cm',
    substrate: 'Mixed',
    co2: 'Injected',
    flora: ['Hydrocotyle tripartita', 'Fissidens fontanus', 'Mini Java Fern', 'Pothos'],
    fauna: ['Red Cherry Shrimp', 'Vampire Crab'],
    equipment: ['Custom waterfall pump', 'Mist maker', 'Kessil A80 Tuna Sun'],
    progressionStage: 'Growing In',
    saves: 96,
    userIndex: 1,
  },
  {
    imageUrl: IMAGES[9],
    title: 'Ryuoh Stone Iwagumi — 120P',
    description: 'Large-scale Iwagumi using premium Ryuoh stone. Six months from initial setup to this shot.',
    style: 'Iwagumi',
    tankSize: 'Large',
    dimensions: '120 × 45 × 45 cm',
    substrate: 'ADA Aqua Soil',
    co2: 'Injected',
    flora: ['Eleocharis acicularis', 'Hemianthus callitrichoides'],
    fauna: ['Neon Tetra', 'Amano Shrimp'],
    equipment: ['ADA 120P', 'Eheim 2260', 'ADA Co2 System 74-ES'],
    progressionStage: 'Mature',
    saves: 114,
    userIndex: 0,
  },
  {
    imageUrl: IMAGES[10],
    title: 'Classic Dutch Showcase — 80cm',
    description: 'Strict Dutch layout with a focal point of red Alternanthera. Every stem planted ruler-straight.',
    style: 'Dutch',
    tankSize: 'Medium',
    dimensions: '80 × 35 × 45 cm',
    substrate: 'Dirted',
    co2: 'Injected',
    flora: ['Limnophila sessiliflora', 'Rotala indica', 'Hygrophila polysperma', 'Alternanthera reineckii mini'],
    fauna: ['Rummy Nose Tetra', 'Cardinal Tetra'],
    equipment: ['Fluval 307', 'Beamswork DA FSPEC 80cm'],
    progressionStage: 'Mature',
    saves: 43,
    userIndex: 1,
  },
  {
    imageUrl: IMAGES[11],
    title: 'Misty Mountain — 120P Nature Aquarium',
    description: 'Inspired by the mountains of Guilin, China. The moss on driftwood took 4 months to establish.',
    style: 'Nature Aquarium',
    tankSize: 'Large',
    dimensions: '120 × 45 × 45 cm',
    substrate: 'ADA Aqua Soil',
    co2: 'Injected',
    flora: ['Microsorum pteropus', 'Anubias petite', 'Fissidens fontanus', 'Bolbitis heudelotii'],
    fauna: ['Cardinal Tetra', 'Amano Shrimp', 'Otocinclus'],
    equipment: ['Eheim 2260', 'Kessil A360X Tuna Sun', 'ADA Co2 System'],
    progressionStage: 'Mature',
    saves: 88,
    userIndex: 0,
  },
  {
    imageUrl: IMAGES[12],
    title: 'Nano Jungle Cube — 20L',
    description: 'Dense jungle feel packed into a 20 litre cube. Bucephalandra is the star of this setup.',
    style: 'Jungle',
    tankSize: 'Nano',
    dimensions: '25 × 25 × 32 cm',
    substrate: 'Mixed',
    co2: 'Excel/Liquid',
    flora: ['Bucephalandra wavy green', 'Anubias nana petite', 'Cryptocoryne pygmaea'],
    fauna: ['Neon Tetra', 'Crystal Red Shrimp'],
    equipment: ['Aquael Pat Mini', 'Chihiros A301 Plus'],
    progressionStage: 'Growing In',
    saves: 31,
    userIndex: 2,
  },
  {
    imageUrl: IMAGES[13],
    title: 'Low Tech Walstad — Community Garden',
    description: 'No CO2, no ferts, no filter. Diana Walstad method using potting mix under gravel. Running 2 years stable.',
    style: 'Nature Aquarium',
    tankSize: 'Small',
    dimensions: '60 × 30 × 36 cm',
    substrate: 'Dirted',
    co2: 'None',
    flora: ['Cryptocoryne wendtii', 'Java Fern', 'Vallisneria nana'],
    fauna: ["Endler's Livebearer", 'Kuhli Loach', 'Mystery Snail'],
    equipment: ['Sponge filter', 'Nicrew LED 60'],
    progressionStage: 'Mature',
    saves: 22,
    userIndex: 2,
  },
  {
    imageUrl: IMAGES[14],
    title: 'Sanzon Iwagumi — Three Pillars of Stone',
    description: 'Perfect golden-ratio stone placement with a wall-to-wall HC Cuba carpet. Contest-ready.',
    style: 'Iwagumi',
    tankSize: 'Medium',
    dimensions: '60 × 30 × 36 cm',
    substrate: 'ADA Aqua Soil',
    co2: 'Injected',
    flora: ['Hemianthus callitrichoides Cuba', 'Eleocharis sp. mini'],
    fauna: ['Celestial Pearl Danio', 'Amano Shrimp'],
    equipment: ['ADA 60P', 'Eheim 2213', 'Ista Max Mix CO2 Reactor'],
    progressionStage: 'Mature',
    saves: 67,
    userIndex: 0,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const userDocs = [];
  for (const u of SEED_USERS) {
    let existing = await User.findOne({ username: u.username });
    if (!existing) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      existing = await User.create({ username: u.username, email: u.email, passwordHash, bio: u.bio, currentTanks: u.currentTanks });
      console.log(`Created user: ${u.username}`);
    } else {
      console.log(`User already exists: ${u.username}`);
    }
    userDocs.push(existing);
  }

  let inserted = 0;
  for (const p of PIN_TEMPLATES) {
    const creator = userDocs[p.userIndex]._id;
    const exists = await Pin.findOne({ title: p.title });
    if (!exists) {
      await Pin.create({ ...p, creator, userIndex: undefined });
      inserted++;
    }
  }

  console.log(`Seeded ${inserted} new pins (${PIN_TEMPLATES.length - inserted} already existed)`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
