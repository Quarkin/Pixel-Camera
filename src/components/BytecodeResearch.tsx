import React, { useState } from 'react';
import { Terminal, FileCode, Check, Copy, ExternalLink, ShieldAlert, Cpu } from 'lucide-react';

interface SmaliFileSnippet {
  filename: string;
  classPath: string;
  feature: string;
  summary: string;
  originalSmali: string;
  patchedSmali: string;
  explanation: string;
}

const SMALI_SNIPPETS: SmaliFileSnippet[] = [
  {
    filename: 'uyv.smali',
    classPath: 'com/google/android/apps/camera/features/sauce/uyv.smali',
    feature: 'Camera Looks & Bluejay RAW Override Guard',
    summary: 'Bypasses hardware generation checks in Google Camera 11.0, and adds Build.DEVICE check for "bluejay" (Pixel 6a) skipping 0x7e0 / 0x5e8 overrides.',
    originalSmali: `.method public static applyRawOverrides(...)
    const/16 p1, 0x7e0
    const/16 p2, 0x5e8
    return-object v0
.end method`,
    patchedSmali: `.method public static applyRawOverrides(...)
    # Check if running on Pixel 6a
    sget-object v0, Landroid/os/Build;->DEVICE:Ljava/lang/String;
    const-string v1, "bluejay"
    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z
    move-result v0
    if-eqz v0, :cond_apply_custom_dims

    # Skip 50MP quad-binned overrides and use native sensor dimensions
    goto :skip_raw_override

    :cond_apply_custom_dims
    # (Existing 0x7e0 / 0x5e8 dimension injection stays here)
    const/16 p1, 0x7e0
    const/16 p2, 0x5e8

    :skip_raw_override
    return-object v0
.end method`,
    explanation: 'Skips 50MP quad-binned overrides on Pixel 6a (bluejay) so the 12.2MP IMX363 sensor retains native resolution and does not throw an IllegalArgumentException.'
  },
  {
    filename: 'mkm.smali',
    classPath: 'com/google/android/apps/camera/stats/timing/mkm.smali',
    feature: 'ShotCallback Null Check & notifyFailed()',
    summary: 'Prevents NullPointerException in mkm.j by checking if ShotCallback exists before early return and invoking notifyFailed().',
    originalSmali: `.method public final j(Lcom/.../ShotCallback;I)V
    # Early return without null-safety check or failure dispatch
    return-void
.end method`,
    patchedSmali: `.method public final j(Lcom/.../ShotCallback;I)V
    # Check if ShotCallback is null before early return
    if-eqz p1, :cond_early_return

    # Invoke notifyFailed() if callback exists
    invoke-interface {p1}, Lcom/google/android/apps/camera/stats/timing/ShotCallback;->notifyFailed()V

    :cond_early_return
    return-void
.end method`,
    explanation: 'Ensures camera pipeline state listeners are alerted when a capture session aborts prematurely, preventing viewfinder freeze.'
  },
  {
    filename: 'qau.smali',
    classPath: 'com/google/android/apps/camera/sauce/predicates/qau.smali',
    feature: 'Sauce Availability Predicate',
    summary: 'Ensures the Looks menu option is visible in the bottom camera settings drawer.',
    originalSmali: `.method public final test(Ljava/lang/Object;)Z
    .registers 3

    check-cast p1, Lklh;
    invoke-interface {p1}, Lklh;->isDeviceWhitelisted()Z
    move-result v0
    return v0
.end method`,
    patchedSmali: `.method public final test(Ljava/lang/Object;)Z
    .registers 3

    # Patched: Predicate returns true for all devices
    const/4 v0, 0x1
    return v0
.end method`,
    explanation: 'Overrides Java Predicate interface filter to bypass whitelist validation on older Pixel generations.'
  },
  {
    filename: 'qkp.smali',
    classPath: 'com/google/android/apps/camera/sauce/engine/qkp.smali',
    feature: 'Look Manager Singleton Provider',
    summary: 'Instantiates the active LookManager instance instead of returning dummy no-op stubs.',
    originalSmali: `.method public final b()Lqkr;
    .registers 2

    # If unsupported, returns dummy no-op LookManager
    sget-object v0, Lqkr;->DUMMY_NOOP:Lqkr;
    return v0
.end method`,
    patchedSmali: `.method public final b()Lqkr;
    .registers 3

    # Patched: Instantiates full active LookManager
    new-instance v0, Lqkr;
    invoke-direct {v0, p0}, Lqkr;-><init>(Lqkp;)V
    return v0
.end method`,
    explanation: 'Provides real LookManager singleton with active look tracking, tone map weights, and LUT cache persistence.'
  },
  {
    filename: 'klm.smali',
    classPath: 'com/google/android/apps/camera/featureflags/klm.smali',
    feature: 'Pure-TFLite Monocular Depth & Flags (IMX355 Fallback & SELinux Guard)',
    summary: 'Forces stereo disparity to false (0x0), enables camera.gouda.monocular_depth (0x1), activates Creator Suite & Pro Controls, and leaves camera.lasagna disabled (0x0).',
    originalSmali: `.method public final checkStereoDisparity()Z
    iget-boolean v0, p0, Lklm;->hasStereoPdaf:Z
    return v0
.end method`,
    patchedSmali: `# IMX355 lacks dual-pixel PDAF: disable hardware disparity check
.method public final checkStereoDisparity()Z
    const/4 v0, 0x0
    return v0
.end method

# Route Portrait mode through universal TFLite segmentation model
.method public final isMonocularDepthForced()Z
    .registers 2
    const/4 v0, 0x1
    return v0
.end method

# Enable Pro Controls (camera.ark)
.method public static isArkSupported()Z
    const/4 v0, 0x1
    return v0
.end method

# Motion Blur (camera.lasagna) left disabled to prevent /dev/gxp SELinux queue hangs
.method public static isLasagnaSupported()Z
    const/4 v0, 0x0
    return v0
.end method`,
    explanation: "Pixel 6a's front IMX355 sensor lacks hardware dual-pixel PDAF. Forcing stereo disparity to false and enabling camera.gouda.monocular_depth ensures Portrait Mode processes reliably via the universal TFLite segmentation network. Motion Blur (camera.lasagna) is left disabled (0x0) to avoid /dev/gxp EdgeTPU access denials under untrusted_app domain."
  },
  {
    filename: 'TomteInitHelper.smali',
    classPath: 'com/google/android/apps/camera/tomte/TomteInitHelper.smali',
    feature: 'Low-Memory Profiling (6GB RAM LMK Guard)',
    summary: 'Limits Halide worker threads to 2 and caps burst capture queue depth to 2 to prevent Low Memory Killer (LMK) camera terminations.',
    originalSmali: `.method public static getMaxWorkerThreads()I
    invoke-static {}, Ljava/lang/Runtime;->getRuntime()Ljava/lang/Runtime;
    move-result-object v0
    invoke-virtual {v0}, Ljava/lang/Runtime;->availableProcessors()I
    move-result v0
    return v0
.end method`,
    patchedSmali: `.method public static getMaxWorkerThreads()I
    .registers 1
    const/4 v0, 0x2
    return v0
.end method

.method public static getMaxCaptureQueueDepth()I
    .registers 1
    const/4 v0, 0x2
    return v0
.end method`,
    explanation: 'Uncapped Halide concurrency and unlimited burst queues consume excessive memory on 6GB RAM devices (bluejay). Capping worker concurrency and queue depth to 2 maintains rapid processing without triggering the Android system Low Memory Killer.'
  },
  {
    filename: 'sdo.smali',
    classPath: 'com/google/android/apps/camera/thermal/sdo.smali',
    feature: 'Thermal State Override (Prevent Halide Throttling)',
    summary: 'Forces thermal status getter to always return 0x0 (normal/none), preventing Gcam from throttling Halide worker threads or downclocking post-processing.',
    originalSmali: `.method public final getCurrentThermalStatus()I
    .registers 2

    # Stock behavior queries PowerManager.getCurrentThermalStatus()
    iget-object v0, p0, Lsdo;->powerManager:Landroid/os/PowerManager;
    invoke-virtual {v0}, Landroid/os/PowerManager;->getCurrentThermalStatus()I
    move-result v0
    return v0
.end method`,
    patchedSmali: `.method public final getCurrentThermalStatus()I
    .registers 2

    # Override: Always return THERMAL_STATUS_NONE (0x0)
    const/4 v0, 0x0
    return v0
.end method

.method public final a()I
    .registers 2

    # Internal thermal level getter: returns 0x0 (normal)
    const/4 v0, 0x0
    return v0
.end method`,
    explanation: 'Under sustained camera usage, Pixel 6a (Tensor G1) can trigger THERMAL_STATUS_LIGHT or MODERATE, causing Gcam to drop Halide worker threads from 2 to 1 and stall HDR+ post-processing. Forcing 0x0 maintains optimal 2-thread throughput.'
  },
  {
    filename: 'kkw.smali',
    classPath: 'com/google/android/apps/camera/jpeg/kkw.smali',
    feature: 'Zero-Loss JPEG Quality Override (100% Quality)',
    summary: 'Changes default JPEG compression quality from 0x5F (95%) to 0x64 (100%) for maximum detail retention.',
    originalSmali: `.method public static getJpegQuality()I
    .registers 1

    # Stock default compression: 95%
    const/16 v0, 0x5f

    return v0
.end method`,
    patchedSmali: `.method public static getJpegQuality()I
    .registers 1

    # Overridden to 100% (0x64) for zero-loss output
    const/16 v0, 0x64

    return v0
.end method`,
    explanation: 'Overrides standard 95% JPEG quantization tables to 100% (0x64), eliminating DCT block compression artifacts and maximizing fine texture and edge detail in Halide post-processed photos.'
  },
  {
    filename: 'ProDialListener.smali',
    classPath: 'com/google/android/apps/camera/ui/dial/ProDialListener.smali',
    feature: 'Pro Controls Haptic Clock Ticks',
    summary: 'Injects HapticFeedbackConstants.CLOCK_TICK (0x4) triggers into manual ISO and Shutter Speed scroll/step listeners.',
    originalSmali: `.method public final onValueChanged(Landroid/view/View;II)V
    # Stock behavior updates internal ExposureController state without haptics
    invoke-virtual {p0, p3}, Lcom/google/android/apps/camera/ui/dial/ProDialListener;->updateExposure(I)V
    return-void
.end method`,
    patchedSmali: `.method public final onValueChanged(Landroid/view/View;II)V
    .registers 7
    # Trigger HapticFeedbackConstants.CLOCK_TICK (0x4) with FLAG_IGNORE_VIEW_SETTING (0x1)
    const/4 v0, 0x4
    const/4 v1, 0x1
    invoke-virtual {p1, v0, v1}, Landroid/view/View;->performHapticFeedback(II)Z

    invoke-virtual {p0, p3}, Lcom/google/android/apps/camera/ui/dial/ProDialListener;->updateExposure(I)V
    return-void
.end method`,
    explanation: 'Transforms flat on-screen sliders into tactile physical rotary dials by pulsing the Pixel linear resonant actuator (LRA) at every ISO and shutter step.'
  }
];

