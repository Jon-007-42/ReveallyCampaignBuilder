import React from 'react';
import { z } from 'zod';

// 1. Konfigurationen (Hvad kan din partner ændre?)
export const configSchema = z.object({
  prizes: z.array(z.object({
    label: z.string(),
    probability: z.number(),
  })),
  brandColor: z.string(),
  winMessage: z.string(),
});

export const defaultConfig = {
  prizes: [{ label: '10% Rabat', probability: 0.5 }, { label: 'Nitte', probability: 0.5 }],
  brandColor: '#FF0000',
  winMessage: 'Tillykke! Du vandt!',
};

// 2. Editoren (Venstre side af skærmen)
export const ConfigEditor = ({ config, onChange }: any) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Indstillinger for Skrab</h3>
      <div>
        <label className="block text-sm">Brand Farve</label>
        <input 
          type="color" 
          value={config.brandColor} 
          onChange={e => onChange({...config, brandColor: e.target.value})}
          className="w-full h-10 cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-sm">Vinder Besked</label>
        <input 
          type="text" 
          value={config.winMessage} 
          onChange={e => onChange({...config, winMessage: e.target.value})}
          className="w-full border p-2 rounded"
        />
      </div>
    </div>
  );
};

// 3. Spillet (Højre side + Mobil visning)
// HER skal du indsætte din Canvas-kode fra i går senere!
export const GameComponent = ({ config }: any) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100" style={{border: `4px solid ${config.brandColor}`}}>
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{config.winMessage}</h1>
        <div className="w-64 h-32 bg-gray-300 rounded mx-auto flex items-center justify-center text-gray-500">
          [SKRAB FELT HER]
        </div>
      </div>
    </div>
  );
};