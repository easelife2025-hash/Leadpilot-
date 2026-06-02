'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Zap, MessageSquare } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

export default function DashboardOverview() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900">Welcome, {user?.displayName || 'User'} 👋</h1>
        <p className="text-slate-500 mt-1">Here's a quick overview of your lead operations today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">128</div>
            <p className="text-xs text-slate-500">+14% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">+12</div>
            <p className="text-xs text-slate-500">+2% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Messages Gen</CardTitle>
            <Zap className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">432</div>
            <p className="text-xs text-slate-500">22 hrs saved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">89</div>
            <p className="text-xs text-slate-500">+19% conversion rate</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system logs and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
                 <div className="bg-indigo-100 p-2 rounded-full"><MessageSquare className="w-4 h-4 text-indigo-600" /></div>
                 <div><p className="text-sm font-medium">Message sent to John Doe</p><p className="text-xs text-slate-500">2 mins ago</p></div>
               </div>
               <div className="flex items-center space-x-4 border-b border-slate-100 pb-4">
                 <div className="bg-emerald-100 p-2 rounded-full"><Users className="w-4 h-4 text-emerald-600" /></div>
                 <div><p className="text-sm font-medium">New lead John Doe captured</p><p className="text-xs text-slate-500">22 mins ago</p></div>
               </div>
               <div className="flex items-center space-x-4">
                 <div className="bg-amber-100 p-2 rounded-full"><Zap className="w-4 h-4 text-amber-600" /></div>
                 <div><p className="text-sm font-medium">AI completed drafted response</p><p className="text-xs text-slate-500">1 hr ago</p></div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
