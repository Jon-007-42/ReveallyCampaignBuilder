import { supabase } from '@/lib/supabase/client';

export async function downloadLeadsCsv(campaignId: string, campaignName: string = 'Kampagne') {
  try {
    // 1. Hent alle leads for denne kampagne
    const { data, error } = await supabase
      .from('leads')
      .select('email, created_at, data')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      alert('Der er ingen leads at downloade endnu.');
      return;
    }

    // 2. Byg CSV indholdet (Excel-format)
    // Starter med overskrifterne
    const headers = ['Email', 'Dato', 'Tidspunkt', 'Kilde'];
    let csvContent = headers.join(',') + '\n';

    // Tilføjer hver række
    data.forEach(lead => {
      const dateObj = new Date(lead.created_at);
      const date = dateObj.toLocaleDateString('da-DK');
      const time = dateObj.toLocaleTimeString('da-DK');
      const source = lead.data?.source || 'ukendt';
      
      const row = [lead.email, date, time, source];
      csvContent += row.join(',') + '\n';
    });

    // 3. Få browseren til at downloade filen
    // Vi bruger en 'Blob', som er en måde at håndtere filer direkte i browseren på
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Giver filen et pænt navn, f.eks. "Leads_Sommer_2026-02-14.csv"
    const today = new Date().toISOString().split('T')[0];
    const safeName = campaignName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `leads_${safeName}_${today}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error: any) {
    console.error('Fejl ved eksport:', error);
    alert('Der opstod en fejl ved download af filen.');
  }
}