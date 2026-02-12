import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mine Kampagner</h1>
          <p className="text-slate-500">Administrer dine spil og se resultater</p>
        </div>
        <Link 
          href="/campaigns/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2"
        >
          + Opret Ny Kampagne
        </Link>
      </div>

      {/* Tom tilstand (vises når der ikke er kampagner) */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🚀
        </div>
        <h3 className="text-lg font-medium text-slate-900">Ingen kampagner endnu</h3>
        <p className="text-slate-500 mb-6 max-w-md mx-auto">
          Kom i gang med at engagere dine kunder. Opret din første gamification kampagne på 2 minutter.
        </p>
        <Link 
          href="/campaigns/new"
          className="text-blue-600 font-medium hover:underline"
        >
          Start med en skabelon →
        </Link>
      </div>
    </div>
  );
}