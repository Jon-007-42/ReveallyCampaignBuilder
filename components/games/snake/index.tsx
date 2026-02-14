'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { z } from 'zod';

// ---------------------------------------------------------
// 0. SPIL DEFINITIONER
// ---------------------------------------------------------
export const configSchema = z.object({
  title: z.string().default('Snake: Jagt Rekorden!'),
  brandColor: z.string().default('#10B981'), // Grøn
  snakeColor: z.string().default('#047857'), // Mørkegrøn
  foodEmoji: z.string().default('🍎'),
  pointsToWin: z.number().default(10),
  winMessage: z.string().default('Du slog rekorden! Her er 15% rabat.')
});

export const defaultConfig = {
  title: 'Snake: Jagt Rekorden!',
  brandColor: '#10B981',
  snakeColor: '#047857',
  foodEmoji: '🍎',
  pointsToWin: 10,
  winMessage: 'Du slog rekorden! Her er 15% rabat.'
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Baggrundsfarve</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Slangens Farve</label>
            <div className="flex gap-3">
              <input 
                type="color" 
                value={config.snakeColor || defaultConfig.snakeColor} 
                onChange={e => updateConfig('snakeColor', e.target.value)}
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
        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Spilmekanik & Præmie</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Mad (Emoji)</label>
              <input 
                type="text" 
                value={config.foodEmoji || defaultConfig.foodEmoji} 
                onChange={e => updateConfig('foodEmoji', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center text-xl"
                maxLength={2}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Point for at vinde</label>
              <input 
                type="number" 
                value={config.pointsToWin || defaultConfig.pointsToWin} 
                onChange={e => updateConfig('pointsToWin', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                min="1"
                max="100"
              />
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
            <p className="text-xs text-green-700 mt-1">Vises KUN, hvis de slår point-grænsen.</p>
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
    snakeColor: config?.snakeColor || defaultConfig.snakeColor,
    foodEmoji: config?.foodEmoji || defaultConfig.foodEmoji,
    pointsToWin: config?.pointsToWin || defaultConfig.pointsToWin,
    winMessage: config?.winMessage || defaultConfig.winMessage
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spillets "motor"
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  // Snake og Mad gemt i "refs" (så de ikke trigger re-renders hele tiden, hvilket gør spillet hakkende)
  const gridSize = 15; // Hvor store firkanterne er
  const snakeRef = useRef([{ x: 10, y: 10 }]); // Slangens startposition
  const foodRef = useRef({ x: 5, y: 5 }); // Madens startposition
  const dirRef = useRef({ x: 1, y: 0 }); // Retning (starter med at køre til højre)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // 🎮 STYRING (Tastatur til PC / Knapper til Mobil)
  const changeDirection = useCallback((newDx: number, newDy: number) => {
    // Man kan ikke bakke ind i sig selv
    if (newDx !== 0 && dirRef.current.x === -newDx) return;
    if (newDy !== 0 && dirRef.current.y === -newDy) return;
    
    dirRef.current = { x: newDx, y: newDy };
  }, []);

  // Tastatur lytter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      e.preventDefault(); // Undgå at scrolle siden
      switch (e.key) {
        case 'ArrowUp': changeDirection(0, -1); break;
        case 'ArrowDown': changeDirection(0, 1); break;
        case 'ArrowLeft': changeDirection(-1, 0); break;
        case 'ArrowRight': changeDirection(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, changeDirection]);

  // 🔄 SPILLETS HJERTERYTME (Game Loop)
  const startGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setHasWon(false);
    setIsPlaying(true);
    spawnFood();
  };

  const spawnFood = () => {
    foodRef.current = {
      x: Math.floor(Math.random() * (300 / gridSize)),
      y: Math.floor(Math.random() * (300 / gridSize))
    };
  };

  useEffect(() => {
    if (!isPlaying) return;

    const moveSnake = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const newHead = {
        x: snakeRef.current[0].x + dirRef.current.x,
        y: snakeRef.current[0].y + dirRef.current.y
      };

      // TJEK OM MAN DØR:
      // 1. Rammer man væggen?
      const maxX = canvas.width / gridSize;
      const maxY = canvas.height / gridSize;
      if (newHead.x < 0 || newHead.x >= maxX || newHead.y < 0 || newHead.y >= maxY) {
        endGame();
        return;
      }

      // 2. Rammer man sig selv?
      for (let segment of snakeRef.current) {
        if (segment.x === newHead.x && segment.y === newHead.y) {
          endGame();
          return;
        }
      }

      snakeRef.current.unshift(newHead); // Tilføj nyt hoved

      // Tjek om vi spiste maden
      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        setScore(s => s + 1);
        spawnFood();
      } else {
        snakeRef.current.pop(); // Fjern halen (hvis vi ikke spiste, ellers vokser vi)
      }

      drawGame(ctx, canvas);
    };

    const endGame = () => {
      setIsPlaying(false);
      setGameOver(true);
      if (score >= safeConfig.pointsToWin) {
        setHasWon(true);
      }
    };

    // Hvor hurtigt kører spillet (mindre tal = hurtigere)
    gameLoopRef.current = setInterval(moveSnake, 150); 

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, score, safeConfig.pointsToWin]);

  // 🎨 TEGN SPILLET PÅ SKÆRMEN
  const drawGame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Ryd skærmen (sæt baggrund)
    ctx.fillStyle = '#1e293b'; // Mørkegrå baggrund (Slate 800)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tegn Mad
    ctx.font = `${gridSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      safeConfig.foodEmoji, 
      (foodRef.current.x * gridSize) + (gridSize/2), 
      (foodRef.current.y * gridSize) + (gridSize/2)
    );

    // Tegn Slange
    ctx.fillStyle = safeConfig.snakeColor;
    snakeRef.current.forEach((segment, index) => {
      ctx.beginPath();
      // Hovedet kan være lidt anderledes for at se cool ud
      if (index === 0) {
        ctx.roundRect(segment.x * gridSize, segment.y * gridSize, gridSize-1, gridSize-1, 4);
      } else {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-1, gridSize-1);
      }
      ctx.fill();
    });
  };

  // Tegn startskærmen én gang når komponenten loader
  useEffect(() => {
    if (!isPlaying && !gameOver) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGame(ctx, canvas); // Tegner den lille start-slange
      }
    }
  }, [isPlaying, gameOver, safeConfig.snakeColor]);


  return (
    <div className="w-full h-full flex flex-col p-6 items-center" style={{ backgroundColor: safeConfig.brandColor }}>
      
      {/* Header med Score */}
      <div className="w-full flex justify-between items-center mb-6 px-2">
        <h1 className="text-xl font-black text-white drop-shadow-md truncate max-w-[180px]">
          {safeConfig.title}
        </h1>
        <div className="bg-black/20 text-white font-bold px-4 py-1 rounded-full shadow-inner flex gap-2">
          <span>{safeConfig.foodEmoji}</span> {score} <span className="text-white/50 text-xs mt-1">/ {safeConfig.pointsToWin}</span>
        </div>
      </div>

      {/* Spillepladen (Canvas) */}
      <div ref={containerRef} className="relative bg-slate-800 rounded-2xl shadow-2xl p-2 border-4 border-black/20">
        <canvas 
          ref={canvasRef}
          width={300}
          height={300}
          className="bg-slate-800 rounded-xl"
        />

        {/* OVERLAYS (Når man dør eller vinder) */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/80 rounded-xl flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
            
            {gameOver ? (
              <>
                <div className="text-4xl mb-2">💥</div>
                <h2 className="text-2xl font-bold text-white mb-1">Game Over!</h2>
                <p className="text-slate-300 mb-4">Du fik {score} point.</p>
                
                {hasWon ? (
                  <div className="bg-green-500 text-white p-3 rounded-lg text-sm font-bold mb-4 shadow-lg animate-in slide-in-from-bottom-4">
                    {safeConfig.winMessage}
                  </div>
                ) : (
                  <p className="text-red-400 text-sm mb-6">Du skal have {safeConfig.pointsToWin} point for at vinde en præmie.</p>
                )}
                
                <button onClick={startGame} className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-slate-200">
                  Prøv Igen
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">🐍</div>
                <button onClick={startGame} className="bg-blue-500 text-white px-8 py-3 rounded-full font-black text-xl hover:bg-blue-600 hover:scale-105 transition-all shadow-lg shadow-blue-500/50 animate-pulse">
                  START SPIL
                </button>
              </>
            )}
            
          </div>
        )}
      </div>

      {/* MOBIL STYRING (Usynlig på PC, livsvigtig på mobil) */}
      <div className="mt-8 grid grid-cols-3 gap-2 w-48">
        <div></div>
        <button onClick={() => changeDirection(0, -1)} className="bg-white/20 active:bg-white/40 p-4 rounded-xl flex items-center justify-center text-white text-xl">⬆️</button>
        <div></div>
        <button onClick={() => changeDirection(-1, 0)} className="bg-white/20 active:bg-white/40 p-4 rounded-xl flex items-center justify-center text-white text-xl">⬅️</button>
        <button onClick={() => changeDirection(0, 1)} className="bg-white/20 active:bg-white/40 p-4 rounded-xl flex items-center justify-center text-white text-xl">⬇️</button>
        <button onClick={() => changeDirection(1, 0)} className="bg-white/20 active:bg-white/40 p-4 rounded-xl flex items-center justify-center text-white text-xl">➡️</button>
      </div>

      {/* Konfetti når man vinder og dør (så spillet er slut) */}
      {gameOver && hasWon && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-start z-50">
           <div className="text-6xl animate-bounce mt-20">🎊 🎈 🎉</div>
        </div>
      )}

    </div>
  );
}