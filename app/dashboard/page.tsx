'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, ArrowUpRight, Zap, Play } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 font-medium mt-1">Welcome back</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200/60 shadow-sm bg-white/70">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              <span>Total Leads</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-display font-bold text-slate-900">142</span>
              <span className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-md mb-1 pb-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                12%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm bg-white/70">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium mb-4">
              <MessageSquare className="w-4 h-4" />
              <span>Messages Sent</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-display font-bold text-slate-900">38</span>
              <span className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-md mb-1 pb-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                24%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 shadow-sm bg-white/70">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-slate-500 text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              <span>AI Reply Rate</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-display font-bold text-slate-900">76%</span>
              <span className="flex items-center text-slate-400 text-sm font-medium mb-1">
                avg this week
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         <Card className="border-slate-200/60 bg-white/70">
            <CardHeader className="pb-3 border-b border-slate-100 mb-4 px-6 pt-6">
               <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3">
               <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-indigo-200 hover:bg-slate-50 transition-colors">
                  <div>
                     <h4 className="font-semibold text-slate-900">Add new leads</h4>
                     <p className="text-sm text-slate-500 font-medium">Import from CRM or add manually</p>
                  </div>
                  <Link href="/dashboard/leads">
                    <Button variant="outline" size="sm" className="font-semibold bg-white">Go to Leads</Button>
                  </Link>
               </div>
               <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-indigo-200 hover:bg-slate-50 transition-colors">
                  <div>
                     <h4 className="font-semibold text-slate-900">Configure AI prompt</h4>
                     <p className="text-sm text-slate-500 font-medium">Update Gemini business context</p>
                  </div>
                  <Button variant="outline" size="sm" className="font-semibold bg-white">Settings</Button>
               </div>
            </CardContent>
         </Card>

         <Card className="border-transparent bg-gradient-to-br from-indigo-600 to-sky-600 text-white relative overflow-hidden shadow-lg shadow-indigo-600/20">
            <CardContent className="p-8 relative z-10 h-full flex flex-col justify-between">
               <div>
                 <div className="inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <Zap className="w-3 h-3 mr-1" /> Getting Started
                 </div>
                 <h3 className="text-2xl font-display font-bold mb-2">Automate your WhatsApp</h3>
                 <p className="text-indigo-100 font-medium max-w-sm mb-6">Create customized AI sequences for your leads to increase reply rates automatically.</p>
               </div>
               <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 font-bold h-12 shadow-md group">
                 <Play className="w-4 h-4 mr-2" /> Start Automation Setup
               </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
