import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  RotateCcw,
  Sliders,
  Sparkles,
  Maximize2,
  Grid3X3,
  Timer,
  Eye,
  FileText,
  Volume2,
  Check,
  ChevronDown,
  Play,
  Pause,
  Layers,
  Settings2,
  Download,
  Info,
  Maximize,
  Ratio
} from 'lucide-react';
import { CAMERA_LOOKS, CameraLook } from '../data/looks';
import { SCENE_SAMPLES, SceneSample } from '../data/samples';
import { playShutterSound, playTickSound } from '../utils/audio';

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  look: CameraLook;
  timestamp: string;
  zoom: number;
  shutterSpeed: string;
  iso: string;
  focusDistance: string;
  aspectRatio: string;
}

interface CameraViewfinderProps {
  onPhotoCaptured: (photo: CapturedPhoto) => void;
  activeLookId: number;
  setActiveLookId: (id: number) => void;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  onPhotoCaptured,
  activeLookId,
  setActiveLookId
}) => {
  // Mode & Source state
  const [sourceType, setSourceType] = useState<'sample' | 'webcam'>('sample');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  // Zoom state: 0.5, 1, 2, 5, 10
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Viewfinder aspect ratio
  const [aspectRatio, setAspectRatio] = useState<'4:3' | '16:9' | '1:1'>('4:3');

  // Grid type
  const [gridType, setGridType] = useState<'none' | '3x3' | 'golden'>('3x3');

  // Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Customizable Quick Access Slots
  const [leftSlot, setLeftSlot] = useState<'looks' | 'timer' | 'ratio' | 'peaking'>('looks');
  const [rightSlot, setRightSlot] = useState<'creator' | 'grid' | 'pro' | 'ratio'>('creator');
  const [showSlotConfig, setShowSlotConfig] = useState(false);

  // Pro Controls state
  const [proModeOpen, setProModeOpen] = useState(false);
  const [manualShutter, setManualShutter] = useState<string>('Auto'); // 'Auto', '1/1000s', '1/250s', '1/60s', '1/15s'
  const [manualIso, setManualIso] = useState<string>('Auto'); // 'Auto', '50', '100', '400', '1600'
  const [focusDistance, setFocusDistance] = useState<number>(50); // 0 (macro) to 100 (infinity)
  const [focusPeakingActive, setFocusPeakingActive] = useState(false);

  // Creator Suite state
  const [creatorSuiteOpen, setCreatorSuiteOpen] = useState(false);
  const [teleprompterActive, setTeleprompterActive] = useState(false);
  const [teleprompterPlaying, setTeleprompterPlaying] = useState(false);
  const [teleprompterText, setTeleprompterText] = useState(
    "Welcome to Pixel Camera with Looks & Creator Suite.\n\nIn this take, highlight the 10 Signature Looks: Natural, Shadows, Vanilla, Editorial, and Black Tie.\n\nNotice the real-time Mica audio VU meter and discrete 10-tick vertical scrubber on your right.\n\nReady? 3, 2, 1... Action!"
  );
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(25); // WPM speed
  const [vuLevel, setVuLevel] = useState(45); // 0 to 100

  // Social Framing overlay
  const [socialFraming, setSocialFraming] = useState<'none' | '9:16' | '1:1' | '4:5'>('none');

  // Flash animation & UI state
  const [isFlashing, setIsFlashing] = useState(false);
  const [showTickDetails, setShowTickDetails] = useState(false);

  // Pro Controls haptic trigger (HapticFeedbackConstants.CLOCK_TICK / 0x4)
  const triggerHapticClockTick = () => {
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  };

  // Video and Canvas refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const teleprompterRef = useRef<HTMLDivElement | null>(null);

  const activeLook = CAMERA_LOOKS[activeLookId] || CAMERA_LOOKS[0];
  const activeScene: SceneSample = SCENE_SAMPLES[selectedSceneIndex];

  // Initialize and handle webcam
  const startWebcam = useCallback(async () => {
    try {
      setWebcamError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setWebcamActive(true);
      }
    } catch (err: unknown) {
      console.warn('Webcam permission or device error:', err);
      setWebcamError('Camera access not granted or unavailable in this browser.');
      setSourceType('sample');
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setWebcamActive(false);
  }, []);

  useEffect(() => {
    if (sourceType === 'webcam') {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => {
      stopWebcam();
    };
  }, [sourceType, startWebcam, stopWebcam]);

  // Audio VU meter simulation
  useEffect(() => {
    if (!creatorSuiteOpen) return;
    const interval = setInterval(() => {
      // Simulate speech cadence
      const base = 35 + Math.random() * 45;
      const peak = Math.random() > 0.85 ? Math.min(100, base + 20) : base;
      setVuLevel(Math.round(peak));
    }, 120);
    return () => clearInterval(interval);
  }, [creatorSuiteOpen]);

  // Teleprompter auto-scroll
  useEffect(() => {
    if (!teleprompterPlaying || !teleprompterRef.current) return;
    const el = teleprompterRef.current;
    const interval = setInterval(() => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        el.scrollTop = 0; // Loop or stop
      } else {
        el.scrollTop += 1.5;
      }
    }, 1200 / teleprompterSpeed);

    return () => clearInterval(interval);
  }, [teleprompterPlaying, teleprompterSpeed]);

  // Handle Look change with haptic sound
  const handleSelectLook = (lookId: number) => {
    if (lookId !== activeLookId) {
      playTickSound();
      setActiveLookId(lookId);
      setShowTickDetails(true);
      setTimeout(() => setShowTickDetails(false), 2000);
    }
  };

  // Perform Capture
  const handleCaptureTrigger = () => {
    if (countdown !== null) return;

    if (timerSeconds > 0) {
      setCountdown(timerSeconds);
      const timerInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerInterval);
            executeShutter();
            return null;
          }
          playTickSound();
          return prev - 1;
        });
      }, 1000);
    } else {
      executeShutter();
    }
  };

  const executeShutter = () => {
    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 280);

    // Draw on canvas and save photo
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = aspectRatio === '1:1' ? 1200 : aspectRatio === '16:9' ? 675 : 900;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Draw image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sourceType === 'webcam' && videoRef.current ? '' : activeScene.sourceUrl;

    const finalizeAndSave = () => {
      // Apply Look filter effects on the canvas
      ctx.save();
      // Apply Look CSS color grading
      ctx.filter = `contrast(${activeLook.contrast}) saturate(${activeLook.saturation}) brightness(${activeLook.brightness}) sepia(${activeLook.sepia}) hue-rotate(${activeLook.hueRotate}deg)`;

      if (sourceType === 'webcam' && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, width, height);
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      ctx.restore();

      // Tint overlay if any
      if (activeLook.tint && activeLook.tint !== 'rgba(0, 0, 0, 0)') {
        ctx.fillStyle = activeLook.tint;
        ctx.fillRect(0, 0, width, height);
      }

      // Add watermark chip
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      ctx.roundRect(30, height - 70, 360, 42, 8);
      ctx.fill();

      ctx.font = 'bold 15px "Google Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Pixel Camera • Look: ${activeLook.name}`, 44, height - 44);

      const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
      const photo: CapturedPhoto = {
        id: Date.now().toString(),
        dataUrl,
        look: activeLook,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        zoom: zoomLevel,
        shutterSpeed: manualShutter === 'Auto' ? '1/250s' : manualShutter,
        iso: manualIso === 'Auto' ? 'ISO 125' : `ISO ${manualIso}`,
        focusDistance: `${(focusDistance / 50).toFixed(1)}m`,
        aspectRatio
      };

      onPhotoCaptured(photo);
    };

    if (sourceType === 'webcam' && videoRef.current) {
      finalizeAndSave();
    } else {
      img.onload = finalizeAndSave;
      img.onerror = () => {
        // Fallback simple canvas fill
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);
        finalizeAndSave();
      };
    }
  };

  // Compute CSS filter for the Look preview
  const previewFilterStyle = {
    filter: `contrast(${activeLook.contrast}) saturate(${activeLook.saturation}) brightness(${activeLook.brightness}) sepia(${activeLook.sepia}) hue-rotate(${activeLook.hueRotate}deg)`,
    transform: `scale(${zoomLevel >= 10 ? 1.6 : zoomLevel > 2 ? 1.25 : zoomLevel > 1 ? 1.1 : 1})`,
    transition: 'transform 260ms cubic-bezier(0.2, 0, 0, 1), filter 180ms ease'
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#121316] select-none text-white relative">
      {/* Viewfinder Top Bar / Quick Access Controls */}
      <div className="h-14 px-4 bg-[#1a1b1f]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          {/* Left Quick Access Slot */}
          <div className="relative">
            {leftSlot === 'looks' && (
              <button
                onClick={() => setShowTickDetails(!showTickDetails)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-all text-xs font-medium border border-white/10"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full ring-1 ring-white/50"
                  style={{ backgroundColor: activeLook.badgeColor }}
                />
                <span className="text-white/90">Look: {activeLook.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/60" />
              </button>
            )}

            {leftSlot === 'timer' && (
              <button
                onClick={() => setTimerSeconds(timerSeconds === 0 ? 3 : timerSeconds === 3 ? 10 : 0)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  timerSeconds > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/10 text-white/80'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{timerSeconds === 0 ? 'Timer Off' : `${timerSeconds}s`}</span>
              </button>
            )}

            {leftSlot === 'ratio' && (
              <button
                onClick={() => setAspectRatio(aspectRatio === '4:3' ? '16:9' : aspectRatio === '16:9' ? '1:1' : '4:3')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-medium text-white/80"
              >
                <Ratio className="w-3.5 h-3.5" />
                <span>{aspectRatio}</span>
              </button>
            )}

            {leftSlot === 'peaking' && (
              <button
                onClick={() => setFocusPeakingActive(!focusPeakingActive)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  focusPeakingActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/10 text-white/80'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Peaking {focusPeakingActive ? 'ON' : 'OFF'}</span>
              </button>
            )}
          </div>

          {/* Quick slot customizer toggle */}
          <button
            onClick={() => setShowSlotConfig(!showSlotConfig)}
            title="Configure Viewfinder Quick Access Slots"
            className="p-1.5 rounded-full text-white/50 hover:text-white/90 hover:bg-white/10 transition"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {/* Center Live Readouts */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-tight text-white/70">
          <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
            {manualShutter === 'Auto' ? '1/250s' : manualShutter}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
            {manualIso === 'Auto' ? 'ISO 125' : `ISO ${manualIso}`}
          </span>
          {focusPeakingActive && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
              PEAKING
            </span>
          )}
        </div>

        {/* Right Quick Access Slot */}
        <div className="flex items-center gap-2">
          {rightSlot === 'creator' && (
            <button
              onClick={() => setCreatorSuiteOpen(!creatorSuiteOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                creatorSuiteOpen
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-white/10 hover:bg-white/15 text-white/90'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Creator Suite</span>
            </button>
          )}

          {rightSlot === 'grid' && (
            <button
              onClick={() => setGridType(gridType === 'none' ? '3x3' : gridType === '3x3' ? 'golden' : 'none')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-medium text-white/80"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>{gridType === 'none' ? 'Grid Off' : gridType === '3x3' ? 'Rule 3x3' : 'Golden'}</span>
            </button>
          )}

          {rightSlot === 'pro' && (
            <button
              onClick={() => setProModeOpen(!proModeOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                proModeOpen ? 'bg-amber-600 text-white' : 'bg-white/10 text-white/80'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Pro</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Access Slot Configuration Dropdown */}
      {showSlotConfig && (
        <div className="absolute top-14 left-4 z-40 bg-[#202125] p-3 rounded-xl border border-white/10 shadow-2xl text-xs space-y-3 w-64 backdrop-blur-xl">
          <div className="font-semibold text-white/90 flex items-center justify-between border-b border-white/10 pb-1.5">
            <span>Viewfinder Quick Access (qhm.smali)</span>
            <button onClick={() => setShowSlotConfig(false)} className="text-white/40 hover:text-white">✕</button>
          </div>
          <div>
            <label className="text-white/60 block mb-1">Left Slot Action:</label>
            <select
              value={leftSlot}
              onChange={(e) => setLeftSlot(e.target.value as any)}
              className="w-full bg-[#2b2c31] border border-white/10 rounded px-2 py-1 text-white"
            >
              <option value="looks">10 Camera Looks</option>
              <option value="timer">Shutter Timer</option>
              <option value="ratio">Aspect Ratio</option>
              <option value="peaking">Focus Peaking</option>
            </select>
          </div>
          <div>
            <label className="text-white/60 block mb-1">Right Slot Action:</label>
            <select
              value={rightSlot}
              onChange={(e) => setRightSlot(e.target.value as any)}
              className="w-full bg-[#2b2c31] border border-white/10 rounded px-2 py-1 text-white"
            >
              <option value="creator">Creator Suite Drawer</option>
              <option value="grid">Composition Grid</option>
              <option value="pro">Pro Manual Controls</option>
              <option value="ratio">Aspect Ratio</option>
            </select>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed">
            Patched via Morphe QuickAccessControllers.dex. Allows one-tap access directly over the camera stream.
          </p>
        </div>
      )}

      {/* Main Viewfinder Frame */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center">
        {/* Shutter Flash Animation overlay */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none shutter-flash" />
        )}

        {/* Countdown overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <span className="text-8xl font-bold font-mono text-white animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* Dynamic Aspect Ratio Container */}
        <div
          className={`relative overflow-hidden transition-all duration-300 flex items-center justify-center ${
            aspectRatio === '1:1'
              ? 'aspect-square max-h-full max-w-full'
              : aspectRatio === '16:9'
              ? 'aspect-video w-full'
              : 'aspect-[4/3] max-h-full max-w-full'
          }`}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Media Feed: Webcam or Sample Scene */}
          {sourceType === 'webcam' ? (
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={previewFilterStyle}
              />
              {webcamError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-4 text-center">
                  <p className="text-red-400 text-xs mb-2">{webcamError}</p>
                  <button
                    onClick={() => setSourceType('sample')}
                    className="px-3 py-1 bg-white/20 rounded text-xs text-white"
                  >
                    Switch to Sample Scenes
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
              <img
                src={activeScene.sourceUrl}
                alt={activeScene.title}
                className="w-full h-full object-cover pointer-events-none select-none"
                style={previewFilterStyle}
              />
            </div>
          )}

          {/* Film Grain (Tomte Engine Simulation) */}
          <div
            className="absolute inset-0 pointer-events-none film-grain mix-blend-overlay"
            style={{ opacity: activeLook.grainIntensity * 2.5 }}
          />

          {/* Tint Overlay for Look grading */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: activeLook.tint }}
          />

          {/* Focus Peaking Overlay (ark_edge_hex Neon Peaking Simulation) */}
          {focusPeakingActive && (
            <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-70">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: 'radial-gradient(circle at 48% 52%, rgba(0, 255, 128, 0.4) 0%, transparent 40%)',
                  boxShadow: 'inset 0 0 100px rgba(0, 255, 128, 0.25)'
                }}
              />
            </div>
          )}

          {/* Composition Grid Lines */}
          {gridType === '3x3' && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/10">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>
          )}

          {gridType === 'golden' && (
            <div className="absolute inset-0 pointer-events-none flex">
              <div className="w-[38.2%] border-r border-white/25 h-full" />
              <div className="w-[23.6%] border-r border-white/25 h-full" />
              <div className="w-[38.2%] h-full" />
            </div>
          )}

          {/* Social Framing Masks (Creator Suite Slate / Basalt) */}
          {socialFraming === '9:16' && (
            <div className="absolute inset-0 pointer-events-none flex justify-center">
              <div className="h-full aspect-[9/16] border-2 border-dashed border-yellow-400/80 bg-transparent relative">
                <span className="absolute top-2 left-2 text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-mono font-bold">
                  9:16 REELS / TIKTOK
                </span>
              </div>
            </div>
          )}

          {socialFraming === '1:1' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="h-full aspect-square border-2 border-dashed border-cyan-400/80 bg-transparent relative">
                <span className="absolute top-2 left-2 text-[10px] bg-cyan-500 text-black px-1.5 py-0.5 rounded font-mono font-bold">
                  1:1 SQUARE POST
                </span>
              </div>
            </div>
          )}

          {socialFraming === '4:5' && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="h-full aspect-[4/5] border-2 border-dashed border-pink-400/80 bg-transparent relative">
                <span className="absolute top-2 left-2 text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded font-mono font-bold">
                  4:5 PORTRAIT
                </span>
              </div>
            </div>
          )}

          {/* Biotite Teleprompter Floating HUD */}
          {teleprompterActive && (
            <div className="absolute top-4 left-4 right-16 z-30 bg-black/75 backdrop-blur-md rounded-xl p-3 border border-white/15 max-h-48 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Biotite Teleprompter HUD</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTeleprompterPlaying(!teleprompterPlaying)}
                    className="p-1 rounded bg-blue-600 hover:bg-blue-500 text-white transition text-xs flex items-center gap-1 px-2"
                  >
                    {teleprompterPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{teleprompterPlaying ? 'Pause' : 'Scroll'}</span>
                  </button>
                  <button
                    onClick={() => setTeleprompterActive(false)}
                    className="text-white/40 hover:text-white text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div
                ref={teleprompterRef}
                className="overflow-y-auto text-xs text-white/95 font-medium leading-relaxed max-h-24 pr-1"
              >
                {teleprompterText}
              </div>
              <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
                <span>Speed: {teleprompterSpeed} WPM</span>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={teleprompterSpeed}
                  onChange={(e) => setTeleprompterSpeed(Number(e.target.value))}
                  className="w-24 accent-blue-500 cursor-pointer h-1"
                />
              </div>
            </div>
          )}

          {/* Mica Live Microphone VU Level Indicator */}
          {creatorSuiteOpen && (
            <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
              <div className="flex items-end gap-0.5 h-4 w-20">
                {[15, 30, 45, 60, 75, 90].map((threshold, idx) => {
                  const isActive = vuLevel >= threshold;
                  const isRed = threshold >= 75;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-xs transition-all duration-75 ${
                        isActive
                          ? isRed
                            ? 'bg-red-500 h-full'
                            : 'bg-emerald-400 h-full'
                          : 'bg-white/20 h-1.5'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-[10px] font-mono text-white/70">
                {vuLevel > 75 ? '-3dB' : vuLevel > 45 ? '-12dB' : '-24dB'}
              </span>
            </div>
          )}

          {/* Active Look Info Banner (Pops up on Look change) */}
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-none ${
              showTickDetails ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
          >
            <div className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-2 text-xs shadow-lg">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeLook.badgeColor }}
              />
              <span className="font-semibold text-white">{activeLook.name}</span>
              <span className="text-white/60">({activeLook.tagline})</span>
            </div>
          </div>
        </div>

        {/* 10-TICK DISCRETE VERTICAL SCRUBBER (Viewfinder Quick Access Slider) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center bg-black/60 backdrop-blur-md rounded-full py-2.5 px-1.5 border border-white/15 shadow-2xl">
          <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-1 rotate-90 my-2">
            LOOKS
          </div>

          <div className="flex flex-col gap-1.5 py-1 items-center">
            {CAMERA_LOOKS.map((look) => {
              const isSelected = look.id === activeLookId;
              return (
                <button
                  key={look.id}
                  onClick={() => handleSelectLook(look.id)}
                  title={`${look.id}: ${look.name} (${look.codename})`}
                  className={`group relative flex items-center justify-center transition-all ${
                    isSelected ? 'scale-125' : 'hover:scale-110 opacity-70'
                  }`}
                >
                  <div
                    className={`rounded-full transition-all ${
                      isSelected
                        ? 'w-4 h-4 ring-2 ring-white shadow-md'
                        : 'w-2 h-2 group-hover:w-2.5 group-hover:h-2.5'
                    }`}
                    style={{ backgroundColor: look.badgeColor }}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute right-7 bg-black/90 px-2 py-0.5 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition border border-white/10">
                    {look.id}. {look.name}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] font-mono font-bold text-white/90 mt-1">
            {activeLookId}
          </div>
        </div>
      </div>

      {/* Discrete Zoom Strip with Unlocked 10x Quick Zoom Button */}
      <div className="py-2 bg-[#16171b] border-t border-white/5 flex items-center justify-center gap-2 z-10">
        {[
          { label: '0.5x', value: 0.5 },
          { label: '1x', value: 1 },
          { label: '2x', value: 2 },
          { label: '5x', value: 5 },
          { label: '10x', value: 10, isNew: true }
        ].map((zoom) => {
          const isSelected = zoomLevel === zoom.value;
          return (
            <button
              key={zoom.label}
              onClick={() => {
                playTickSound();
                setZoomLevel(zoom.value);
              }}
              className={`relative px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-white text-black shadow-md scale-105'
                  : 'bg-white/10 hover:bg-white/15 text-white/80'
              }`}
            >
              {zoom.label}
              {zoom.isNew && (
                <span className="absolute -top-1.5 -right-1 px-1 py-0.2 bg-amber-400 text-black text-[8px] font-bold rounded-full uppercase tracking-tighter">
                  MOD
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Pro Controls Tray (qaa, qbb, nrn smali hooks) */}
      {proModeOpen && (
        <div className="bg-[#1e1f24] px-4 py-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs z-20 animate-in slide-in-from-bottom-2">
          {/* Shutter Speed Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-white/50 font-medium">Shutter:</span>
            {['Auto', '1/1000s', '1/250s', '1/60s', '1/15s'].map((speed) => (
              <button
                key={speed}
                onClick={() => {
                  triggerHapticClockTick();
                  setManualShutter(speed);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                  manualShutter === speed ? 'bg-amber-500 text-black font-semibold' : 'bg-white/10 text-white/70'
                }`}
              >
                {speed}
              </button>
            ))}
          </div>

          {/* ISO Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-white/50 font-medium">ISO:</span>
            {['Auto', '50', '100', '400', '1600'].map((iso) => (
              <button
                key={iso}
                onClick={() => {
                  triggerHapticClockTick();
                  setManualIso(iso);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                  manualIso === iso ? 'bg-amber-500 text-black font-semibold' : 'bg-white/10 text-white/70'
                }`}
              >
                {iso}
              </button>
            ))}
          </div>

          {/* Manual Focus & Peaking */}
          <div className="flex items-center gap-2">
            <span className="text-white/50 font-medium">Focus:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={focusDistance}
              onChange={(e) => {
                triggerHapticClockTick();
                setFocusDistance(Number(e.target.value));
              }}
              className="w-20 accent-amber-500 h-1.5 cursor-pointer"
            />
            <button
              onClick={() => setFocusPeakingActive(!focusPeakingActive)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                focusPeakingActive
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-white/10 text-white/70'
              }`}
            >
              Edge Peaking
            </button>
          </div>
        </div>
      )}

      {/* Creator Suite Drawer (granite, biotite, mica, slate) */}
      {creatorSuiteOpen && (
        <div className="bg-[#1c1d22] px-4 py-3 border-t border-blue-500/20 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-white/90">Creator Suite Tools:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTeleprompterActive(!teleprompterActive)}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                teleprompterActive ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Teleprompter HUD</span>
            </button>

            {/* Social Framing Options */}
            <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10">
              <span className="text-[10px] text-white/50 px-1.5">Framing:</span>
              {(['none', '9:16', '1:1', '4:5'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSocialFraming(fmt)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                    socialFraming === fmt ? 'bg-blue-500 text-white font-medium' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {fmt === 'none' ? 'Full' : fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Shutter & Controls Dock */}
      <div className="h-24 px-6 bg-[#16171a] border-t border-white/5 flex items-center justify-between z-20">
        {/* Source Switcher / Scene Preset */}
        <div className="flex items-center gap-2">
          {sourceType === 'sample' ? (
            <div className="flex items-center gap-1.5">
              <select
                value={selectedSceneIndex}
                onChange={(e) => setSelectedSceneIndex(Number(e.target.value))}
                className="bg-[#26272c] text-white/90 text-xs border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {SCENE_SAMPLES.map((sample, idx) => (
                  <option key={sample.id} value={idx}>
                    {sample.title} ({sample.category})
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSourceType('webcam')}
                className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-white/80 transition"
                title="Switch to Real Webcam"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Camera Feed
              </span>
              <button
                onClick={() => setSourceType('sample')}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-xs text-white/80 transition"
              >
                Sample Scenes
              </button>
            </div>
          )}
        </div>

        {/* Central Shutter Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleCaptureTrigger}
            aria-label="Capture Photo"
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-transform duration-100 shadow-xl"
            style={{ backgroundColor: 'transparent' }}
          >
            <div
              className="w-12 h-12 rounded-full transition-all group-hover:scale-95 group-active:scale-90"
              style={{ backgroundColor: activeLook.badgeColor }}
            />
          </button>
        </div>

        {/* Pro Mode & Looks Quick Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProModeOpen(!proModeOpen)}
            className={`p-2.5 rounded-full transition ${
              proModeOpen ? 'bg-amber-500 text-black' : 'bg-white/10 hover:bg-white/15 text-white/80'
            }`}
            title="Toggle Pro Manual Controls"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              // Cycle to next look
              const nextId = (activeLookId + 1) % CAMERA_LOOKS.length;
              handleSelectLook(nextId);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs font-medium text-white/90 border border-white/10 transition"
            title="Cycle next Camera Look"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Next Look</span>
          </button>
        </div>
      </div>
    </div>
  );
};
