'use client';

import React, { useRef, useEffect, useState } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Puds glasset helt rent'),
  brandColor: z.string().default('#FFD200'), // Synoptik Gul
  bgImage: z.string().default('https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop'),
  winMessage: z.string().default('Skarpt syn! Kom ind og få et gratis rensesæt.'),
  productName: z.string().default('Synoptik Premium Brillerens')
});

export const defaultConfig = {
  title: 'Puds glasset helt rent',
  brandColor: '#FFD200',
  bgImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop',
  winMessage: 'Skarpt syn! Kom ind og få et gratis rensesæt.',
  productName: 'Synoptik Premium Brillerens'
};

// ---------------------------------------------------------
// 1. CONFIG EDITOR
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
            <input 
              type="color" 
              value={config.brandColor || defaultConfig.brandColor} 
              onChange={e => updateConfig('brandColor', e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border-0 p-0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Baggrundsbillede URL</label>
            <input 
              type="text" 
              value={config.bgImage || defaultConfig.bgImage} 
              onChange={e => updateConfig('bgImage', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-xs text-slate-500 mt-1">Tip: Brug Unsplash eller din egen hosting</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Overskrift</label>
            <input 
              type="text" 
              value={config.title || defaultConfig.title} 
              onChange={e => updateConfig('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Produkt Navn</label>
            <input 
              type="text" 
              value={config.productName || defaultConfig.productName} 
              onChange={e => updateConfig('productName', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Præmie</h3>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <input 
            type="text" 
            value={config.winMessage || defaultConfig.winMessage} 
            onChange={e => updateConfig('winMessage', e.target.value)}
            className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white"
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 2. SELVE SPILLET
// ---------------------------------------------------------
export function GameComponent({ config }: { config: any }) {
  const safeConfig = { ...defaultConfig, ...config };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClean, setIsClean] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 200;

    // Tegn "Snavset" (Gullige/grå pletter og slør)
    ctx.fillStyle = 'rgba(200, 190, 150, 0.4)'; // "Fedt-farve"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tilføj tilfældige "pletter"
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 10 + Math.random() * 20, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 140, 100, ${Math.random() * 0.3})`;
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'destination-out';
    let isDrawing = false;

    const clean = (x: number, y: number) => {
      if (!isDrawing) return;
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
      
      // Tjek fremskridt
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let cleanPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 10) cleanPixels++;
      }
      if ((cleanPixels / (pixels.length / 4)) > 0.6) {
        setIsClean(true);
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

    const handleStart = (e: any) => { isDrawing = true; const pos = getPos(e); clean(pos.x, pos.y); };
    const handleMove = (e: any) => { if(isDrawing) e.preventDefault(); const pos = getPos(e); clean(pos.x, pos.y); };
    const handleEnd = () => { isDrawing = false; };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [isClean]);

  return (
    <div 
      className="w-full h-full flex flex-col p-6 items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${safeConfig.bgImage})` }}
    >
      {/* Dark overlay for bedre læsbarhed */}
      <div className="absolute inset-0 bg-black/65 z-0"></div>
      
      {/* Content (ovenpå overlay) */}
      <div className="relative z-10 flex flex-col items-center">
        
        <h1 className="text-2xl font-bold text-white mb-8 drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          {safeConfig.title}
        </h1>

        <div className="relative w-[300px] h-[200px] rounded-3xl overflow-hidden shadow-2xl border-4" style={{ borderColor: safeConfig.brandColor }}>
          {/* Det skarpe billede (Præmien/Resultatet) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4" style={{ backgroundColor: safeConfig.brandColor }}>
            <span className="text-4xl mb-2">✨</span>
            <p className="font-bold text-slate-900 leading-tight">{safeConfig.productName}</p>
            {isClean && (
              <p className="mt-2 text-sm text-slate-900 font-bold animate-bounce bg-white px-3 py-1 rounded-full">
                {safeConfig.winMessage}
              </p>
            )}
          </div>

          {/* Snavs-laget */}
          <canvas 
            ref={canvasRef}
            className={`absolute inset-0 z-10 transition-opacity duration-1000 ${isClean ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          />
        </div>

        <p className="mt-6 text-white text-sm italic bg-black/50 px-4 py-2 rounded-full">
          {isClean ? 'Perfekt resultat!' : 'Brug fingeren til at pudse glasset rent...'}
        </p>
      </div>
    </div>
  );
}
