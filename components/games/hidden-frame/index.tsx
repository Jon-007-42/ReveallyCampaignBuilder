'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Find Ray-Ban Stellet'),
  brandColor: z.string().default('#000000'), // Synoptik Sort
  bgImage: z.string().default('https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=1000&auto=format&fit=crop'),
  targetEmoji: z.string().default('👓'), // Den man skal finde
  noiseEmojis: z.string().default('🕶️,🕶️,🕶️,😎,😎,🕶️'), // De andre (støj)
  winMessage: z.string().default('Godt spottet! Få 20% på alle Ray-Ban stel i dag.')
});

export const defaultConfig = {
  title: 'Find Ray-Ban Stellet',
  brandColor: '#000000',
  bgImage: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=1000&auto=format&fit=crop',
  targetEmoji: '👓',
  noiseEmojis: '🕶️,🕶️,🕶️,😎,😎,🕶️',
  winMessage: 'Godt spottet! Få 20% på alle Ray-Ban stel i dag.'
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
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Spil-opsætning</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Overskrift</label>
            <input 
              type="text" 
              value={config.title || defaultConfig.title} 
              onChange={e => updateConfig('title', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Target (Find denne)</label>
              <input 
                type="text" 
                value={config.targetEmoji || defaultConfig.targetEmoji} 
                onChange={e => updateConfig('targetEmoji', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center text-xl"
              />
            </div>
            <div className="flex-[2]">
              <label className="block text-sm font-medium text-slate-700 mb-1">Støj (Andre ikoner)</label>
              <input 
                type="text" 
                value={config.noiseEmojis || defaultConfig.noiseEmojis} 
                onChange={e => updateConfig('noiseEmojis', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <label className="block text-sm font-medium text-green-800 mb-1">Vinder Besked</label>
        <input 
          type="text" 
          value={config.winMessage || defaultConfig.winMessage} 
          onChange={e => updateConfig('winMessage', e.target.value)}
          className="w-full px-3 py-2 border border-green-200 rounded-lg text-sm bg-white"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 2. SELVE SPILLET
// ---------------------------------------------------------
export function GameComponent({ config }: { config: any }) {
  const safeConfig = { ...defaultConfig, ...config };
  const [items, setItems] = useState<{ emoji: string, x: number, y: number, isTarget: boolean, id: number }[]>([]);
  const [hasWon, setHasWon] = useState(false);
  const [shake, setShake] = useState(false);

  // Generer kaos-layout
  useEffect(() => {
    const noise = safeConfig.noiseEmojis.split(',');
    const newItems = [];
    
    // Lav 30-40 støj-elementer
    for (let i = 0; i < 35; i++) {
      newItems.push({
        id: i,
        emoji: noise[Math.floor(Math.random() * noise.length)],
        x: Math.random() * 80 + 10, // 10% til 90%
        y: Math.random() * 70 + 15,
        isTarget: false
      });
    }

    // Indsæt selve Target (vinderen) et tilfældigt sted
    newItems.push({
      id: 999,
      emoji: safeConfig.targetEmoji,
      x: Math.random() * 80 + 10,
      y: Math.random() * 70 + 15,
      isTarget: true
    });

    setItems(newItems.sort(() => Math.random() - 0.5));
    setHasWon(false);
  }, [safeConfig.targetEmoji, safeConfig.noiseEmojis]);

  const handleItemClick = (isTarget: boolean) => {
    if (hasWon) return;
    if (isTarget) {
      setHasWon(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col p-6 items-center overflow-hidden relative bg-cover bg-center"
      style={{ backgroundImage: `url(${safeConfig.bgImage})` }}
    >
      {/* Dark overlay for bedre læsbarhed */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      
      {/* Content (ovenpå overlay) */}
      <div className="relative z-10 w-full h-full flex flex-col">
        
        <div className="text-center mb-4">
          <h1 className="text-2xl font-black text-white drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {safeConfig.title}
          </h1>
          <p className="text-white text-xs bg-black/50 inline-block px-3 py-1 rounded-full mt-2">
            Find og klik på: {safeConfig.targetEmoji}
          </p>
        </div>

        <div className={`flex-1 w-full relative ${shake ? 'animate-bounce' : ''}`}>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.isTarget)}
              className="absolute text-3xl transition-transform hover:scale-125 p-2 drop-shadow-lg"
              style={{ 
                left: `${item.x}%`, 
                top: `${item.y}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'
              }}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      </div>

      {hasWon && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8 animate-in zoom-in duration-300">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Fundet!</h2>
            <p className="text-slate-600 mb-6 bg-yellow-50 p-3 rounded-lg border-2 border-yellow-400">
              {safeConfig.winMessage}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-full font-bold text-black"
              style={{ backgroundColor: '#FFD200' }}
            >
              Prøv igen
            </button>
          </div>
          <div className="absolute top-10 text-6xl animate-bounce">🎊 🎉</div>
        </div>
      )}
    </div>
  );
}
