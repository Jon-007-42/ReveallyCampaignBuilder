import { supabase } from '@/lib/supabase/client';

export async function downloadLeadsCsv(campaignId: string) {
  // 1. Hent data fra Supabase
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('campaign_id', campaignId);

  if (error || !leads) {
    alert('Kunne ikke hente leads!');
    return;
  }

  // 2. Lav om til CSV format
  const headers = ['Email', 'Dato', 'Data'].join(',');
  const rows = leads.map(lead => 
    `${lead.email},${new Date(lead.created_at).toLocaleDateString()},${JSON.stringify(lead.data).replace(/,/g, ';')}`
  );
  const csvContent = [headers, ...rows].join('\n');

  // 3. Start download i browseren
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
}