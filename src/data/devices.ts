export interface DeviceCompatibility {
  generation: string;
  models: string[];
  soc: string;
  ram: string;
  looksCapture: boolean;
  quickAccess: boolean;
  proControls: boolean;
  zoom10x: boolean | 'pro_only';
  processingEngine: string;
  selinuxStatus: string;
  halideWorkers: number;
  status: 'Native' | 'Verified' | 'Verified (Optimized)';
  notes: string;
}

export const DEVICE_COMPATIBILITY_LIST: DeviceCompatibility[] = [
  {
    generation: 'Pixel 11 Series',
    models: ['Pixel 11', 'Pixel 11 Pro', 'Pixel 11 Pro XL', 'Pixel 11 Ultra'],
    soc: 'Google Tensor G6',
    ram: '12 GB / 16 GB',
    looksCapture: true,
    quickAccess: true,
    proControls: true,
    zoom10x: true,
    processingEngine: 'Hardware TPU + Vendor HAL (REQUEST_TOMTE_TYPE)',
    selinuxStatus: 'Native platform signature',
    halideWorkers: 8,
    status: 'Native',
    notes: 'Native hardware implementation with real-time ISP viewfinder preview.'
  },
  {
    generation: 'Pixel 10 Series',
    models: ['Pixel 10', 'Pixel 10 Pro', 'Pixel 10 Pro XL', 'Pixel 10 Fold'],
    soc: 'Google Tensor G5 (TSMC 3nm)',
    ram: '12 GB / 16 GB',
    looksCapture: true,
    quickAccess: true,
    proControls: true,
    zoom10x: 'pro_only',
    processingEngine: 'Hybrid TPU / Mali GPU Fallback',
    selinuxStatus: 'untrusted_app (/dev/gxp sandbox)',
    halideWorkers: 6,
    status: 'Verified',
    notes: 'Photo saving fix active. Eclipse AE bypassed. 10x Super Res zoom verified on Pro periscope.'
  },
  {
    generation: 'Pixel 9 Series',
    models: ['Pixel 9', 'Pixel 9 Pro', 'Pixel 9 Pro XL', 'Pixel 9 Pro Fold'],
    soc: 'Google Tensor G4',
    ram: '12 GB / 16 GB',
    looksCapture: true,
    quickAccess: true,
    proControls: true,
    zoom10x: 'pro_only',
    processingEngine: 'GPU / TPU Fallback (Mali-G715)',
    selinuxStatus: 'untrusted_app sandbox',
    halideWorkers: 6,
    status: 'Verified',
    notes: 'Flawless 10 Looks capture and creator tools. 10x zoom active on 9 Pro periscope.'
  },
  {
    generation: 'Pixel 8 Series',
    models: ['Pixel 8', 'Pixel 8 Pro', 'Pixel 8a'],
    soc: 'Google Tensor G3',
    ram: '8 GB / 12 GB',
    looksCapture: true,
    quickAccess: true,
    proControls: true,
    zoom10x: 'pro_only',
    processingEngine: 'Mali-G715 GPU / Halide C++ Engine',
    selinuxStatus: 'untrusted_app sandbox',
    halideWorkers: 4,
    status: 'Verified',
    notes: 'Sub-second capture time on 8 Pro with full manual pro controls and focus peaking.'
  },
  {
    generation: 'Pixel 7 Series',
    models: ['Pixel 7', 'Pixel 7 Pro', 'Pixel 7a'],
    soc: 'Google Tensor G2',
    ram: '8 GB / 12 GB (7a: 8 GB)',
    looksCapture: true,
    quickAccess: true,
    proControls: true,
    zoom10x: 'pro_only',
    processingEngine: 'GPU / Halide CPU Fallback',
    selinuxStatus: 'untrusted_app sandbox',
    halideWorkers: 4,
    status: 'Verified',
    notes: 'Full support. 7 Pro periscope telephoto activates lossless 10x fusion zoom button.'
  },
  {
    generation: 'Pixel 6 Series',
    models: ['Pixel 6a (bluejay)', 'Pixel 6 (oriole)', 'Pixel 6 Pro (raven)'],
    soc: 'Google Tensor G1',
    ram: '6 GB (6a) / 8 GB (6) / 12 GB (6 Pro)',
    looksCapture: true,
    quickAccess: true,
    proControls: true,
    zoom10x: 'pro_only',
    processingEngine: 'Halide CPU Worker (2 threads) & Mali-G78 OpenCL',
    selinuxStatus: 'untrusted_app sandbox',
    halideWorkers: 2,
    status: 'Verified (Optimized)',
    notes: 'Pixel 6a (bluejay) IMX363 sensor guard skips 50MP overrides. Halide workers & burst capture queue capped at 2 to eliminate 6GB LMK kills. Pure TFLite monocular depth on front IMX355.'
  }
];
