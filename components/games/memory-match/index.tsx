'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Find Parrene!'),
  brandColor: z.string().default('#8B5CF6'), // En flot lilla standardfarve
  cardBackDesign: z.string().default('❓'), // Hvad der står på bagsiden af kortet
  symbols: z.string().default('🕶️,👓,🥽,👁️,🧴,😎'), // 6 ikoner der danner 6 par
  winMessage: z.string().default('Fantastisk hukommelse! Her er din gave.')
});

export const defaultConfig = {
  title: 'Find Parrene!',
  brandColor: '#8B5CF6',
  cardBackDesign: '❓',
  symbols: '🕶️,👓,🥽,👁️,🧴,😎',
  winMessage: 'Fantastisk hukommelse! Her er din gave.'
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kort Bagside (Ikon/Emoji)</label>
            <input 
              type="text" 
              value={config.cardBackDesign || defaultConfig.cardBackDesign} 
              onChange={e => updateConfig('cardBackDesign', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center text-xl"
              maxLength={2}
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-200 w-full" />

      <div>
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Spilmekanik</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">De 6 Par (Adskilt med komma)</label>
            <input 
              type="text" 
              value={config.symbols || defaultConfig.symbols} 
              onChange={e => updateConfig('symbols', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-xl"
              placeholder="🍎,🍌,🍇,🍉,🍓,🍒"
            />
            <p className="text-xs text-slate-500 mt-1">Skriv præcis 6 Emojis (eller korte tekster). De bliver automatisk fordoblet til 12 kort.</p>
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
    cardBackDesign: config?.cardBackDesign || defaultConfig.cardBackDesign,
    symbols: config?.symbols || defaultConfig.symbols,
    winMessage: config?.winMessage || defaultConfig.winMessage
  };

  // Types til kortene
  type Card = { id: number; symbol: string; isFlipped: boolean; isMatched: boolean };
  
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // Forhindrer at man klikker mens to forkerte kort vises

  // Initialiser spillet (Bland kortene)
  useEffect(() => {
    startNewGame();
  }, [safeConfig.symbols]); // Genstart hvis symbolerne ændres i editoren

  const startNewGame = () => {
    // Hent de første 6 symboler fra inputtet
    const baseSymbols = safeConfig.symbols.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0).slice(0, 6);
    
    // Hvis brugeren har skrevet for få, fylder vi op
    while (baseSymbols.length < 6) baseSymbols.push('🌟');

    // Fordobl dem (så vi har par)
    const pairSymbols = [...baseSymbols, ...baseSymbols];
    
    // Bland dem tilfældigt
    const shuffledCards = pairSymbols
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol: symbol,
        isFlipped: false,
        isMatched: false
      }));

    setCards(shuffledCards);
    setFlippedIndexes([]);
    setMoves(0);
    setHasWon(false);
    setIsLocked(false);
  };

  const handleCardClick = (index: number) => {
    // Stop hvis låst, allerede vendt, eller matchet
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    // Vend kortet
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndexes = [...flippedIndexes, index];
    setFlippedIndexes(newFlippedIndexes);

    // Tjek match hvis 2 kort er vendt
    if (newFlippedIndexes.length === 2) {
      setIsLocked(true); // Lås spillet et øjeblik
      setMoves(moves + 1);

      const [firstIndex, secondIndex] = newFlippedIndexes;

      if (newCards[firstIndex].symbol === newCards[secondIndex].symbol) {
        // MATCH!
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndexes([]);
          setIsLocked(false);

          // Tjek om alle er fundet
          if (matchedCards.every(card => card.isMatched)) {
            setHasWon(true);
          }
        }, 500); // Lille forsinkelse for effekten
      } else {
        // IKKE MATCH - vend tilbage
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedIndexes([]);
          setIsLocked(false);
        }, 1000); // Vises i 1 sekund før de vender tilbage
      }
    }
  };

  // Vinder-Skærmen
  if (hasWon) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: safeConfig.brandColor }}>
        <div className="bg-white p-8 rounded-3xl shadow-2xl relative overflow-hidden w-full max-w-[300px]">
           <div className="text-5xl mb-2">🧠</div>
           <h2 className="text-xl font-black text-slate-900 mb-1">Gennemført!</h2>
           <p className="text-slate-500 mb-4 text-sm">Du brugte {moves} træk.</p>
           
           <p className="text-lg font-medium text-slate-700 bg-green-50 p-4 rounded-xl border border-green-100 mb-4">
             {safeConfig.winMessage}
           </p>

           <button 
             onClick={startNewGame}
             className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm transition-colors"
           >
             Spil Igen
           </button>
        </div>
        
        {/* Konfetti! */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-start z-50">
           <div className="text-6xl animate-bounce mt-20">🎊 🎈 🎉</div>
        </div>
      </div>
    );
  }

  // Spille-Skærmen
  return (
    <div className="w-full h-full flex flex-col p-6 items-center" style={{ backgroundColor: safeConfig.brandColor }}>
      
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6 px-2">
        <h1 className="text-xl font-black text-white drop-shadow-md">
          {safeConfig.title}
        </h1>
        <div className="bg-black/20 text-white font-bold px-3 py-1 rounded-full text-sm">
          Træk: {moves}
        </div>
      </div>

      {/* Kort-Gitteret (4 rækker med 3 kort) */}
      <div className="w-full max-w-[320px] grid grid-cols-3 gap-3 perspective-1000">
        {cards.map((card, index) => (
          <div 
            key={index} 
            onClick={() => handleCardClick(index)}
            className="relative w-full aspect-square cursor-pointer group"
            style={{ perspective: '1000px' }}
          >
            {/* Kort Animation Container */}
            <div 
              className={`w-full h-full relative transition-transform duration-500`}
              style={{ 
                transformStyle: 'preserve-3d',
                transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* FORSIDEN (Når det er skjult) */}
              <div 
                className={`absolute w-full h-full bg-white rounded-xl shadow-md border-b-4 border-slate-300 flex items-center justify-center text-3xl backface-hidden
                  ${!card.isFlipped && !card.isMatched ? 'hover:-translate-y-1 hover:shadow-lg transition-all' : ''}`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="opacity-50">{safeConfig.cardBackDesign}</span>
              </div>

              {/* BAGSIDEN (Når det er vendt) */}
              <div 
                className={`absolute w-full h-full bg-slate-50 rounded-xl shadow-inner border-2 border-slate-200 flex items-center justify-center text-4xl backface-hidden`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className={card.isMatched ? 'animate-bounce' : ''}>
                  {card.symbol}
                </span>
                
                {/* Lidt overlay hvis kortet er matchet og ude af spil */}
                {card.isMatched && (
                  <div className="absolute inset-0 bg-green-500/10 rounded-xl"></div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}