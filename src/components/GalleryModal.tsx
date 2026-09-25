import React, { useState } from 'react';
import { CapturedPhoto } from './CameraViewfinder';
import { Image, Download, Trash2, X, Sparkles, Sliders, Calendar, ZoomIn } from 'lucide-react';

interface GalleryModalProps {
  photos: CapturedPhoto[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  photos,
  isOpen,
  onClose,
  onClear
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentPhoto = photos[selectedPhotoIndex] || photos[0];

  const handleDownload = (photo: CapturedPhoto) => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `PixelCamera_${photo.look.name.replace(/\s+/g, '_')}_${photo.id}.jpg`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#18191e] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-base">Captured Photos ({photos.length})</h3>
          </div>

          <div className="flex items-center gap-2">
            {photos.length > 0 && (
              <button
                onClick={onClear}
                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Gallery</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {photos.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3 text-white/30">
              <Image className="w-8 h-8" />
            </div>
            <h4 className="text-white font-medium text-sm">No photos captured yet</h4>
            <p className="text-white/50 text-xs mt-1 max-w-sm">
              Use the viewfinder shutter button to test different Camera Looks, exposure dials, and framing guides.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Main Preview */}
            <div className="flex-1 bg-black/70 flex items-center justify-center p-4 relative overflow-hidden">
              <img
                src={currentPhoto.dataUrl}
                alt="Captured look"
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
              />

              {/* Download Quick Button */}
              <button
                onClick={() => handleDownload(currentPhoto)}
                className="absolute bottom-6 right-6 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-blue-500/30 transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Photo</span>
              </button>
            </div>

            {/* Sidebar Details & Film Strip */}
            <div className="w-full md:w-80 bg-[#1e1f25] border-t md:border-t-0 md:border-l border-white/10 p-4 flex flex-col justify-between space-y-4 overflow-y-auto">
              {/* Active Photo EXIF info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: currentPhoto.look.badgeColor }}
                    />
                    <span className="font-bold text-sm text-white">
                      {currentPhoto.look.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">{currentPhoto.timestamp}</span>
                </div>

                <p className="text-xs text-white/60 leading-relaxed">
                  {currentPhoto.look.tagline}
                </p>

                {/* Metadata Chips */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                    <span className="text-white/40 block text-[10px]">Shutter</span>
                    <span className="font-mono text-white/90">{currentPhoto.shutterSpeed}</span>
                  </div>

                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                    <span className="text-white/40 block text-[10px]">ISO</span>
                    <span className="font-mono text-white/90">{currentPhoto.iso}</span>
                  </div>

                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                    <span className="text-white/40 block text-[10px]">Zoom</span>
                    <span className="font-mono text-white/90">{currentPhoto.zoom}x</span>
                  </div>

                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                    <span className="text-white/40 block text-[10px]">Ratio</span>
                    <span className="font-mono text-white/90">{currentPhoto.aspectRatio}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-[11px] text-white/50 space-y-1">
                  <div>Codename: <code className="text-white/80">{currentPhoto.look.codename}</code></div>
                  <div>Halide Tone Engine: <span className="text-emerald-400">Tomte Tonemap (Active)</span></div>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <span className="text-[11px] font-medium text-white/50">Gallery Strip:</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {photos.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                        index === selectedPhotoIndex ? 'border-blue-500 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={item.dataUrl} alt="Thumb" className="w-full h-full object-cover" />
                      <div
                        className="absolute bottom-0 inset-x-0 h-1"
                        style={{ backgroundColor: item.look.badgeColor }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
