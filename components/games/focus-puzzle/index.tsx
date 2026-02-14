'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Saml Puslespillet'),
  brandColor: z.string().default('#0F172A'),
  imageUrl: z.string().default('https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=300&h=300'),
  difficulty: z.number().default(3), // 3x3 gitter
  winMessage: z.string().default('Perfekt overblik! Her er din belønning.')
});

export const defaultConfig = {
  title: 'Saml Puslespillet',
  brandColor: '#0F172A',
  imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=300&h=300',
  difficulty: 3,
  winMessage: 'Perfekt overblik! Her er din belønning.'
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Baggrundsfarve</label>
            <input 
              type="color" 
              value={config.brandColor || defaultConfig.brandColor} 
              onChange={e => updateConfig('brandColor', e.target.value)}
              className="w-12 h-12 rounded cursor-pointer border-0 p-0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Billed-URL (Produktbillede)</label>
            <input 
              type="text" 
              value={config.imageUrl || defaultConfig.imageUrl} 
              onChange={e => updateConfig('imageUrl', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Præmie</h3>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <input 
            type="text" 
            value={config.winMessage || defaultConfig.winMessage} 
            onChange={e => updateConfig('winMessage', e.target.value)}
            className="w-full px-3 py-2 border border-green-200 rounded-lg text-sm"
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
  
  const [pieces, setPieces] = useState<number[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [hasWon, setHasWon] = useState(false);

  const size = safeConfig.difficulty; // 3 for 3x3

  // Initialiser og bland puslespil
  useEffect(() => {
    const initialPieces = Array.from({ length: size * size }, (_, i) => i);
    // Bland brikkerne
    const shuffled = [...initialPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setHasWon(false);
  }, [safeConfig.imageUrl, size]);

  const handlePieceClick = (index: number) => {
    if (hasWon) return;

    if (selectedPiece === null) {
      setSelectedPiece(index);
    } else {
      // Byt plads på de to brikker
      const newPieces = [...pieces];
      const temp = newPieces[selectedPiece];
      newPieces[selectedPiece] = newPieces[index];
      newPieces[index] = temp;
      
      setPieces(newPieces);
      setSelectedPiece(null);

      // Tjek om vundet
      if (newPieces.every((val, i) => val === i)) {
        setHasWon(true);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 items-center" style={{ backgroundColor: safeConfig.brandColor }}>
      <h1 className="text-2xl font-black text-white mb-6 drop-shadow-md">{safeConfig.title}</h1>

      <div 
        className="grid gap-1 bg-white/10 p-1 rounded-lg shadow-2xl"
        style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          width: '300px',
          height: '300px'
        }}
      >
        {pieces.map((pieceValue, index) => {
          const x = pieceValue % size;
          const y = Math.floor(pieceValue / size);
          
          return (
            <div
              key={index}
              onClick={() => handlePieceClick(index)}
              className={`relative overflow-hidden cursor-pointer rounded-sm transition-all duration-200 ${
                selectedPiece === index ? 'ring-4 ring-yellow-400 z-10 scale-105' : 'hover:opacity-90'
              }`}
              style={{
                backgroundImage: `url(${safeConfig.imageUrl})`,
                backgroundSize: `${size * 100}%`,
                backgroundPosition: `${(x / (size - 1)) * 100}% ${(y / (size - 1)) * 100}%`,
              }}
            >
              {hasWon && <div className="absolute inset-0 bg-green-500/20" />}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        {hasWon ? (
          <div className="bg-white p-4 rounded-xl shadow-xl text-center animate-in zoom-in">
            <p className="text-slate-900 font-bold">{safeConfig.winMessage}</p>
            <div className="text-4xl mt-2">🎉</div>
          </div>
        ) : (
          <p className="text-white/60 text-sm">Klik på to brikker for at bytte dem</p>
        )}
      </div>
    </div>
  );
}