'use client';

import React, { useRef, useEffect, useState } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Tør Duggen Af!'),
  brandColor: z.string().default('#0F172A'), // Mørk, vinterlig baggrund (Slate 900)
  wipeColor: z.string().default('rgba(255, 255, 255, 0.85)'), // Halvgennemsigtig hvid (Dug/Frost)
  winMessage: z.string().default('Varm kaffe på vores regning! ☕'),
  bgImageText: z.string().default('❄️ VINTER UDSALG ❄️') // Teksten der gemmer sig bag duggen
});

export const defaultConfig = {
  title: 'Tør Duggen Af!',
  brandColor: '#0F172A',
  wipeColor: 'rgba(255, 255, 255, 0.85)',
  winMessage: 'Varm kaffe på vores regning! ☕',
  bgImageText: '❄️ VINTER UDSALG ❄️'
};

// ---------------------------------------------------------
// 1. CONFIG EDITOR (Venstre side)
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Baggrundsfarve (Rammen)</label>
            <div className="flex gap-3">
              <input 
                type="color" 
                value={config.brandColor || defaultConfig.brandColor} 
                onChange={e => updateConfig('brandColor', e.target.value)}
                className="w-12 h-12 rounded cursor-pointer border-0 p-0"
              />
            </div>
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
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Indhold bag duggen</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gemt Besked (F.eks. Butiksvindue)</label>
            <input 
              type="text" 
              value={config.bgImageText || defaultConfig.bgImageText} 
              onChange={e => updateConfig('bgImageText', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center"
            />
            <p className="text-xs text-slate-500 mt-1">Dette er teksten, kunden ser "igennem" ruden, mens de tørrer af.</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <label className="block text-sm font-medium text-blue-900 mb-1">Præmie Besked (Når duggen er væk)</label>
            <input 
              type="text" 
              value={config.winMessage || defaultConfig.winMessage} 
              onChange={e => updateConfig('winMessage', e.target.value)}
              className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 2. SELVE SPILLET (Højre side)
// ---------------------------------------------------------
export function GameComponent({ config }: { config: any }) {
  const safeConfig = {
    title: config?.title || defaultConfig.title,
    brandColor: config?.brandColor || defaultConfig.brandColor,
    wipeColor: config?.wipeColor || defaultConfig.wipeColor,
    winMessage: config?.winMessage || defaultConfig.winMessage,
    bgImageText: config?.bgImageText || defaultConfig.bgImageText
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWiped, setIsWiped] = useState(false);
  const [showSnow, setShowSnow] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sæt canvas størrelse
    canvas.width = 300;
    canvas.height = 250;

    // 1. Tegn dug-laget (Halvgennemsigtig hvid med lidt støj/gradient for realismens skyld)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(230, 240, 255, 0.8)'); // Lidt blålig i bunden
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Skriv instruktion i "duggen" (som om nogen har skrevet med fingeren)
    ctx.fillStyle = 'rgba(100, 150, 200, 0.5)'; // Blålig farve der ligner gennemsigtig dug
    ctx.font = '24px "Comic Sans MS", cursive, sans-serif'; // Giver et mere håndskrevet look
    ctx.textAlign = 'center';
    ctx.fillText('Skrub Her', canvas.width / 2, canvas.height / 2);

    ctx.globalCompositeOperation = 'destination-out';
    let isDrawing = false;

    const wipe = (x: number, y: number) => {
      if (!isDrawing) return;
      ctx.beginPath();
      // "Viskelæderet" er lidt større her for at simulere en hel finger/håndflade
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      // Gør kanten af viskelæderet sløret for en mere realistisk "tørre"-effekt
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'black';
      ctx.fill();
      
      checkWipePercentage();
    };

    const checkWipePercentage = () => {
      if (isWiped) return;
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;

      // Kun kig på alpha-kanalen (hver 4. værdi)
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 50) transparentPixels++; // Tæl pixels der er næsten helt gennemsigtige
      }

      const totalPixels = pixels.length / 4;
      const percentWiped = (transparentPixels / totalPixels) * 100;

      if (percentWiped > 45) {
        setIsWiped(true);
        setShowSnow(true);
        // Animer fjernelsen af det sidste dug via CSS i stedet for Canvas for et blødere look
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

    const handleStart = (e: any) => { isDrawing = true; const pos = getPos(e); wipe(pos.x, pos.y); };
    const handleMove = (e: any) => { if(isDrawing) e.preventDefault(); const pos = getPos(e); wipe(pos.x, pos.y); };
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
  }, [safeConfig.wipeColor, isWiped]);

  return (
    <div className="w-full h-full flex flex-col p-6 items-center bg-cover bg-center" style={{ backgroundColor: safeConfig.brandColor }}>
      
      <div className="w-full py-4 mb-8 text-center">
        <h1 className="text-3xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wide">
          {safeConfig.title}
        </h1>
      </div>

      <div 
        ref={containerRef}
        className="relative w-[300px] h-[250px] bg-slate-200 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] overflow-hidden flex items-center justify-center border-8 border-slate-800"
      >
        {/* LAG 1: Det der er "bagved" ruden (Butikken/Præmien) */}
        <div className="absolute inset-0 bg-blue-900 flex flex-col items-center justify-center p-4 text-center">
          {/* Falsk "baggrundsbillede" (Kan gøres dynamisk senere) */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brick-wall-dark.png')]"></div>
          
          {!isWiped ? (
            <h2 className="text-3xl font-bold text-white opacity-40 blur-[2px]">
              {safeConfig.bgImageText}
            </h2>
          ) : (
             <div className="z-10 animate-in zoom-in duration-500">
               <span className="text-4xl block mb-2">🎁</span>
               <p className="font-bold text-white text-xl bg-blue-800/80 p-3 rounded-xl border border-blue-400">
                 {safeConfig.winMessage}
               </p>
             </div>
          )}
        </div>

        {/* LAG 2: Selve Duggen (Canvas) */}
        <canvas 
          ref={canvasRef}
          className={`absolute inset-0 z-10 transition-opacity duration-1000 ease-in-out touch-none ${isWiped ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`}
          style={{ filter: 'drop-shadow(0px 0px 5px rgba(255,255,255,0.5))' }} // Giver duggen lidt glød
        />
      </div>

      <div className="mt-8 text-white/60 text-sm font-medium">
        {isWiped ? 'Fantastisk!' : 'Gnid på skærmen for at se ruden'}
      </div>

      {/* SNE-EFFEKT i stedet for Konfetti */}
      {showSnow && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center z-50">
           <div className="text-4xl animate-[bounce_3s_infinite] mt-10 ml-10 opacity-70">❄️</div>
           <div className="text-3xl animate-[bounce_4s_infinite] mt-20 mr-20 opacity-50">❄️</div>
           <div className="text-5xl animate-[bounce_2s_infinite] mt-5 ml-32 opacity-80">❄️</div>
        </div>
      )}
      
    </div>
  );
}