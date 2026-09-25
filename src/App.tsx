import React, { useState } from 'react';
import { CameraViewfinder, CapturedPhoto } from './components/CameraViewfinder';
import { LookInspector } from './components/LookInspector';
import { PatcherStudio } from './components/PatcherStudio';
import { CompatibilityMatrix } from './components/CompatibilityMatrix';
import { BytecodeResearch } from './components/BytecodeResearch';
import { GalleryModal } from './components/GalleryModal';
import {
  Camera,
  Palette,
  Wrench,
  Smartphone,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'viewfinder' | 'looks' | 'patcher' | 'matrix' | 'research'>('viewfinder');
  const [activeLookId, setActiveLookId] = useState<number>(3); // Default to Look #3: Vanilla
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handlePhotoCaptured = (photo: CapturedPhoto) => {
    setCapturedPhotos((prev) => [photo, ...prev]);
  };

  const handleClearGallery = () => {
    setCapturedPhotos([]);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#121316] text-[#e3e2e6]">
      {/* Top Application Navigation Bar */}
      <header className="h-14 px-4 sm:px-6 bg-[#18191e] border-b border-white/10 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                Pixel Camera
                <span className="text-[11px] font-mono font-normal px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Looks &amp; Creator Suit
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 text-xs">
          <button
            onClick={() => setActiveTab('viewfinder')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'viewfinder'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Viewfinder</span>
          </button>

          <button
            onClick={() => setActiveTab('looks')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'looks'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">10 Looks</span>
          </button>

          <button
            onClick={() => setActiveTab('patcher')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'patcher'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Morphe Patcher</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hardware Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('research')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
              activeTab === 'research'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Smali Hooks</span>
          </button>
        </nav>

        {/* Gallery button with count badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="relative px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 border border-white/10 transition active:scale-95"
          >
            <ImageIcon className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Gallery</span>
            {capturedPhotos.length > 0 && (
              <span className="px-1.5 py-0.2 bg-blue-500 text-white text-[10px] font-bold rounded-full">
                {capturedPhotos.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'viewfinder' && (
          <CameraViewfinder
            onPhotoCaptured={handlePhotoCaptured}
            activeLookId={activeLookId}
            setActiveLookId={setActiveLookId}
          />
        )}

        {activeTab === 'looks' && (
          <LookInspector
            activeLookId={activeLookId}
            onSelectLook={(id) => {
              setActiveLookId(id);
              setActiveTab('viewfinder');
            }}
          />
        )}

        {activeTab === 'patcher' && <PatcherStudio />}

        {activeTab === 'matrix' && <CompatibilityMatrix />}

        {activeTab === 'research' && <BytecodeResearch />}
      </main>

      {/* Captured Photo Gallery Modal */}
      <GalleryModal
        photos={capturedPhotos}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onClear={handleClearGallery}
      />
    </div>
  );
};
