'use client';

import React, { useState } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Vinter Kalender'),
  brandColor: z.string().default('#1E293B'),
  doorsCount: z.number().default(7),
  rewards: z.string().default('10% Rabat,Fri Fragt,Gratis Rens,Nitte,5% Rabat,Bonus Point,20% Rabat'),
});

export const defaultConfig = {
  title: 'Vinter Kalender',
  brandColor: '#1E293B',
  doorsCount: 7,
  rewards: '10% Rabat,Fri Fragt,Gratis Rens,Nitte,5% Rabat,Bonus Point,20% Rabat',
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
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Opsætning</h3>
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Antal Låger</label>
            <select 
              value={config.doorsCount || defaultConfig.doorsCount} 
              onChange={e => updateConfig('doorsCount', Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value={7}>7 Dage (Uge)</option>
              <option value={12}>12 Dage</option>
              <option value={24}>24 Dage (Jul)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Præmier (Adskilt med komma)</label>
        <textarea 
          value={config.rewards || defaultConfig.rewards} 
          onChange={e => updateConfig('rewards', e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-24"
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
  const rewards = safeConfig.rewards.split(',').map((r: string) => r.trim());
  
  // Vi simulerer "i dag" som værende dag 3 for demoens skyld
  const [openedDoors, setOpenedDoors] = useState<number[]>([]);
  const currentDay = 3; 

  const handleDoorClick = (day: number) => {
    if (day > currentDay) {
      alert("Tålmodighed! Denne låge kan først åbnes senere.");
      return;
    }
    if (!openedDoors.includes(day)) {
      setOpenedDoors([...openedDoors, day]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 items-center overflow-y-auto" style={{ backgroundColor: safeConfig.brandColor }}>
      <h1 className="text-2xl font-black text-white mb-8 text-center uppercase tracking-widest drop-shadow-lg">
        {safeConfig.title}
      </h1>

      <div className="grid grid-cols-3 gap-4 w-full max-w-[320px]">
        {Array.from({ length: safeConfig.doorsCount }, (_, i) => i + 1).map((day) => {
          const isOpen = openedDoors.includes(day);
          const isLocked = day > currentDay;

          return (
            <div 
              key={day}
              onClick={() => handleDoorClick(day)}
              className={`
                relative h-24 rounded-lg border-2 transition-all duration-500 cursor-pointer
                flex items-center justify-center font-bold text-xl
                ${isOpen 
                  ? 'bg-white border-white scale-95 shadow-inner text-slate-900' 
                  : 'bg-slate-700 border-slate-500 text-white hover:border-white shadow-xl'}
                ${isLocked ? 'opacity-40 grayscale cursor-not-allowed' : ''}
              `}
              style={isOpen ? { transform: 'rotateY(180deg)' } : {}}
            >
              {isOpen ? (
                <div className="text-[10px] text-center p-1 leading-tight" style={{ transform: 'rotateY(-180deg)' }}>
                  <span className="block text-lg mb-1">🎁</span>
                  {rewards[day - 1] || 'Bonus'}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-xs opacity-50 mb-1">DAG</span>
                  {day}
                  {isLocked && <span className="text-[10px] mt-1">🔒</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-white/50 text-xs text-center">
        Kom tilbage hver dag for at åbne en ny låge!
      </p>
    </div>
  );
}