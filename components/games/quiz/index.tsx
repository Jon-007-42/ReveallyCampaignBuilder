import React from 'react';
import { z } from 'zod';

export const configSchema = z.object({
  question: z.string(),
  answers: z.array(z.string()),
  correctIndex: z.number(),
});

export const defaultConfig = {
  question: 'Hvor ofte skal man have synstest?',
  answers: ['Hvert år', 'Hvert 10. år', 'Aldrig'],
  correctIndex: 0,
};

export const ConfigEditor = ({ config, onChange }: any) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold">Quiz Indstillinger</h3>
      <div>
        <label className="block text-sm">Spørgsmål</label>
        <input 
          type="text" 
          value={config.question} 
          onChange={e => onChange({...config, question: e.target.value})}
          className="w-full border p-2 rounded"
        />
      </div>
    </div>
  );
};

export const GameComponent = ({ config }: any) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">{config.question}</h2>
      <div className="space-y-2">
        {config.answers.map((ans: string, i: number) => (
          <button key={i} className="w-full p-3 bg-blue-50 text-blue-900 rounded-lg text-left">
            {ans}
          </button>
        ))}
      </div>
    </div>
  );
};