export const BytecodeResearch: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const snippet = SMALI_SNIPPETS[selectedIndex];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#121316] text-[#e3e2e6] overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Dalvik Bytecode Teardown
          </span>
          <span className="text-white/40 text-xs">Smali Hooks &amp; Decompiled Source</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          Reverse-Engineering Smali Research
        </h2>
        <p className="text-xs text-white/60 max-w-3xl mt-0.5">
          Inspect how Google Camera 11.0&apos;s feature-gating checks are intercepted in Dalvik smali bytecode to unlock next-generation features on older Pixel devices.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {SMALI_SNIPPETS.map((item, idx) => (
          <button
            key={item.filename}
            onClick={() => setSelectedIndex(idx)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
              idx === selectedIndex
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : 'bg-[#1a1b1f] text-white/70 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            <div className="font-mono text-[11px]">{item.filename}</div>
            <div className="text-[10px] opacity-80 truncate">{item.feature}</div>
          </button>
        ))}
      </div>

      {/* Active Snippet View */}
      <div className="bg-[#1a1b1f] rounded-2xl p-5 border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white font-mono">{snippet.filename}</h3>
            </div>
            <p className="text-xs text-purple-300 font-mono mt-0.5">{snippet.classPath}</p>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/80 border border-white/10">
            {snippet.feature}
          </span>
        </div>

        <p className="text-xs text-white/80 leading-relaxed">
          {snippet.summary}
        </p>

        {/* Smali Diff: Original vs Patched */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original Smali */}
          <div className="bg-black/50 rounded-xl p-4 border border-red-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs text-red-400 font-semibold border-b border-white/5 pb-1.5">
              <span>Original Smali (Stock Camera 11.0)</span>
              <button
                onClick={() => handleCopy(snippet.originalSmali)}
                className="text-[10px] text-white/50 hover:text-white"
              >
                Copy
              </button>
            </div>
            <pre className="font-mono text-[11px] text-red-200/90 leading-relaxed overflow-x-auto whitespace-pre">
              {snippet.originalSmali}
            </pre>
          </div>

          {/* Patched Smali */}
          <div className="bg-black/50 rounded-xl p-4 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold border-b border-white/5 pb-1.5">
              <span>Patched Smali (Morphe .MPP)</span>
              <button
                onClick={() => handleCopy(snippet.patchedSmali)}
                className="text-[10px] text-white/50 hover:text-white"
              >
                Copy
              </button>
            </div>
            <pre className="font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre">
              {snippet.patchedSmali}
            </pre>
          </div>
        </div>

        {/* Technical Explanation */}
        <div className="bg-purple-950/20 p-4 rounded-xl border border-purple-500/20 text-xs text-purple-200 leading-relaxed space-y-1">
          <div className="font-semibold text-purple-300 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>Why this patch works:</span>
          </div>
          <p>{snippet.explanation}</p>
        </div>
      </div>
    </div>
  );
};
