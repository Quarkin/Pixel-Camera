import React, { useState } from 'react';
import { REVERSE_ENGINEERED_PATCHES, PatchInfo } from '../data/patches';
import { DEVICE_COMPATIBILITY_LIST, DeviceCompatibility } from '../data/devices';
import {
  Wrench,
  CheckCircle2,
  Download,
  Terminal,
  FileCode,
  ShieldCheck,
  Smartphone,
  Cpu,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

export const PatcherStudio: React.FC = () => {
  const [patches, setPatches] = useState<PatchInfo[]>(REVERSE_ENGINEERED_PATCHES);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(1); // Default to Pixel 10
  const [activePatchId, setActivePatchId] = useState<string>('camera_looks');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedManifest, setGeneratedManifest] = useState<string | null>(null);

  const selectedDevice = DEVICE_COMPATIBILITY_LIST[selectedDeviceIndex];
  const activePatch = patches.find((p) => p.id === activePatchId) || patches[0];

  const handleTogglePatch = (patchId: string) => {
    setPatches((prev) =>
      prev.map((p) => (p.id === patchId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleGenerateBundle = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const activePatches = patches.filter((p) => p.enabled);
      const manifest = {
        version: '1.0.3',
        targetDevice: selectedDevice.generation,
        soc: selectedDevice.soc,
        timestamp: new Date().toISOString(),
        packageTarget: 'com.google.android.GoogleCamera (11.0.073.972752740.32)',
        outputPackage: 'com.google.android.GoogleCameraEng',
        signatureBypass: 'Morphe Dynamic DEX Provider + TomteInitHelper.dex',
        enabledPatches: activePatches.map((p) => ({
          name: p.name,
          codename: p.codename,
          category: p.category,
          targetClasses: p.targetClasses,
          bytecodeHooks: p.bytecodeChanges
        }))
      };

      setGeneratedManifest(JSON.stringify(manifest, null, 2));
      setIsGenerating(false);
    }, 400);
  };

  const handleCopyManifest = () => {
    if (!generatedManifest) return;
    navigator.clipboard.writeText(generatedManifest);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadMpp = () => {
    const data = generatedManifest || JSON.stringify(patches, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `morphe-patches-pixelcamera-1.0.3-${selectedDevice.generation.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-[#121316] text-[#e3e2e6] overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Morphe Patcher v1.0.3
            </span>
            <span className="text-white/40 text-xs">Official .MPP Patch Manager</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            APK Patcher &amp; Smali Hooks Studio
          </h2>
          <p className="text-xs text-white/60 max-w-2xl mt-0.5">
            Configure Dalvik bytecode transforms, clone package isolation, and build customized Morphe patch manifests for Google Camera 11.0.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateBundle}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
            <span>Compile Patch Bundle</span>
          </button>
        </div>
      </div>

      {/* Target Device Selector & Compatibility Badge */}
      <div className="bg-[#1a1b1f] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-white/50">Target Device Generation</div>
            <select
              value={selectedDeviceIndex}
              onChange={(e) => setSelectedDeviceIndex(Number(e.target.value))}
              aria-label="Target Device Generation"
              className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer mt-0.5"
            >
              {DEVICE_COMPATIBILITY_LIST.map((dev, idx) => (
                <option key={dev.generation} value={idx} className="bg-[#202125]">
                  {dev.generation} ({dev.soc})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/70 border border-white/10">
            SELinux: <span className="text-white font-mono">{selectedDevice.selinuxStatus}</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/5 text-white/70 border border-white/10">
            Halide Workers: <span className="text-emerald-400 font-mono font-bold">{selectedDevice.halideWorkers} threads</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            Status: {selectedDevice.status}
          </span>
        </div>
      </div>

      {/* Main Grid: Left = Patches List, Right = Bytecode Hook Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patches List */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
            Available Morphe Patches ({patches.filter((p) => p.enabled).length}/{patches.length} active)
          </div>

          {patches.map((patch) => {
            const isSelected = patch.id === activePatchId;
            return (
              <div
                key={patch.id}
                onClick={() => setActivePatchId(patch.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 border-blue-500/80 shadow-md'
                    : 'bg-[#1a1b1f] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{patch.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">
                        v{patch.version}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 line-clamp-2">{patch.description}</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={patch.enabled}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleTogglePatch(patch.id);
                    }}
                    aria-label={`Toggle ${patch.name}`}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer mt-1"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Smali Bytecode Hooks & Technical Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#1a1b1f] rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{activePatch.name}</h3>
                <span className="text-xs font-mono text-blue-400">{activePatch.codename}</span>
              </div>

              <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                activePatch.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'
              }`}>
                {activePatch.enabled ? 'Included in .MPP' : 'Disabled'}
              </span>
            </div>

            {/* Target Smali Classes */}
            <div>
              <div className="text-xs font-medium text-white/60 mb-1.5 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>Target Smali &amp; DEX Classes:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activePatch.targetClasses.map((cls) => (
                  <span
                    key={cls}
                    className="px-2 py-0.5 rounded bg-black/40 text-[11px] font-mono text-white/80 border border-white/10"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>

            {/* Bytecode Transformations */}
            <div>
              <div className="text-xs font-medium text-white/60 mb-1.5 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Smali Transformations &amp; Hooking:</span>
              </div>
              <div className="bg-black/50 rounded-xl p-3 border border-white/5 space-y-1.5 font-mono text-[11px]">
                {activePatch.bytecodeChanges.map((change, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 select-none">+</span>
                    <span className="text-white/80">{change}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware & Technical Notes */}
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-white/70">
              <p><span className="font-semibold text-white/90">Architecture:</span> {activePatch.technicalDetails}</p>
              <p><span className="font-semibold text-white/90">Hardware notes:</span> {activePatch.hardwareNotes}</p>
            </div>
          </div>

          {/* Generated Manifest Terminal View */}
          {generatedManifest && (
            <div className="bg-[#16171b] rounded-2xl p-4 border border-emerald-500/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Compiled Morphe Manifest: patches-bundle.json</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyManifest}
                    className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadMpp}
                    className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .MPP JSON</span>
                  </button>
                </div>
              </div>

              <pre className="p-3 bg-black/60 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-56 leading-relaxed border border-white/5">
                {generatedManifest}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
