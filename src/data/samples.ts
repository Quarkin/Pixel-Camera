export interface SceneSample {
  id: string;
  title: string;
  category: 'Portrait' | 'Street' | 'Architecture' | 'Landscape' | 'Creator';
  aspectRatio: string;
  sourceUrl: string;
  photographer: string;
  optimalLookId: number;
  highlightReason: string;
}

export const SCENE_SAMPLES: SceneSample[] = [
  {
    id: 'golden_portrait',
    title: 'Golden Hour Portrait',
    category: 'Portrait',
    aspectRatio: '4:3',
    sourceUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Aiony Haust',
    optimalLookId: 3, // Vanilla
    highlightReason: 'Ideal for testing skin tone rendition, soft highlight bloom, and warm golden hour radiance.'
  },
  {
    id: 'tokyo_street',
    title: 'Urban Cyber Street',
    category: 'Street',
    aspectRatio: '4:3',
    sourceUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Aleksandar Pasaric',
    optimalLookId: 4, // Editorial
    highlightReason: 'Showcases rich Kodachrome cyans, moody neon reds, and deep cinematic shadow contrast.'
  },
  {
    id: 'nordic_minimal',
    title: 'Nordic Architectural Facade',
    category: 'Architecture',
    aspectRatio: '4:3',
    sourceUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Simone Hutsch',
    optimalLookId: 9, // Minimal
    highlightReason: 'Elevates geometrical lines, muted pastels, and serene Scandinavian architectural clarity.'
  },
  {
    id: 'alpine_landscape',
    title: 'Dolomites Alpine Peak',
    category: 'Landscape',
    aspectRatio: '4:3',
    sourceUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Kalpa Bhadra',
    optimalLookId: 5, // Velvet (Velvia)
    highlightReason: 'Highlights emerald alpine pines, vivid cobalt skies, and Fuji Velvia-style landscape pop.'
  },
  {
    id: 'analog_monochrome',
    title: 'Monochrome Street Geometry',
    category: 'Street',
    aspectRatio: '4:3',
    sourceUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Claudio Schwarz',
    optimalLookId: 8, // Black Tie
    highlightReason: 'Demonstrates deep dynamic range, tactile silver halide film grain, and inky zone 0 blacks.'
  },
  {
    id: 'creator_studio',
    title: 'Creator Studio Livestream',
    category: 'Creator',
    aspectRatio: '4:3',
    sourceUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    photographer: 'James Yarema',
    optimalLookId: 1, // Natural
    highlightReason: 'Perfect setting for the Creator Suite: Teleprompter overlay, live Mica VU meter, and 9:16 vertical crop.'
  }
];
