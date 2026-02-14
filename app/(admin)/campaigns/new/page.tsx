'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GAME_REGISTRY } from '@/lib/registry/game-registry';
import { supabase } from '@/lib/supabase/client'; // Forbindelsen til din database

export default function NewCampaignPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState<string | null>(null);

  // Denne funktion kører, når man trykker på en skabelon
  const handleCreateCampaign = async (gameType: string) => {
    setIsCreating(gameType);
    const module = GAME_REGISTRY[gameType];

    try {
      // 1. Bed Supabase om at oprette en ny række i tabellen 'campaigns'
      const { data, error } = await supabase
        .from('campaigns')
        .insert([
          {
            name: `Ny ${module.name} Kampagne`,
            game_type: gameType,
            config: module.defaultConfig,
            status: 'draft'
          }
        ])
        .select('id') // Vi beder specifikt om at få det nye ID tilbage
        .single();

      if (error) throw error;

      // 2. Succes! Send brugeren videre til editoren med det nye ID
      router.push(`/campaigns/${data.id}/edit`);
      
    } catch (error: any) {
      // Vi tvinger den til at udskrive den rigtige besked i konsollen:
      console.error('Fejl detaljer:', error.message, error.details, error.hint);
      
      // Vis fejlen direkte på skærmen i en popup:
      alert(`Database Fejl: ${error.message || 'Ukendt fejl. Har du husket at genstarte terminalen med npm run dev, efter du lavede .env.local filen?'}`);
      
      setIsCreating(null);
    }
  };

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
        {Object.entries(GAME_REGISTRY).map(([type, module]) => (
          <div key={type} className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all hover:border-blue-500">
            <div className="text-4xl mb-4">{module.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600">
              {module.name}
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              {module.description}
            </p>
            
            <button 
              onClick={() => handleCreateCampaign(type)}
              disabled={isCreating !== null}
              className={`w-full font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2
                ${isCreating === type 
                  ? 'bg-blue-600 text-white cursor-wait' 
                  : 'bg-slate-100 text-slate-900 group-hover:bg-blue-600 group-hover:text-white'}`}
            >
              {isCreating === type ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Opretter...
                </>
              ) : (
                'Vælg Skabelon'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}