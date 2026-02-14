'use client';

import React, { useState, useEffect, use } from 'react';
import { GAME_REGISTRY } from '@/lib/registry/game-registry';
import { supabase } from '@/lib/supabase/client';

export default function PublicPlayerPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const resolvedParams = use(params);
  
  const [campaign, setCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Lead capture state
  const [email, setEmail] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Hent kampagnen fra databasen når siden åbner
  useEffect(() => {
    async function loadCampaign() {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', resolvedParams.campaignId)
        .single();
        
      if (!error && data) {
        setCampaign(data);
      }
      setIsLoading(false);
    }
    loadCampaign();
  }, [resolvedParams.campaignId]);

  if (isLoading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Henter spil...</div>;
  if (!campaign) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Denne kampagne findes ikke eller er udløbet.</div>;

  const module = GAME_REGISTRY[campaign.game_type];
  if (!module) return <div>Spillet understøttes ikke.</div>;

  const { GameComponent } = module;

  // 2. Gem email i databasen og start spillet
  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);

    try {
      // Gem direkte i den tabel, vi oprettede tidligere!
      await supabase.from('leads').insert([{
        campaign_id: campaign.id,
        email: email,
        data: { source: 'mobile_player', date: new Date().toISOString() }
      }]);

      // Lås op for spillet
      setHasJoined(true);
    } catch (error) {
      console.error("Kunne ikke gemme lead:", error);
      alert("Der opstod en fejl. Prøv igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Selve kunde-skærmen
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col">
        
        {/* TRIN 1: Email "Gate" (Før de kan spille) */}
        {!hasJoined ? (
          <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
            <div className="text-6xl mb-6">{module.icon}</div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{campaign.name}</h1>
            <p className="text-slate-500 mb-8">Indtast din email for at spille med om præmierne!</p>
            
            <form onSubmit={handleStartGame} className="w-full space-y-4">
              <input 
                type="email" 
                required
                placeholder="din@email.dk"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-colors"
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                {isSubmitting ? 'Gør klar...' : 'Spil Nu'}
              </button>
              <div className="flex items-start gap-2 mt-4 text-left">
                <input type="checkbox" required className="mt-1" id="consent" />
                <label htmlFor="consent" className="text-xs text-slate-400 cursor-pointer">
                  Ja tak, I må gerne kontakte mig med markedsføring. Jeg kan til enhver tid afmelde mig.
                </label>
              </div>
            </form>
          </div>
        ) : (

        /* TRIN 2: Selve Spillet (Vises efter de har indtastet email) */
          <div className="w-full h-full flex-1 flex flex-col pt-8 bg-slate-100">
            {/* Vi sender din partners valgte farver og præmier ind i spillet */}
            <GameComponent config={campaign.config} />
          </div>
        )}

      </div>
    </div>
  );
}