/**
 * FESTPASS - CAMPUS EVENT DATABASE
 * Curated college events, hackathons, and cultural festivals
 */

const CAMPUS_EVENTS = [
  {
    id: "ev-hackmumbai",
    title: "HackMumbai 2026 — 24H National Hackathon",
    category: "hackathons",
    college: "University of Mumbai Campus",
    date: "March 28, 2026",
    time: "09:00 AM IST",
    venue: "Main Auditorium, Kalina Campus, Mumbai",
    price: 0, // Free entry
    originalPrice: 0,
    seatsTotal: 300,
    seatsRemaining: 24,
    badge: "🔥 Fast Filling",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=700&auto=format&fit=crop&q=80",
    description: "24-hour non-stop code sprint bringing together 300+ top student developers to build AI, Web3, and Open Source solutions with ₹1,50,000 in cash prizes."
  },
  {
    id: "ev-aurafest",
    title: "Aura 2026 — Battle of the Bands & EDM Night",
    category: "cultural",
    college: "St. Xavier's & MU Arts Council",
    date: "April 04, 2026",
    time: "05:30 PM IST",
    venue: "Open Air Amphitheatre, South Mumbai",
    price: 199,
    originalPrice: 349,
    seatsTotal: 1200,
    seatsRemaining: 85,
    badge: "⭐ Headline Event",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&auto=format&fit=crop&q=80",
    description: "The biggest inter-college cultural fest in Mumbai featuring 12 indie rock bands, celebrity DJ EDM night, food trucks, and light installations."
  },
  {
    id: "ev-esports",
    title: "Campus Clash — Valorant & BGMI Championship",
    category: "gaming",
    college: "Mumbai Tech Gaming League",
    date: "April 11, 2026",
    time: "11:00 AM IST",
    venue: "eSports Arena & Live Stream Lounge",
    price: 99,
    originalPrice: 199,
    seatsTotal: 160,
    seatsRemaining: 18,
    badge: "🎮 5v5 Tournament",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80",
    description: "Inter-collegiate 5v5 Valorant and BGMI tournament with high-refresh display booths, live shoutcasters, and team trophy pool."
  },
  {
    id: "ev-robowars",
    title: "RoboWars 2026 — 15kg & 30kg Combat Arena",
    category: "tech",
    college: "Robotics & Innovation Cell",
    date: "April 18, 2026",
    time: "10:00 AM IST",
    venue: "Mechanical Workshop & Arena, Kurla",
    price: 0,
    originalPrice: 0,
    seatsTotal: 450,
    seatsRemaining: 42,
    badge: "⚡ High Octane",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=700&auto=format&fit=crop&q=80",
    description: "Full-contact combat robotics competition inside reinforced bulletproof glass enclosure. Watch custom-engineered battlebots clash with flippers and spinning blades."
  },
  {
    id: "ev-ai-summit",
    title: "NextDev — Full-Stack Web & GenAI Summit",
    category: "workshops",
    college: "Google Developer Groups Mumbai",
    date: "April 25, 2026",
    time: "01:30 PM IST",
    venue: "Seminar Hall 3, Tech Faculty Complex",
    price: 49,
    originalPrice: 149,
    seatsTotal: 250,
    seatsRemaining: 31,
    badge: "💻 Hands-On",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&auto=format&fit=crop&q=80",
    description: "Deep-dive workshops on React 19, Gemini AI SDK integration, and modern cloud deployment architectures led by senior industry engineers."
  },
  {
    id: "ev-streetdance",
    title: "StepUp — Inter-College Hip-Hop & Cypher",
    category: "cultural",
    college: "Mumbai Youth Cultural Union",
    date: "May 02, 2026",
    time: "04:00 PM IST",
    venue: "Central Quadrangle, Bandra",
    price: 99,
    originalPrice: 149,
    seatsTotal: 500,
    seatsRemaining: 94,
    badge: "🏆 1v1 Battles",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=700&auto=format&fit=crop&q=80",
    description: "High-energy 1v1 street dance, popping, and breaking cyphers judged by international dance choreographers with live beatboxing."
  }
];
