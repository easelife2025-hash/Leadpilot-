'use client';

import { useEffect, useState } from 'react';
import { 
  MessageSquare, Users, Settings, LogOut, BarChart3, 
  UploadCloud, Flame, Clock, DollarSign, Activity, 
  ArrowRight, Sparkles, TrendingUp, CheckCircle2 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

export default function DashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to leads from Firestore
    const q = query(collection(db, 'leads'), orderBy('updatedAt', 'desc'), limit(50));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeads(leadsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate Metrics
  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.leadScore === 'Hot').length;
  
  // Follow-ups due (using a visual heuristic for demo if no specific date logic exists)
  const followUpsDue = leads.filter(l => l.leadScore === 'Warm' || l.leadScore === 'Hot').length;
  
  // Potential Revenue (Mock calculation based on lead scores)
  const potentialRevenue = leads.reduce((acc, lead) => {
    if (lead.leadScore === 'Hot') return acc + 1200;
    if (lead.leadScore === 'Warm') return acc + 500;
    return acc + 100;
  }, 0);

  const recoveredLeads = leads.filter(l => l.status === 'Recovered').length;

  // Chart Data Preparation (Mocking trend based on available leads for visual)
  const chartData = [
    { name: 'Mon', leads: 4, hot: 1 },
    { name: 'Tue', leads: 7, hot: 3 },
    { name: 'Wed', leads: 5, hot: 2 },
    { name: 'Thu', leads: 9, hot: 4 },
    { name: 'Fri', leads: totalLeads > 0 ? totalLeads : 2, hot: hotLeads > 0 ? hotLeads : 0 },
    { name: 'Sat', leads: 0, hot: 0 },
    { name: 'Sun', leads: 0, hot: 0 },
  ];

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
          <button className="flex items-center w-full px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
            <BarChart3 className="w-5 h-5 mr-3" />
            Overview
          </button>
          <button className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5 mr-3" />
            Leads
          </button>
          <button className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <MessageSquare className="w-5 h-5 mr-3" />
            Campaigns
          </button>
          <button className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <button className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900 font-display flex items-center">
            Overview <span className="ml-3 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">Live</span>
          </h1>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              WhatsApp Tuned
            </span>
          </div>
        </header>

        <main className="p-8">
          {/* Animated KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-slate-500">Total Leads</CardTitle>
                  <Users className="w-4 h-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{totalLeads}</div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1 text-emerald-500" /> +12% this week</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Flame className="w-16 h-16 text-orange-500" />
                </div>
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-slate-500">Hot Leads</CardTitle>
                  <Flame className="w-4 h-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{hotLeads}</div>
                  <p className="text-xs text-orange-600 mt-1 font-medium bg-orange-50 w-fit px-1.5 py-0.5 rounded">High Intent detected</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-slate-500">Follow-ups</CardTitle>
                  <Clock className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{followUpsDue}</div>
                  <p className="text-xs text-slate-500 mt-1">Require action today</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-slate-500">Potential Revenue</CardTitle>
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">${potentialRevenue.toLocaleString()}</div>
                  <p className="text-xs text-slate-500 mt-1">Based on lead scores</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-slate-500">Recovered</CardTitle>
                  <Activity className="w-4 h-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{recoveredLeads}</div>
                  <p className="text-xs text-slate-500 mt-1">Re-engaged past 30d</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts and Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Chart Area */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Card className="shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-display">Lead Acquisition Trend</CardTitle>
                    <CardDescription>Volume and quality over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorHot" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="leads" name="Total Leads" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                        <Area type="monotone" dataKey="hot" name="Hot Leads" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorHot)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI Insight Queue & Follow Ups */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-display flex items-center">
                        <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                        AI Follow-up Queue
                      </CardTitle>
                      <CardDescription>Intelligent suggestions based on recent conversations</CardDescription>
                    </div>
                    <Button variant="outline" className="hidden sm:flex text-sm py-1.5 px-3">View All</Button>
                  </CardHeader>
                  <CardContent>
                    {leads.length === 0 ? (
                       <div className="text-center py-8">
                         <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                           <MessageSquare className="w-6 h-6 text-slate-400" />
                         </div>
                         <p className="text-slate-500 font-medium">No leads yet</p>
                         <p className="text-sm text-slate-400 mt-1 w-[80%] mx-auto">Waiting for inbound messages via WhatsApp to generate insights.</p>
                       </div>
                    ) : (
                      <div className="space-y-4">
                        <AnimatePresence>
                          {leads.slice(0, 4).map((lead, i) => (
                            <motion.div 
                              key={lead.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * i }}
                              className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all gap-4"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-slate-900 truncate">{lead.name || lead.phoneNumber}</h4>
                                  {lead.leadScore === 'Hot' && <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-orange-100 text-orange-600">Hot Intent</span>}
                                  {lead.leadScore === 'Warm' && <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-yellow-100 text-yellow-700">Warm</span>}
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-1 mb-2">"{lead.lastMessage}"</p>
                                <div className="flex items-start gap-2 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-50">
                                   <Sparkles className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                                   <div className="text-xs text-indigo-900">
                                     <span className="font-semibold block mb-0.5">Suggested Action: {lead.nextAction || 'Reply promptly'}</span>
                                     <span className="opacity-80 italic line-clamp-1">"{lead.suggestedFollowUp || 'Hello! How can I help you today?'}"</span>
                                   </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-end gap-2 shrink-0">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-sm py-1.5 px-3">
                                  Send Reply
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Sidebar Area */}
            <div className="space-y-8">
              {/* Activity Feed */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <Card className="shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-display">Live Activity</CardTitle>
                    <CardDescription>Recent incoming messages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {leads.length === 0 ? (
                         <div className="text-center py-6">
                            <p className="text-sm text-slate-400">Activity feed is empty</p>
                         </div>
                      ) : (
                        leads.slice(0, 5).map((lead, i) => (
                          <div key={`feed-${lead.id}`} className="relative pl-6 border-l-2 border-slate-100 last:border-0 pb-6 last:pb-0">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-300">
                              {lead.leadScore === 'Hot' && <div className="w-full h-full rounded-full bg-orange-400 scale-50" />}
                              {lead.leadScore === 'Warm' && <div className="w-full h-full rounded-full bg-yellow-400 scale-50" />}
                            </div>
                            <div className="-mt-1.5">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-sm text-slate-900">{lead.name || lead.phoneNumber}</span>
                                <span className="text-xs text-slate-400">
                                  {lead.lastMessageAt?.toDate ? lead.lastMessageAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">Sent a message</p>
                              <div className="mt-2 p-3 bg-slate-50 rounded-lg rounded-tl-none border border-slate-100 text-sm text-slate-700 inline-block">
                                {lead.lastMessage}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}
