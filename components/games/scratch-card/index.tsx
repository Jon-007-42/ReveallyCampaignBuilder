'use client';

import React, { useRef, useEffect, useState } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER (Til Game Registry)
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Skrab & Vind!'),
  brandColor: z.string().default('#3B82F6'),
  scratchColor: z.string().default('#C0C0C0'),
  winMessage: z.string().default('Rabatkode: SOMMER20')
});

export const defaultConfig = {
  title: 'Skrab & Vind!',
  brandColor: '#3B82F6',
  scratchColor: '#C0C0C0',
  winMessage: 'Rabatkode: SOMMER20'
};

// ---------------------------------------------------------
// 1. CONFIG EDITOR (Venstre side i din Builder)
// ---------------------------------------------------------
export function ConfigEditor({ config, onChange }: { config: any, onChange: (c: any) => void }) {
  const updateConfig = (key: string, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Udseende</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Brand Farve</label>
            <div className="flex gap-3">
              <input 
                type="color" 
                value={config.brandColor || '#3B82F6'} 
                onChange={e => updateConfig('brandColor', e.target.value)}
                className="w-12 h-12 rounded cursor-pointer border-0 p-0"
              />
              <input 
                type="text" 
                value={config.brandColor || '#3B82F6'}
                onChange={e => updateConfig('brandColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Skrabefelt Farve</label>
            <input 
              type="color" 
              value={config.scratchColor || '#C0C0C0'} 
              onChange={e => updateConfig('scratchColor', e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border-0 p-0"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Tekster & Præmier</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Overskrift</label>
            <input 
              type="text" 
              value={config.title || 'Skrab & Vind!'} 
              onChange={e => updateConfig('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <label className="block text-sm font-medium text-green-800 mb-1">Vinder Besked (Hvad står der under skrabelaget?)</label>
            <input 
              type="text" 
              value={config.winMessage || 'Rabatkode: SOMMER20'} 
              onChange={e => updateConfig('winMessage', e.target.value)}
              className="w-full px-3 py-2 border border-green-200 rounded-lg text-sm bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 2. SELVE SPILLET (Højre side i builder / Kundens mobil)
// ---------------------------------------------------------
export function GameComponent({ config }: { config: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Sikre standardværdier hvis config er tom
  const safeConfig = {
    title: config?.title || defaultConfig.title,
    brandColor: config?.brandColor || defaultConfig.brandColor,
    scratchColor: config?.scratchColor || defaultConfig.scratchColor,
    winMessage: config?.winMessage || defaultConfig.winMessage
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 150;

    // Fyld lærredet
    ctx.fillStyle = safeConfig.scratchColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SKRAB HER', canvas.width / 2, canvas.height / 2 + 7);

    ctx.globalCompositeOperation = 'destination-out';

    let isDrawing = false;

    const scratch = (x: number, y: number) => {
      if (!isDrawing) return;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      checkScratchPercentage();
    };

    const checkScratchPercentage = () => {
      if (isScratched) return;
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
      }

      const totalPixels = pixels.length / 4;
      const percentScratched = (transparentPixels / totalPixels) * 100;

      if (percentScratched > 40) {
        setIsScratched(true);
        setShowConfetti(true);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * canvas.width,
        y: ((clientY - rect.top) / rect.height) * canvas.height
      };
    };

    const handleStart = (e: any) => { isDrawing = true; const pos = getPos(e); scratch(pos.x, pos.y); };
    const handleMove = (e: any) => { if(isDrawing) e.preventDefault(); const pos = getPos(e); scratch(pos.x, pos.y); };
    const handleEnd = () => { isDrawing = false; };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);

    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [safeConfig.scratchColor, isScratched]);

  return (
    <div className="w-full h-full flex flex-col p-6 items-center" style={{ backgroundColor: safeConfig.brandColor }}>
      
      <div className="bg-white/10 w-full py-4 rounded-2xl mb-8 text-center backdrop-blur-sm border border-white/20">
        <h1 className="text-3xl font-black text-white drop-shadow-md">
          {safeConfig.title}
        </h1>
      </div>

      <div 
        ref={containerRef}
        className="relative w-[300px] h-[150px] bg-white rounded-xl shadow-2xl overflow-hidden flex items-center justify-center border-4 border-white"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-yellow-50 p-4 text-center">
          <span className="text-3xl mb-2">🎉</span>
          <p className="font-bold text-slate-800 text-lg">{safeConfig.winMessage}</p>
        </div>

        <canvas 
          ref={canvasRef}
          className={`absolute inset-0 cursor-crosshair z-10 transition-opacity duration-500 ${isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />
      </div>

      <div className="mt-8 text-white/80 text-sm font-medium">
        {isScratched ? 'Tillykke med præmien!' : 'Brug fingeren til at skrabe feltet'}
      </div>

      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-start z-50">
           <div className="text-6xl animate-bounce mt-20">🎊 🎈 🎉</div>
        </div>
      )}
      
    </div>
  );
}