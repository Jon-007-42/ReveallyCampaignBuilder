'use client';

import React, { useState } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER (Til Game Registry)
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Synoptik Eye-Q'),
  brandColor: z.string().default('#FFD200'), // Synoptik Gul
  bgImage: z.string().default('https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop'),
  question: z.string().default('Hvor ofte anbefaler vi, at du får lavet en Certificeret Synsprøve?'),
  answer1: z.string().default('Hvert 5. år'),
  answer2: z.string().default('Hvert 2. år (Korrekt)'),
  answer3: z.string().default('Kun hvis jeg kniber øjnene sammen'),
  correctAnswer: z.number().default(2), // Svar nr. 2 er det rigtige
  winMessage: z.string().default('Helt rigtigt! Få en Gratis Certificeret Synsprøve (Værdi 298 kr.)')
});

export const defaultConfig = {
  title: 'Synoptik Eye-Q',
  brandColor: '#FFD200',
  bgImage: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop',
  question: 'Hvor ofte anbefaler vi, at du får lavet en Certificeret Synsprøve?',
  answer1: 'Hvert 5. år',
  answer2: 'Hvert 2. år (Korrekt)',
  answer3: 'Kun hvis jeg kniber øjnene sammen',
  correctAnswer: 2,
  winMessage: 'Helt rigtigt! Få en Gratis Certificeret Synsprøve (Værdi 298 kr.)'
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
                value={config.brandColor || defaultConfig.brandColor} 
                onChange={e => updateConfig('brandColor', e.target.value)}
                className="w-12 h-12 rounded cursor-pointer border-0 p-0"
              />
            </div>
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
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Spørgsmål & Svar</h3>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Selve Spørgsmålet</label>
            <textarea 
              value={config.question || defaultConfig.question} 
              onChange={e => updateConfig('question', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-20"
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <label className="block text-sm font-bold text-slate-900 mb-2">Svarmuligheder</label>
            
            {/* Svar 1 */}
            <div className="flex items-center gap-3">
              <input 
                type="radio" 
                name="correct_answer" 
                checked={config.correctAnswer === 1}
                onChange={() => updateConfig('correctAnswer', 1)}
                className="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <input 
                type="text" 
                value={config.answer1 || defaultConfig.answer1} 
                onChange={e => updateConfig('answer1', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Svarmulighed 1"
              />
            </div>

            {/* Svar 2 */}
            <div className="flex items-center gap-3">
              <input 
                type="radio" 
                name="correct_answer" 
                checked={config.correctAnswer === 2 || !config.correctAnswer} // Default til 2
                onChange={() => updateConfig('correctAnswer', 2)}
                className="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <input 
                type="text" 
                value={config.answer2 || defaultConfig.answer2} 
                onChange={e => updateConfig('answer2', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Svarmulighed 2"
              />
            </div>

            {/* Svar 3 */}
            <div className="flex items-center gap-3">
              <input 
                type="radio" 
                name="correct_answer" 
                checked={config.correctAnswer === 3}
                onChange={() => updateConfig('correctAnswer', 3)}
                className="w-4 h-4 text-blue-600 cursor-pointer"
              />
              <input 
                type="text" 
                value={config.answer3 || defaultConfig.answer3} 
                onChange={e => updateConfig('answer3', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Svarmulighed 3"
              />
            </div>
            <p className="text-xs text-slate-500 italic mt-2">Markér cirklen ud for det rigtige svar.</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Præmie</h3>
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
    </div>
  );
}

// ---------------------------------------------------------
// 2. SELVE SPILLET (Højre side i builder / Kundens mobil)
// ---------------------------------------------------------
export function GameComponent({ config }: { config: any }) {
  const [hasWon, setHasWon] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState<number | null>(null);

  const safeConfig = {
    title: config?.title || defaultConfig.title,
    brandColor: config?.brandColor || defaultConfig.brandColor,
    bgImage: config?.bgImage || defaultConfig.bgImage,
    question: config?.question || defaultConfig.question,
    answer1: config?.answer1 || defaultConfig.answer1,
    answer2: config?.answer2 || defaultConfig.answer2,
    answer3: config?.answer3 || defaultConfig.answer3,
    correctAnswer: config?.correctAnswer || defaultConfig.correctAnswer,
    winMessage: config?.winMessage || defaultConfig.winMessage
  };

  const handleAnswer = (answerNumber: number) => {
    if (answerNumber === safeConfig.correctAnswer) {
      setHasWon(true);
      setWrongAnswer(null);
    } else {
      // Sætter wrongAnswer for at udløse en lille "ryste" animation
      setWrongAnswer(answerNumber);
      setTimeout(() => setWrongAnswer(null), 500); // Fjern ryste-effekt efter et halvt sekund
    }
  };

  if (hasWon) {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${safeConfig.bgImage})` }}
      >
        {/* Dark overlay for at gøre baggrunden læselig */}
        <div className="absolute inset-0 bg-black/70 z-0"></div>
        
        <div className="bg-white p-8 rounded-3xl shadow-2xl relative overflow-hidden w-full max-w-[300px] z-10">
           <div className="text-6xl mb-4">🏆</div>
           <h2 className="text-2xl font-black text-slate-900 mb-4">Korrekt!</h2>
           <p className="text-lg font-medium text-slate-700 bg-yellow-50 p-4 rounded-xl border-2 border-yellow-400">
             {safeConfig.winMessage}
           </p>
        </div>
        
        {/* Konfetti! */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-start z-50">
           <div className="text-6xl animate-bounce mt-20">🎊 🎈 🎉</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full flex flex-col p-6 items-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${safeConfig.bgImage})` }}
    >
      {/* Dark overlay for bedre læsbarhed */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      
      {/* Content (ovenpå overlay) */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* Brand Header */}
        <div 
          className="w-full py-4 rounded-2xl mb-8 text-center backdrop-blur-sm border-2"
          style={{ 
            backgroundColor: `${safeConfig.brandColor}20`,
            borderColor: safeConfig.brandColor
          }}
        >
          <h1 className="text-2xl font-black text-white drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {safeConfig.title}
          </h1>
        </div>

        {/* Spørgsmål Boks */}
        <div className="bg-white w-full rounded-3xl shadow-2xl p-6 mb-8 relative">
          <div 
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 font-bold px-4 py-1 rounded-full shadow-md text-sm text-black"
            style={{ backgroundColor: safeConfig.brandColor }}
          >
            Dagens Spørgsmål
          </div>
          <p className="text-xl font-bold text-slate-800 text-center mt-4">
            {safeConfig.question}
          </p>
        </div>

        {/* Svarmuligheder */}
        <div className="w-full space-y-4">
          {[1, 2, 3].map((num) => {
            const answerText = num === 1 ? safeConfig.answer1 : num === 2 ? safeConfig.answer2 : safeConfig.answer3;
            const isWrong = wrongAnswer === num;
            
            return (
              <button
                key={num}
                onClick={() => handleAnswer(num)}
                // Hvis svaret er forkert, tilføjer vi en rød farve og en lille ryste-effekt
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all
                  ${isWrong 
                    ? 'bg-red-500 text-white translate-x-[-10px]' // Ryste-effekt (Simpel)
                    : 'bg-white text-slate-800 hover:scale-105 active:scale-95'
                  }
                `}
                style={isWrong ? { transition: 'transform 0.1s ease-in-out' } : {}}
              >
                {answerText}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
