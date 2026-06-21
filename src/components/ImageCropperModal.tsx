import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { getCroppedImg } from '../lib/imageUtils';
import { X, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ImageCropperModalProps {
  image: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect || 1,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropperModal({ image, onClose, onCropComplete }: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    // Starting with a sensible default crop (90% of the image)
    setCrop(centerAspectCrop(width, height, undefined));
  }

  const handleCrop = async () => {
    try {
      if (completedCrop && imgRef.current) {
        const croppedImage = await getCroppedImg(image, completedCrop);
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const resetCrop = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, undefined));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black overflow-hidden font-sans">
      {/* Mobile-styled Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-md border-b border-white/10 z-10">
        <button 
          onClick={onClose}
          className="p-2 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h3 className="font-semibold text-white">Edit Image</h3>
        <button 
          onClick={resetCrop}
          className="p-2 text-white/70 hover:text-white transition-colors"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Main Cropper Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 bg-slate-900/50">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          className="max-h-[70vh]"
        >
          <img
            ref={imgRef}
            src={image}
            alt="Crop me"
            onLoad={onImageLoad}
            style={{ maxHeight: '70vh', width: 'auto' }}
          />
        </ReactCrop>
      </div>

      {/* Mobile-styled Footer */}
      <div className="p-6 pb-10 bg-black/50 backdrop-blur-md border-t border-white/10 flex flex-col gap-4">
        <p className="text-white/40 text-center text-xs uppercase tracking-widest font-bold">
          Drag corners to adjust focus
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-white font-bold rounded-2xl border border-white/20 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-cyan-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Proceed
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
