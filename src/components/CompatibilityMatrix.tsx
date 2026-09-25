import React, { useState } from 'react';
import { DEVICE_COMPATIBILITY_LIST } from '../data/devices';
import { ShieldAlert, CheckCircle2, AlertTriangle, Cpu, Layers, HelpCircle, HardDrive } from 'lucide-react';

export const CompatibilityMatrix: React.FC = () => {
  const [selectedGen, setSelectedGen] = useState<string>('Pixel 10 Series');

  const selectedDevice =
    DEVICE_COMPATIBILITY_LIST.find((d) => d.generation === selectedGen) ||
    DEVICE_COMPATIBILITY_LIST[1];

  return (
    <div className="h-full flex flex-col bg-[#121316] text-[#e3e2e6] overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Hardware Verification Teardown
          </span>
          <span className="text-white/40 text-xs">Pixel 6 — Pixel 11</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          Generational Hardware &amp; Compatibility Matrix
        </h2>
        <p className="text-xs text-white/60 max-w-3xl mt-0.5">
          Comprehensive analysis of Google Tensor SoCs, EdgeTPU SELinux sandboxing, Halide memory constraints, and modded camera behavior across physical hardware generations.
        </p>
      </div>

      {/* Device Generation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {DEVICE_COMPATIBILITY_LIST.map((dev) => {
          const isSelected = dev.generation === selectedGen;
          return (
            <button
              key={dev.generation}
              onClick={() => setSelectedGen(dev.generation)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-white/10 border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                  : 'bg-[#1a1b1f] border-white/5 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="text-[10px] font-mono text-white/50 mb-1">{dev.soc.split('(')[0]}</div>
              <div className="font-bold text-sm text-white">{dev.generation}</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">{dev.status}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Generation Deep Dive */}
      <div className="bg-[#1a1b1f] rounded-2xl p-5 border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-bold text-white">{selectedDevice.generation}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {selectedDevice.status}
              </span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              Models: {selectedDevice.models.join(', ')} • RAM: {selectedDevice.ram}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 font-mono text-white/80">
              SoC: {selectedDevice.soc}
            </span>
          </div>
        </div>

        {/* Feature status badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-white/50 block">10 Camera Looks:</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full Post-Capture</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-white/50 block">Quick Access Slider:</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>10-Tick Detents Active</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-white/50 block">Pro Manual Controls:</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Camera2 Hardware Hook</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
            <span className="text-white/50 block">10x Quick Zoom:</span>
            <div className="flex items-center gap-1.5 font-semibold text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>{selectedDevice.zoom10x === true ? 'Enabled' : 'Periscope Models Only'}</span>
            </div>
          </div>
        </div>

        {/* Hardware Architecture breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Processing Engine &amp; Worker Allocation</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {selectedDevice.processingEngine}
            </p>
            <div className="text-[11px] text-white/50 pt-1 border-t border-white/5">
              Allocated Halide worker concurrency: <strong className="text-white">{selectedDevice.halideWorkers} threads</strong> (optimized to prevent low-memory kills).
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>Hardware &amp; System Constraints</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {selectedDevice.notes}
            </p>
            <div className="text-[11px] text-white/50 pt-1 border-t border-white/5">
              SELinux domain: <strong className="text-white font-mono">{selectedDevice.selinuxStatus}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Architectural Limitations Teardown Section */}
      <div className="space-y-3">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Why Certain Features Have Hardware Constraints</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#1a1b1f] p-4 rounded-xl border border-white/10 space-y-2">
            <span className="font-bold text-amber-300">1. Motion Blur Mode Hidden</span>
            <p className="text-white/70 leading-relaxed">
              Action Pan and Long Exposure require opening <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono">/dev/gxp</code> (EdgeTPU character device). Android denies unprivileged apps (<code className="text-white font-mono">untrusted_app</code> domain), causing capture stalls. Intercepting <code className="text-white font-mono">camera.lasagna</code> in <code className="text-white font-mono">klm.smali</code> cleanly removes it, ensuring 100% crash-free stability.
            </p>
          </div>

          <div className="bg-[#1a1b1f] p-4 rounded-xl border border-white/10 space-y-2">
            <span className="font-bold text-blue-300">2. Viewfinder Looks Preview</span>
            <p className="text-white/70 leading-relaxed">
              Pixel 11 processes Looks at 60fps in the camera ISP hardware via <code className="text-white bg-black/40 px-1 py-0.5 rounded font-mono">REQUEST_TOMTE_TYPE</code>. Older Tensor chips lack this ISP hook. Emulating 60fps 3D LUTs in software causes thermal throttling; therefore Looks are applied immediately post-capture in Halide.
            </p>
          </div>

          <div className="bg-[#1a1b1f] p-4 rounded-xl border border-white/10 space-y-2">
            <span className="font-bold text-emerald-300">3. Google Photos Project Album</span>
            <p className="text-white/70 leading-relaxed">
              Google Photos performs package signature checks on cross-process gRPC calls. Because cloned mods use an independent key to safely coexist alongside stock Pixel Camera, Google Photos rejects the connection. Hiding the entry in <code className="text-white font-mono">kqc.smali</code> eliminates UI crashes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
