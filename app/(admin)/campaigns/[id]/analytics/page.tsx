'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { downloadLeadsCsv } from '@/lib/utils/csv-export'; // Det script vi lavede helt i starten

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [campaign, setCampaign] = useState<any>(null);
  const [leadsCount, setLeadsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadData() {
      // 1. Hent kampagnens navn
      const { data: campData } = await supabase
        .from('campaigns')
        .select('name')
        .eq('id', resolvedParams.id)
        .single();
        
      if (campData) setCampaign(campData);

      // 2. Tæl hvor mange leads der er i databasen for denne kampagne
      const { count } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', resolvedParams.id);
        
      setLeadsCount(count || 0);
      setIsLoading(false);
    }
    
    loadData();
  }, [resolvedParams.id]);

const handleExport = async () => {
    setIsExporting(true);
    // Vi sender både ID og navn med nu, så filen får det rigtige navn
    await downloadLeadsCsv(resolvedParams.id, campaign?.name);
    setIsExporting(false);
  };

  if (isLoading) return <div className="p-8 text-slate-500">Indlæser resultater...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <Link href={`/campaigns/${resolvedParams.id}/edit`} className="text-sm text-slate-500 hover:text-blue-600 mb-2 inline-block">
          ← Tilbage til Editoren
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Resultater: {campaign?.name}</h1>
        <p className="text-slate-500">Overblik over kampagnens performance og opsamlede leads.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Hoved KPI boks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-4">
            👥
          </div>
          <h3 className="text-slate-500 font-medium mb-1">Opsamlede Leads</h3>
          <p className="text-4xl font-black text-slate-900">{leadsCount}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center opacity-70">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-4">
            👀
          </div>
          <h3 className="text-slate-500 font-medium mb-1">Visninger (Kommer Snart)</h3>
          <p className="text-4xl font-black text-slate-900">-</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center opacity-70">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-4">
            📈
          </div>
          <h3 className="text-slate-500 font-medium mb-1">Konvertering (Kommer Snart)</h3>
          <p className="text-4xl font-black text-slate-900">-%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Eksportér Data</h2>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          Download alle opsamlede email-adresser som en Excel-kompatibel CSV fil. Klar til at blive sendt til kunden eller importeret i Mailchimp.
        </p>
        
        {/* OPPDATERET KNAP: Nu kan den altid klikkes! */}
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="px-8 py-4 rounded-xl font-bold flex items-center gap-3 mx-auto transition-all shadow-lg bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-blue-200"
        >
          <span className="text-xl">📊</span>
          {isExporting ? 'Genererer fil...' : `Download Leads (CSV)`}
        </button>
      </div>
    </div>
  );
}