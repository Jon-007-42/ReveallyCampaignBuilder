'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { GAME_REGISTRY } from '@/lib/registry/game-registry';
import { supabase } from '@/lib/supabase/client';

export default function CampaignEditor({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [gameType, setGameType] = useState<string | null>(null);
  const [config, setConfig] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // NY STATE TIL UDGIVELSES-VINDUE
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadCampaign() {
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (error) throw error;

        if (data) {
          setGameType(data.game_type);
          setConfig(data.config || GAME_REGISTRY[data.game_type]?.defaultConfig || {});
        }
      } catch (error) {
        console.error('Kunne ikke hente kampagne:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaign();
  }, [resolvedParams.id]);

  const handleSave = async (showNotification = true) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ config: config, updated_at: new Date() })
        .eq('id', resolvedParams.id);

      if (error) throw error;
      if (showNotification) alert('✅ Kampagnen er gemt sikkert i skyen!');
    } catch (error: any) {
      console.error('Fejl ved gem:', error);
      if (showNotification) alert('Kunne ikke gemme: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // NY FUNKTION: Håndterer Udgiv-knappen
  const handlePublish = async () => {
    await handleSave(false); // Gemmer i baggrunden uden popup
    setShowPublishModal(true); // Viser vinduet med linket
  };

  // NY FUNKTION: Kopier linket
  const handleCopyLink = () => {
    // Vi bygger det rigtige link baseret på, hvor hjemmesiden bor lige nu (f.eks. localhost eller vercel)
    const baseUrl = window.location.origin;
    const playUrl = `${baseUrl}/play/${resolvedParams.id}`;
    
    navigator.clipboard.writeText(playUrl);
    setCopySuccess(true);
    
    // Skift tilbage til "Kopier" efter 3 sekunder
    setTimeout(() => setCopySuccess(false), 3000);
  };

  if (isLoading || !isMounted) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Indlæser editor...</div>;
  }

  const module = gameType ? GAME_REGISTRY[gameType] : null;
  if (!module) return <div>Skabelonen findes ikke.</div>;

  const { ConfigEditor, GameComponent } = module;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      
      {/* --- NYT MODAL VINDUE (Ligger usynligt over skærmen, indtil man trykker udgiv) --- */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                🚀
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Kampagnen er Live!</h2>
              <p className="text-slate-500 mt-2">
                Dit spil er nu gemt og klar til at modtage spillere. Del linket herunder med dine kunder.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between mb-8">
              <code className="text-sm text-slate-700 truncate mr-4 block w-full">
                {typeof window !== 'undefined' ? `${window.location.origin}/play/${resolvedParams.id.slice(0,12)}...` : ''}
              </code>
              <button 
                onClick={handleCopyLink}
                className={`px-4 py-2 font-bold rounded-lg whitespace-nowrap transition-colors
                  ${copySuccess ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}`}
              >
                {copySuccess ? 'Kopieret! ✓' : 'Kopiér Link'}
              </button>
            </div>

            <button 
              onClick={() => setShowPublishModal(false)}
              className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Luk vindue og fortsæt redigering
            </button>
          </div>
        </div>
      )}
      {/* -------------------------------------------------------------------------------- */}

      {/* TOP BAR */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600">
            ← Tilbage
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Rediger: {module.name}</h1>
            <p className="text-xs text-slate-500">ID: {resolvedParams.id.slice(0,8)}...</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link 
            href={`/campaigns/${resolvedParams.id}/analytics`}
            className="px-6 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
          >
            <span>📊</span> Se Leads
          </Link>

          <button 
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className={`px-6 py-2 font-medium rounded-lg transition-colors
              ${isSaving ? 'bg-blue-100 text-blue-400 cursor-wait' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {isSaving ? 'Gemmer...' : 'Gem Kladde'}
          </button>
          
          <button 
            onClick={handlePublish}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Udgiv Kampagne 🚀
          </button>
        </div>
      </header>

      {/* SPLIT SCREEN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* VENSTRE SIDE: Indstillinger */}
        <div className="w-1/3 min-w-[400px] bg-white border-r border-slate-200 overflow-y-auto p-6 shadow-xl z-0">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Kampagne Indstillinger</h2>
            <p className="text-sm text-slate-500">Tilpas design og indhold for din kampagne.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
             <ConfigEditor config={config} onChange={setConfig} />
          </div>
        </div>

        {/* HØJRE SIDE: Live Preview */}
        <div className="flex-1 bg-slate-100 overflow-y-auto flex items-center justify-center p-8">
          <div className="relative mx-auto w-[375px] h-[812px] bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800 ring-4 ring-slate-100/50">
            <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
              <div className="w-32 h-6 bg-black rounded-b-3xl"></div>
            </div>
            <div className="bg-white w-full h-full rounded-[2.5rem] overflow-hidden relative">
              <div className="w-full h-full pt-8">
                <GameComponent config={config} />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}