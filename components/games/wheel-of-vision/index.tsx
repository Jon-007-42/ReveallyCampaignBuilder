'use client';

import React, { useState, useRef } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Vind med Synoptik'),
  brandColor: z.string().default('#FFD200'), // Synoptik Gul
  bgImage: z.string().default('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1000&auto=format&fit=crop'),
  segments: z.string().default('Gratis Synsprøve,25% på Solbriller,Nitte,Gratis Brillerens,10% på Kontaktlinser,Prøv Igen'),
  winMessage: z.string().default('Tillykke! Du vandt:')
});

export const defaultConfig = {
  title: 'Vind med Synoptik',
  brandColor: '#FFD200',
  bgImage: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1000&auto=format&fit=crop',
  segments: 'Gratis Synsprøve,25% på Solbriller,Nitte,Gratis Brillerens,10% på Kontaktlinser,Prøv Igen',
  winMessage: 'Tillykke! Du vandt:'
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Hovedfarve</label>
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
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Hjulets Felter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Felter (Adskilt med komma)</label>
            <textarea 
              value={config.segments || defaultConfig.segments} 
              onChange={e => updateConfig('segments', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-24"
              placeholder="Gave 1, Gave 2, Nitte..."
            />
            <p className="text-xs text-slate-500 mt-1">Skriv de præmier der skal stå på hjulet.</p>
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
    bgImage: config?.bgImage || defaultConfig.bgImage,
    segments: config?.segments || defaultConfig.segments,
    winMessage: config?.winMessage || defaultConfig.winMessage
  };

  const segments = safeConfig.segments.split(',').map((s: string) => s.trim());
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinner(null);

    // Find et tilfældigt stop (mellem 5 og 10 fulde rotationer + tilfældig vinkel)
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + (360 * 7) + extraDegrees;
    
    setRotation(totalRotation);

    // Find vinderen ud fra vinklen
    setTimeout(() => {
      const actualDegrees = totalRotation % 360;
      // Hjulet drejer med uret, men vi skal læse mod uret for at finde segmentet
      const invertedDegrees = 360 - actualDegrees;
      const segmentSize = 360 / segments.length;
      const winningIndex = Math.floor(invertedDegrees / segmentSize);
      
      setWinner(segments[winningIndex]);
      setIsSpinning(false);
    }, 4000); // Samme tid som CSS transitionen
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-6 bg-cover bg-center relative"
      style={{ backgroundImage: `url(${safeConfig.bgImage})` }}
    >
      {/* Dark overlay for bedre læsbarhed */}
      <div className="absolute inset-0 bg-black/65 z-0"></div>
      
      {/* Content (ovenpå overlay) */}
      <div className="relative z-10 flex flex-col items-center">
        
        <h1 className="text-3xl font-black mb-8 text-center text-white drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          {safeConfig.title}
        </h1>

        <div className="relative w-[300px] h-[300px]">
          {/* Pil i toppen */}
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20 w-8 h-8 text-3xl drop-shadow-md">
            🔻
          </div>

          {/* Selve Hjulet */}
          <div 
            className="w-full h-full rounded-full border-8 border-slate-800 shadow-2xl relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${segments.map((_: string, i: number) => 
                  `${i % 2 === 0 ? '#ffffff' : safeConfig.brandColor} ${i * (360/segments.length)}deg ${(i+1) * (360/segments.length)}deg`
                ).join(', ')})`
            }}
          >
            {/* Tekster på hjulet */}
            {segments.map((text: string, i: number) => (
              <div 
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 origin-left text-[10px] font-bold uppercase tracking-tighter"
                style={{ 
                  transform: `rotate(${i * (360/segments.length) + (180/segments.length)}deg) translate(40px, -50%)`,
                  color: i % 2 === 0 ? safeConfig.brandColor : '#000000',
                  width: '100px',
                  textAlign: 'right'
                }}
              >
                {text}
              </div>
            ))}
          </div>

          {/* Center knap */}
          <button 
            onClick={spin}
            disabled={isSpinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-800 text-white rounded-full font-black shadow-xl z-30 border-4 border-white hover:scale-110 transition-transform active:scale-95 disabled:bg-slate-400"
          >
            SPIN
          </button>
        </div>

        {/* Resultat display */}
        <div className="mt-12 h-20 text-center">
          {winner && (
            <div className="animate-in zoom-in fade-in duration-500 bg-white/95 p-4 rounded-2xl shadow-2xl">
              <p className="text-slate-500 font-medium">{safeConfig.winMessage}</p>
              <p className="text-2xl font-black text-slate-900">{winner}</p>
              <div className="mt-2 text-4xl">🎉</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
