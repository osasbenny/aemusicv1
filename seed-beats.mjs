import { drizzle } from 'drizzle-orm/mysql2';
import { beats } from './drizzle/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const dummyBeats = [
  {
    title: "Midnight Vibes",
    genre: "Hip Hop",
    mood: "Dark",
    bpm: 85,
    price: 2999, // $29.99
    audioFileKey: "demo/midnight-vibes.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    licenseType: "Basic",
    description: "Dark atmospheric hip hop beat with heavy 808s and melodic keys"
  },
  {
    title: "Summer Bounce",
    genre: "Pop",
    mood: "Energetic",
    bpm: 128,
    price: 3999, // $39.99
    audioFileKey: "demo/summer-bounce.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    licenseType: "Premium",
    description: "Upbeat pop instrumental with catchy melodies and bright synths"
  },
  {
    title: "Trap Anthem",
    genre: "Trap",
    mood: "Aggressive",
    bpm: 140,
    price: 4999, // $49.99
    audioFileKey: "demo/trap-anthem.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    licenseType: "Exclusive",
    description: "Hard-hitting trap beat with rolling hi-hats and booming bass"
  },
  {
    title: "Lo-Fi Dreams",
    genre: "Lo-Fi",
    mood: "Chill",
    bpm: 75,
    price: 1999, // $19.99
    audioFileKey: "demo/lofi-dreams.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    licenseType: "Basic",
    description: "Relaxing lo-fi beat with vinyl crackle and jazzy chords"
  },
  {
    title: "R&B Smooth",
    genre: "R&B",
    mood: "Smooth",
    bpm: 90,
    price: 3499, // $34.99
    audioFileKey: "demo/rnb-smooth.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    licenseType: "Premium",
    description: "Smooth R&B instrumental with soulful keys and tight drums"
  },
  {
    title: "Electronic Pulse",
    genre: "Electronic",
    mood: "Energetic",
    bpm: 125,
    price: 2999, // $29.99
    audioFileKey: "demo/electronic-pulse.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    licenseType: "Basic",
    description: "Electronic dance beat with pulsing synths and driving rhythm"
  },
  {
    title: "Drill Intensity",
    genre: "Drill",
    mood: "Aggressive",
    bpm: 145,
    price: 4499, // $44.99
    audioFileKey: "demo/drill-intensity.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    licenseType: "Premium",
    description: "Intense drill beat with sliding 808s and dark piano melodies"
  },
  {
    title: "Afrobeat Groove",
    genre: "Afrobeat",
    mood: "Uplifting",
    bpm: 110,
    price: 3999, // $39.99
    audioFileKey: "demo/afrobeat-groove.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    licenseType: "Premium",
    description: "Infectious afrobeat rhythm with percussion and melodic guitars"
  },
  {
    title: "Boom Bap Classic",
    genre: "Hip Hop",
    mood: "Nostalgic",
    bpm: 92,
    price: 2499, // $24.99
    audioFileKey: "demo/boom-bap-classic.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    licenseType: "Basic",
    description: "Classic boom bap beat with dusty samples and punchy drums"
  },
  {
    title: "Future Bass Wave",
    genre: "Electronic",
    mood: "Uplifting",
    bpm: 150,
    price: 3499, // $34.99
    audioFileKey: "demo/future-bass-wave.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    licenseType: "Premium",
    description: "Modern future bass with lush chords and powerful drops"
  },
  {
    title: "Ambient Escape",
    genre: "Ambient",
    mood: "Chill",
    bpm: 65,
    price: 1999, // $19.99
    audioFileKey: "demo/ambient-escape.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    licenseType: "Basic",
    description: "Atmospheric ambient soundscape perfect for meditation"
  },
  {
    title: "Reggaeton Fire",
    genre: "Reggaeton",
    mood: "Energetic",
    bpm: 95,
    price: 3999, // $39.99
    audioFileKey: "demo/reggaeton-fire.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    licenseType: "Premium",
    description: "Hot reggaeton beat with dembow rhythm and latin flavor"
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }

    const db = drizzle(process.env.DATABASE_URL);
    
    console.log('📝 Inserting dummy beats...');
    
    for (const beat of dummyBeats) {
      await db.insert(beats).values(beat);
      console.log(`   ✓ Added: ${beat.title}`);
    }
    
    console.log(`\n✅ Successfully seeded ${dummyBeats.length} beats!`);
    console.log('🎵 Your beat store is now populated with sample content.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
