export interface CameraLook {
  id: number;
  codename: string;
  name: string;
  tagline: string;
  description: string;
  badgeColor: string;
  accentColor: string;
  contrast: number; // 1.0 is default
  saturation: number; // 1.0 is default
  brightness: number; // 1.0 is default
  sepia: number; // 0 to 1
  hueRotate: number; // degrees
  grainIntensity: number; // 0 to 1
  vignette: number; // 0 to 1
  tint: string; // rgba tint overlay
  warmth: number; // Kelvin shift representation (-50 to +50)
  highlightRollOff: string;
  shadowDepth: string;
}

export const CAMERA_LOOKS: CameraLook[] = [
  {
    id: 0,
    codename: 'sauce_default_label',
    name: 'Original',
    tagline: 'Google HDR+ Computational Baseline',
    description: "Google's classic, true-to-life HDR+ computational look. Neutral color matrix, balanced shadow recovery, and zero post-processing color bias.",
    badgeColor: '#4285F4',
    accentColor: '#8ab4f8',
    contrast: 1.05,
    saturation: 1.02,
    brightness: 1.0,
    sepia: 0,
    hueRotate: 0,
    grainIntensity: 0.05,
    vignette: 0.0,
    tint: 'rgba(0, 0, 0, 0)',
    warmth: 0,
    highlightRollOff: 'Strict linear HDR roll-off preserving sky details',
    shadowDepth: 'Computational shadow fill (+1.2 EV)'
  },
  {
    id: 1,
    codename: 'sauce_natural_label',
    name: 'Natural',
    tagline: 'Restrained Saturation & Soft Skin Tones',
    description: 'Subtle contrast softening, authentic portrait skin tone preservation, and gentle highlight bloom without harsh digital edge sharpening.',
    badgeColor: '#34A853',
    accentColor: '#81c995',
    contrast: 0.95,
    saturation: 0.92,
    brightness: 1.02,
    sepia: 0.03,
    hueRotate: 2,
    grainIntensity: 0.08,
    vignette: 0.05,
    tint: 'rgba(255, 248, 240, 0.04)',
    warmth: 8,
    highlightRollOff: 'Soft organic highlight compression',
    shadowDepth: 'Lifted low-midtones for flattering skin gradations'
  },
  {
    id: 2,
    codename: 'sauce_shadows_label',
    name: 'Shadows',
    tagline: 'Moody Cinematic Blacks & High Dynamic Contrast',
    description: 'Deepened, cinematic blacks and punchy moody contrast. Darkens low-end stops while preserving pristine specular highlights for high drama.',
    badgeColor: '#5F6368',
    accentColor: '#bdc1c6',
    contrast: 1.25,
    saturation: 1.08,
    brightness: 0.94,
    sepia: 0.02,
    hueRotate: -4,
    grainIntensity: 0.15,
    vignette: 0.22,
    tint: 'rgba(10, 20, 30, 0.08)',
    warmth: -6,
    highlightRollOff: 'High micro-contrast with specular protection',
    shadowDepth: 'Crushed sub-shadows below 5% IRE'
  },
  {
    id: 3,
    codename: 'sauce_orange_label',
    name: 'Vanilla',
    tagline: 'Golden Hour Radiance & Amber Glow',
    description: 'Warm, golden-hour radiance with soft ambient highlights and amber sunset tone curves reminiscent of vintage coated cinema lenses.',
    badgeColor: '#FBBC04',
    accentColor: '#fdd663',
    contrast: 1.08,
    saturation: 1.15,
    brightness: 1.04,
    sepia: 0.16,
    hueRotate: 8,
    grainIntensity: 0.1,
    vignette: 0.12,
    tint: 'rgba(255, 180, 50, 0.12)',
    warmth: 32,
    highlightRollOff: 'Warm golden highlight dispersion',
    shadowDepth: 'Warm honey tinted shadow floor'
  },
  {
    id: 4,
    codename: 'sauce_kodachrome_label',
    name: 'Editorial',
    tagline: 'Rich Kodachrome Colors & Magazine Contrast',
    description: 'Iconic Kodachrome-inspired magazine colors and punchy contrast. Deep primary reds, rich cyans, and velvety mid-tone presence for high-fashion editorial.',
    badgeColor: '#EA4335',
    accentColor: '#f28b82',
    contrast: 1.2,
    saturation: 1.22,
    brightness: 0.98,
    sepia: 0.06,
    hueRotate: -6,
    grainIntensity: 0.18,
    vignette: 0.16,
    tint: 'rgba(220, 80, 40, 0.07)',
    warmth: 12,
    highlightRollOff: 'Crisp editorial film shoulder',
    shadowDepth: 'Deep saturated navy and charcoal blacks'
  },
  {
    id: 5,
    codename: 'sauce_velvia_label',
    name: 'Velvet',
    tagline: 'Fuji Velvia Landscape Punch & Vivid Skies',
    description: 'High-saturation landscape and outdoor aesthetic reminiscent of Fuji Velvia 50 slide film. Emerald forest greens and cobalt blues with rich dynamic pop.',
    badgeColor: '#A142F4',
    accentColor: '#d7aefb',
    contrast: 1.18,
    saturation: 1.35,
    brightness: 1.02,
    sepia: 0.01,
    hueRotate: -12,
    grainIntensity: 0.08,
    vignette: 0.1,
    tint: 'rgba(120, 40, 200, 0.06)',
    warmth: -4,
    highlightRollOff: 'Dense spectral color saturation in highlights',
    shadowDepth: 'High-chroma shadows with deep foliage distinction'
  },
  {
    id: 6,
    codename: 'sauce_portra_label',
    name: 'Classic',
    tagline: 'Kodak Portra Analog Film Emulation',
    description: 'Timeless analog 35mm film aesthetic inspired by Kodak Portra 400. Soft pastel skin rendition, smooth highlight roll-off, and subtle organic silver halide grain.',
    badgeColor: '#F2994A',
    accentColor: '#f9ab00',
    contrast: 1.02,
    saturation: 0.96,
    brightness: 1.03,
    sepia: 0.08,
    hueRotate: 4,
    grainIntensity: 0.22,
    vignette: 0.14,
    tint: 'rgba(240, 200, 160, 0.08)',
    warmth: 16,
    highlightRollOff: 'Gentle Portra highlight roll-off with creamy roll',
    shadowDepth: 'Soft lifted charcoal shadows (+0.6 EV)'
  },
  {
    id: 7,
    codename: 'sauce_digicam_label',
    name: 'Digi',
    tagline: 'Y2K CCD Flash & Retro Digicam Punch',
    description: 'Nostalgic early-2000s compact digital camera punch with distinctive CCD sensor clipping, slightly cooler shadows, and punchy direct-flash aesthetic.',
    badgeColor: '#00ACC1',
    accentColor: '#78d9ec',
    contrast: 1.15,
    saturation: 1.18,
    brightness: 1.08,
    sepia: 0.02,
    hueRotate: 14,
    grainIntensity: 0.12,
    vignette: 0.25,
    tint: 'rgba(100, 220, 255, 0.08)',
    warmth: -8,
    highlightRollOff: 'Distinctive CCD hard clip highlight punch',
    shadowDepth: 'Cool cyan tinted shadow compression'
  },
  {
    id: 8,
    codename: 'sauce_black_and_white_label',
    name: 'Black Tie',
    tagline: 'Fine-Grain High-Contrast Monochrome',
    description: 'Fine-grain, high-contrast monochrome with deep dynamic range. Calibrated panchromatic luminance curves that make textures and architectural geometries sing.',
    badgeColor: '#202124',
    accentColor: '#e8eaed',
    contrast: 1.35,
    saturation: 0.0,
    brightness: 0.98,
    sepia: 0.0,
    hueRotate: 0,
    grainIntensity: 0.28,
    vignette: 0.2,
    tint: 'rgba(0, 0, 0, 0.0)',
    warmth: 0,
    highlightRollOff: 'Clean silver halide highlight preservation',
    shadowDepth: 'True ink-black zone 0 shadows'
  },
  {
    id: 9,
    codename: 'sauce_minimal_label',
    name: 'Minimal',
    tagline: 'Scandinavian Desaturated Fine-Art Style',
    description: 'Clean, desaturated Scandinavian fine-art style. Elevated midtone clarity, muted tertiary colors, and serene architectural composure.',
    badgeColor: '#78909C',
    accentColor: '#cfd8dc',
    contrast: 0.98,
    saturation: 0.72,
    brightness: 1.04,
    sepia: 0.04,
    hueRotate: -2,
    grainIntensity: 0.1,
    vignette: 0.08,
    tint: 'rgba(230, 240, 245, 0.06)',
    warmth: -2,
    highlightRollOff: 'High-key clean architectural highlight airy feel',
    shadowDepth: 'Transparent airy shadows without muddiness'
  }
];
