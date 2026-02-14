'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Sommer Spin!'),
  brandColor: z.string().default('#F59E0B'), // Rav/Guld farve for casino-vibe
  symbols: z.string().default('🕶️,☀️,🏖️,🍹,🍦'), // Ikoner adskilt af komma
  winMessage: z.string().default('JACKPOT! 20% Rabat på solbriller!')
});

export const defaultConfig = {
  title: 'Sommer Spin!',
  brandColor: '#F59E0B',
  symbols: '🕶️,☀️,🏖️,🍹,🍦',
  winMessage: 'JACKPOT! 20% Rabat på solbriller!'
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Brand Farve</label>
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
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Spilmekanik</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Symboler (Adskilt med komma)</label>
            <input 
              type="text" 
              value={config.symbols || defaultConfig.symbols} 
              onChange={e => updateConfig('symbols', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-2xl"
              placeholder="🍒,🍋,🔔,⭐"
            />
            <p className="text-xs text-slate-500 mt-1">Brug emojis eller tekst. Kræver mindst 2 forskellige.</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <label className="block text-sm font-medium text-green-800 mb-1">Vinder Besked (Når man får 3 på stribe)</label>
            <input 
              type="text" 
              value={config.winMessage || defaultConfig.winMessage} 
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
// 2. SELVE SPILLET (Højre side)
// ---------------------------------------------------------
export function GameComponent({ config }: { config: any }) {
  const safeConfig = {
    title: config?.title || defaultConfig.title,
    brandColor: config?.brandColor || defaultConfig.brandColor,
    symbols: config?.symbols || defaultConfig.symbols,
    winMessage: config?.winMessage || defaultConfig.winMessage
  };

  const symbolsArray = safeConfig.symbols.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
  
  // States
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState([symbolsArray[0], symbolsArray[1] || symbolsArray[0], symbolsArray[2] || symbolsArray[0]]);
  const [result, setResult] = useState<'idle' | 'win' | 'lose'>('idle');

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult('idle');

    let spins = 0;
    
    // Animation: Skifter symboler hurtigt
    const interval = setInterval(() => {
      setReels([
        symbolsArray[Math.floor(Math.random() * symbolsArray.length)],
        symbolsArray[Math.floor(Math.random() * symbolsArray.length)],
        symbolsArray[Math.floor(Math.random() * symbolsArray.length)],
      ]);
      spins++;

      // Stop animationen efter 1.5 sekund (15 spins)
      if (spins > 15) {
        clearInterval(interval);
        setSpinning(false);
        
        // --- PITCH MAGI: 50% chance for at vinde! ---
        // (I en rigtig app ville vi hente vinderchancen fra serveren)
        const isWin = Math.random() > 0.5; 
        
        if (isWin) {
          const winSymbol = symbolsArray[Math.floor(Math.random() * symbolsArray.length)];
          setReels([winSymbol, winSymbol, winSymbol]);
          setResult('win');
        } else {
          // Garanteret IKKE et match
          setReels([symbolsArray[0], symbolsArray[1] || symbolsArray[0], symbolsArray[0]]);
          setResult('lose');
        }
      }
    }, 100);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 items-center justify-center" style={{ backgroundColor: safeConfig.brandColor }}>
      
      {/* Header */}
      <div className="bg-black/20 w-full py-4 rounded-2xl mb-12 text-center backdrop-blur-sm shadow-inner">
        <h1 className="text-3xl font-black text-white tracking-widest uppercase drop-shadow-md">
          {safeConfig.title}
        </h1>
      </div>

      {/* Spillemaskinen */}
      <div className="bg-slate-800 p-4 rounded-3xl shadow-2xl w-full max-w-[320px] relative border-b-8 border-slate-900">
        
        {/* Selve hjulene */}
        <div className="bg-white rounded-xl p-4 flex justify-between gap-2 shadow-inner h-32 items-center overflow-hidden">
          {reels.map((symbol, index) => (
            <div 
              key={index} 
              className={`w-1/3 h-24 bg-slate-100 rounded-lg flex items-center justify-center text-5xl shadow-inner border-y-4 border-slate-200 transition-transform ${spinning ? 'animate-pulse' : ''}`}
            >
              {symbol}
            </div>
          ))}
        </div>

        {/* Håndtag / Knap */}
        <button 
          onClick={spin}
          disabled={spinning || result === 'win'}
          className={`w-full mt-6 py-4 rounded-xl font-black text-2xl tracking-widest transition-all shadow-lg
            ${spinning 
              ? 'bg-slate-600 text-slate-400 translate-y-2 shadow-none' 
              : result === 'win'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white hover:bg-red-600 active:translate-y-2 active:shadow-none border-b-4 border-red-700'
            }`}
        >
          {spinning ? 'DREJER...' : result === 'win' ? 'VUNDET!' : 'SPIN'}
        </button>
      </div>

      {/* Resultat Besked */}
      <div className="mt-8 h-20 flex items-center justify-center text-center">
        {result === 'win' && (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="text-4xl mb-2">🎉</div>
            <div className="bg-white text-slate-900 font-bold px-6 py-3 rounded-xl shadow-xl">
              {safeConfig.winMessage}
            </div>
          </div>
        )}
        {result === 'lose' && (
          <div className="text-white/80 font-medium bg-black/20 px-4 py-2 rounded-lg animate-in fade-in">
            Øv, ingen gevinst. Prøv igen!
          </div>
        )}
      </div>

      {/* Konfetti */}
      {result === 'win' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-start z-50">
           <div className="text-7xl animate-bounce mt-20">💰 🎊 💰</div>
        </div>
      )}
    </div>
  );
}