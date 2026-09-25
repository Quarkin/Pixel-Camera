import React, { useState } from 'react';
import { CAMERA_LOOKS, CameraLook } from '../data/looks';
import { Sparkles, Sliders, CheckCircle2, Cpu, Palette, Layers, ArrowRight } from 'lucide-react';
import { playTickSound } from '../utils/audio';

interface LookInspectorProps {
  activeLookId: number;
  onSelectLook: (id: number) => void;
}

export const LookInspector: React.FC<LookInspectorProps> = ({
  activeLookId,
  onSelectLook
}) => {
  const [selectedLookId, setSelectedLookId] = useState<number>(activeLookId);
  const look = CAMERA_LOOKS[selectedLookId] || CAMERA_LOOKS[0];

  const handleChoose = (id: number) => {
    playTickSound();
    setSelectedLookId(id);
    onSelectLook(id);
  };

  return (
    <div className="h-full flex flex-col bg-[#121316] text-[#e3e2e6] overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Pixel 11 Backport • Sauce &amp; Tomte
            </span>
            <span className="text-white/40 text-xs">10 Signature Presets</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Camera Looks Architecture
          </h2>
          <p className="text-xs text-white/60 max-w-2xl mt-0.5">
            Internal computational tone curves, organic film grain matrices, and Halide C++ fallback pipelines reverse-engineered from Google Camera 11.0.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleChoose(look.id)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply &quot;{look.name}&quot; to Viewfinder</span>
          </button>
        </div>
      </div>

      {/* Grid of 10 Signature Looks */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {CAMERA_LOOKS.map((item) => {
          const isSelected = item.id === selectedLookId;
          const isActive = item.id === activeLookId;

          return (
            <button
              key={item.id}
              onClick={() => handleChoose(item.id)}
              className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-white/10 border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                  : 'bg-[#1a1b1f] border-white/5 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white/50">
                  #{item.id}
                </span>
                <div
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20"
                  style={{ backgroundColor: item.badgeColor }}
                />
              </div>

              <div className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                {item.name}
              </div>
              <div className="text-[11px] text-white/50 truncate mt-0.5">
                {item.tagline}
              </div>

              {isActive && (
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-blue-500 text-black text-[9px] font-bold rounded uppercase">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Deep Dive on Selected Look */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left Column: Visual characteristics & Tone mapping */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1a1b1f] rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-md"
                  style={{ backgroundColor: look.badgeColor }}
                >
                  {look.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{look.name}</h3>
                  <p className="text-xs text-blue-400 font-mono">{look.codename}</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
                {look.tagline}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-white/80">
              {look.description}
            </p>

            {/* Computational Curve Sliders breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Contrast</div>
                <div className="text-sm font-mono font-bold text-white">{(look.contrast * 100).toFixed(0)}%</div>
                <div className="w-full bg-white/10 h-1 rounded mt-1.5 overflow-hidden">
                  <div className="bg-blue-400 h-full" style={{ width: `${(look.contrast / 1.5) * 100}%` }} />
                </div>
              </div>

              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Saturation</div>
                <div className="text-sm font-mono font-bold text-white">{(look.saturation * 100).toFixed(0)}%</div>
                <div className="w-full bg-white/10 h-1 rounded mt-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${(look.saturation / 1.5) * 100}%` }} />
                </div>
              </div>

              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Tomte Grain</div>
                <div className="text-sm font-mono font-bold text-white">{(look.grainIntensity * 100).toFixed(0)}%</div>
                <div className="w-full bg-white/10 h-1 rounded mt-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${look.grainIntensity * 250}%` }} />
                </div>
              </div>

              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Warmth Shift</div>
                <div className="text-sm font-mono font-bold text-white">
                  {look.warmth > 0 ? `+${look.warmth}K` : `${look.warmth}K`}
                </div>
                <div className="w-full bg-white/10 h-1 rounded mt-1.5 overflow-hidden">
                  <div className="bg-purple-400 h-full" style={{ width: `${Math.min(100, Math.max(10, 50 + look.warmth))}%` }} />
                </div>
              </div>
            </div>

            {/* Roll-off & Shadow depth specs */}
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-start justify-between gap-4">
                <span className="text-white/50 shrink-0">Highlight Roll-Off:</span>
                <span className="font-medium text-white/90 text-right">{look.highlightRollOff}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-white/50 shrink-0">Shadow Floor:</span>
                <span className="font-medium text-white/90 text-right">{look.shadowDepth}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Engine Architecture & Reverse Engineering Note */}
        <div className="space-y-4">
          <div className="bg-[#1a1b1f] rounded-2xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Tomte &amp; Halide Pipeline</span>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              On Pixel 11, Google introduced a proprietary vendor HAL tag (<code className="text-blue-300">REQUEST_TOMTE_TYPE</code>). On Pixel 6 through 10, the Morphe patch forces execution through Google&apos;s native Halide C++ routines:
            </p>

            <div className="bg-black/40 rounded-xl p-3 border border-white/5 space-y-2 font-mono text-[11px]">
              <div className="text-emerald-400">// Native Halide Hook</div>
              <div className="text-white/80">wireless/android/camera/tomte/</div>
              <div className="text-white/60">tomte_tonemap.cc:ApplyLook()</div>
              <div className="text-amber-300">LookNet Model: looknet_v2.1_float.tflite</div>
            </div>

            <div className="text-[11px] text-white/50 space-y-1">
              <p>• GPU OpenCL pipeline on Mali-G78/G710/G715/Immortalis</p>
              <p>• Pure-TFLite monocular depth fallback for portrait shots</p>
              <p>• Zero root privileges required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
