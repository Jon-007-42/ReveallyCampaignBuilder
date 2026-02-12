'use client';

import Link from 'next/link';
import { GAME_REGISTRY } from '@/lib/registry/game-registry';

export default function NewCampaignPage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-slate-500 hover:text-blue-600 mb-2 inline-block">
          ← Tilbage til Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Vælg Skabelon</h1>
        <p className="text-slate-500">Hvilken type spil vil du bygge i dag?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Vi henter automatisk spillene fra dit Registry! */}
        {Object.entries(GAME_REGISTRY).map(([type, module]) => (
          <div key={type} className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all hover:border-blue-500 cursor-pointer">
            <div className="text-4xl mb-4">{module.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600">
              {module.name}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {module.description}
            </p>
            
            {/* I en rigtig app ville dette oprette kampagnen i databasen først */}
            <button 
              className="w-full bg-slate-100 text-slate-900 font-medium py-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"
              onClick={() => alert(`Du valgte ${module.name}! Her ville vi oprette kampagnen.`)}
            >
              Vælg Skabelon
            </button>
          </div>
        ))}

        {/* En "Kommer Snart" boks for at vise potentialet */}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-50">
          <div className="text-4xl mb-4">🎡</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Lykkehjulet</h3>
          <p className="text-slate-500 text-sm">Kommer snart</p>
        </div>
      </div>
    </div>
  );
}