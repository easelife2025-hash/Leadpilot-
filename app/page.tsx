import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Zap, Users, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import * as motion from "motion/react-client";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-8 h-20 flex items-center justify-between z-50">
        <div className="flex justify-center items-center font-display font-bold text-2xl text-slate-900 tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          LeadPilot AI
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" className="font-medium hidden sm:inline-flex">Sign In</Button>
          <Button variant="glass" className="font-semibold">Get Started</Button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col pt-24 pb-20 items-center px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl text-center z-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-indigo-700 text-sm font-semibold mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Next-Gen WhatsApp Automation</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-slate-900 mb-8 leading-[1.1]">
            Turn leads into <span className="text-gradient bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500">pipeline.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            LeadPilot automatically syncs your leads, generates hyper-personalized WhatsApp messages using Gemini AI, and drives conversions on autopilot.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-2xl group">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="glass" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-2xl">
              View Demo
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-slate-500 font-medium">
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> Cancel anytime</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full z-10"
        >
          <Card className="hover:-translate-y-2 transition-transform duration-500">
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 shadow-inner">
                <Users className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">Smart CRM Sync</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Instantly centralize all your prospect data into our scalable Firebase-backed system. Never drop a lead again.</p>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-2 transition-transform duration-500 delay-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-sky-50/40 pointer-events-none" />
            <CardContent className="p-8 relative">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-6 shadow-inner">
                <Zap className="w-7 h-7 text-sky-500" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">Gemini Engine</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Draft highly personalized, context-aware outreach instantly using state-of-the-art Google AI models.</p>
            </CardContent>
          </Card>
          <Card className="hover:-translate-y-2 transition-transform duration-500 delay-200">
            <CardContent className="p-8">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 shadow-inner">
                <MessageSquare className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">Native WhatsApp</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Automate engagement natively through the Meta Cloud API to ensure delivery, compliance, and maximum reply rates.</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
