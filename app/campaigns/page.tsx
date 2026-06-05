'use client';

import { useEffect, useState } from 'react';
import { 
  MessageSquare, Users, Settings, LogOut, BarChart3, 
  Clock, Zap, Power, Play, CheckCircle2, ChevronRight,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const AUTOMATION_RULES = [
  { id: 1, name: 'Day 3 Reminder', trigger: '3 days inactive', intent: 'Gentle check-in', status: 'active', color: 'bg-blue-500' },
  { id: 2, name: 'Day 7 Follow-up', trigger: '7 days inactive', intent: 'Address objections, provide value', status: 'active', color: 'bg-indigo-500' },
  { id: 3, name: 'Day 14 Re-engagement', trigger: '14 days inactive', intent: 'Pivot offer or ask feedback', status: 'active', color: 'bg-orange-500' },
  { id: 4, name: 'Day 30 Recovery', trigger: '30 days inactive', intent: 'Final attempt, high discount/urgency', status: 'paused', color: 'bg-slate-500' }
];

export default function CampaignsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const runAutomation = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/automation/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLastRun(new Date().toLocaleTimeString());
        toast.success(`Automation run complete! ${data.actionsTaken} actions taken.`);
      } else {
        toast.error('Failed to run automation');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to run automation');
    }
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3 shadow-md shadow-indigo-600/20">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 font-display">LeadPilot UI</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <BarChart3 className="w-5 h-5 mr-3" />
            Overview
          </Link>
          <Link href="/leads" className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5 mr-3" />
            Leads
          </Link>
          <Link href="/campaigns" className="flex items-center w-full px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium transition-colors">
            <Zap className="w-5 h-5 mr-3" />
            Campaigns
          </Link>
          <Link href="/settings" className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-w-0 flex flex-col h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between flex-shrink-0 sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900 font-display flex items-center">
            Automation Engine
          </h1>
          <div className="flex items-center gap-4">
             <Button 
               onClick={runAutomation} 
               disabled={isRunning}
               className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
             >
               {isRunning ? (
                 <span className="flex items-center"><Zap className="w-4 h-4 mr-2 animate-pulse" /> Running Check...</span>
               ) : (
                 <span className="flex items-center"><Play className="w-4 h-4 mr-2" /> Trigger Automation Run</span>
               )}
             </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="flex flex-col md:flex-row gap-6">
              <Card className="flex-1 border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                   <Bot className="w-24 h-24 text-indigo-500" />
                </div>
                <CardHeader>
                  <CardTitle className="font-display text-xl text-slate-900">AI Engagement Engine</CardTitle>
                  <CardDescription>Automatically analyzes stale conversations and generates contextual follow-ups.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Engine Status: <strong className="text-slate-900">Active</strong>
                    <span className="mx-2 text-slate-300">|</span>
                    Last check: <strong className="text-slate-900">{lastRun || 'Not run yet'}</strong>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">How it works</h4>
                    <ul className="space-y-3 text-sm text-slate-600 flex flex-col">
                      <li className="flex items-start gap-2">
                        <span className="bg-indigo-100 text-indigo-700 w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                        <span>Engine scans all leads hourly looking for inactivity gaps matching your rules.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-indigo-100 text-indigo-700 w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                        <span>Gemini AI analyzes the prior conversation history to establish context.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-indigo-100 text-indigo-700 w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                        <span>A highly personalized, contextual follow-up message is generated and sent.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-display">Active Sequences</h3>
            
            <div className="space-y-4">
              {AUTOMATION_RULES.map((rule, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={rule.id}
                >
                  <Card className={`border ${rule.status === 'active' ? 'border-indigo-100 shadow-sm' : 'border-slate-200 opacity-70'}`}>
                    <div className="flex flex-col md:flex-row items-center p-5 gap-6">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${rule.color}`}>
                          {rule.id}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{rule.name}</h4>
                          <div className="flex items-center gap-1.5 text-xs font-medium mt-1">
                            {rule.status === 'active' ? (
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                            ) : (
                              <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Paused</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col md:flex-row items-center gap-4 bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-slate-900">Wait:</span> {rule.trigger}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 hidden md:block" />
                        <div className="flex flex-1 items-center gap-2 text-sm text-slate-700 bg-white border border-indigo-100 px-3 py-1.5 rounded-md shadow-sm">
                          <Bot className="w-4 h-4 text-indigo-500" />
                          <span><span className="font-semibold text-slate-900">AI Prompt:</span> {rule.intent}</span>
                        </div>
                      </div>
                      
                      <div className="shrink-0 flex items-center justify-end">
                        <Button variant={rule.status === 'active' ? 'outline' : 'default'} size="sm">
                          {rule.status === 'active' ? 'Pause' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
