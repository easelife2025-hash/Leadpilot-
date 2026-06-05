import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-300/20 blur-[100px]" />
      <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[50%] rounded-full bg-sky-300/20 blur-[120px]" />
      
      <div className="max-w-2xl text-center space-y-8 tracking-tight z-10">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-5xl font-bold font-display text-slate-900 tracking-tight">LeadPilot AI</h1>
        <p className="text-xl text-slate-600 leading-relaxed font-medium">
          Automate your WhatsApp lead engagement.<br/> Qualify faster, respond instantly, close more deals.
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/onboarding" className="inline-flex items-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
            Get Started <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link href="/dashboard" className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-slate-700 font-bold hover:bg-slate-50 transition border border-slate-200 shadow-sm">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
