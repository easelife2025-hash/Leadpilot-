import { Button } from "@/components/ui/button";
import { MessageSquare, Zap, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import * as motion from "motion/react-client";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 h-16 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex justify-center items-center font-display font-bold text-xl text-indigo-700">
          <MessageSquare className="w-6 h-6 mr-2" />
          LeadPilot AI
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-600">Login</Button>
          </Link>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col pt-24 pb-16 items-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl text-center"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
            Intelligent WhatsApp Automation
          </span>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 tracking-tight leading-tight mb-6">
            Turn Leads into Customers with AI Outreach
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            LeadPilot AI automatically syncs your leads, generates hyper-personalized WhatsApp messages using Gemini AI, and drives conversions on autopilot.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full"
        >
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Lead Management</h3>
            <p className="text-slate-600">Centralize all your prospect data in our scalable CRM powered by Firebase. Never lose a lead again.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Gemini AI Engine</h3>
            <p className="text-slate-600">Draft context-aware, highly personalized outreach messages instantly using Google's Gemini models.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">WhatsApp native</h3>
            <p className="text-slate-600">Automate engagement natively through the WhatsApp Business Cloud API. High open and reply rates.</p>
          </div>
        </motion.div>
      </main>
      
      <footer className="py-8 text-center text-slate-500 border-t border-slate-200">
        <p>&copy; {new Date().getFullYear()} LeadPilot AI. Crafted for AI Studio.</p>
      </footer>
    </div>
  );
}
