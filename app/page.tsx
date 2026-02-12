import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Reveally
          </h1>
          <p className="text-xl text-slate-400">
            Campaign Builder v2.0
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4">Klar til at bygge?</h2>
          <p className="text-slate-400 mb-8">
            Din database er forbundet, og motoren kører.
          </p>
          
          <Link 
            href="/dashboard" 
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
          >
            Gå til Dashboard →
          </Link>
        </div>

        <div className="text-sm text-slate-600">
          Mobile-First Gamification Engine
        </div>
      </div>
    </div>
  );
}