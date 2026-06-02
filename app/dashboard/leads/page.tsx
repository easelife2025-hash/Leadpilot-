'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Zap, Plus, Phone } from 'lucide-react';

export default function LeadsPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const handleGenerate = async () => {
    if (!context || !name) return alert('Name and Context required to generate AI message');
    
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, name }),
      });
      const data = await res.json();
      if (data.text) {
        setGeneratedMessage(data.text);
      } else {
        alert('Failed to generate message');
      }
    } catch (e) {
      console.error(e);
      alert('Error generating message');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!phoneNumber || !generatedMessage) return alert('Phone number and message are required.');
    
    setSending(true);
    try {
      // In a real app, this posts to Firebase or our Whatsapp API Node Route
      // For this prototype, simulate network delay
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, message: generatedMessage }),
      });
      
      if (res.ok) {
        alert('Message sent to ' + phoneNumber);
      } else {
        alert('Simulated sending failed, but typically this would trigger cloud API.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Leads Engine</h1>
          <p className="text-slate-500 font-medium mt-1">Draft context-aware outreach instantly using AI</p>
        </div>
        <Button className="font-bold shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Import Leads
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-slate-200/60 shadow-sm bg-white/70 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl">1. Target Lead</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Provide data for the AI personalization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lead Name</Label>
                <Input 
                  placeholder="e.g. Sarah Jenkins" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <div className="relative">
                   <Phone className="w-4 h-4 absolute left-3 top-4 text-slate-400" />
                   <Input 
                     type="tel"
                     placeholder="+1234567890" 
                     className="pl-10"
                     value={phoneNumber}
                     onChange={(e) => setPhoneNumber(e.target.value)}
                   />
                </div>
              </div>
            </div>
            <div className="space-y-2">
               <Label>Business Context or Product Interest</Label>
               <Textarea 
                 placeholder="Sarah signed up for a trial 2 days ago but hasn't activated her dashboard. Offer help or a quick 10m call."
                 value={context}
                 onChange={(e) => setContext(e.target.value)}
               />
            </div>
            <Button 
               onClick={handleGenerate} 
               disabled={loading || !context || !name} 
               className="w-full bg-slate-900 hover:bg-slate-800 font-bold"
            >
              {loading ? 'Drafting with Gemini...' : (
                <> <Zap className="w-4 h-4 mr-2 text-emerald-400" /> Generate AI Message </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 shadow-lg shadow-indigo-100/50 bg-white/90 backdrop-blur-xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] pointer-events-none" />
          
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <MessageSquare className="w-5 h-5 text-indigo-500 mr-2" /> 
              2. Draft & Send
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Review AI output and send via Meta Cloud API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
             <div className="space-y-2">
               <Label>Message Content</Label>
               <Textarea 
                 className="min-h-[180px] bg-indigo-50/30 border-indigo-100 text-slate-700" 
                 placeholder="Generated message will appear here..."
                 value={generatedMessage}
                 onChange={(e) => setGeneratedMessage(e.target.value)}
               />
             </div>
             <Button 
               onClick={handleSend} 
               disabled={sending || !generatedMessage || !phoneNumber} 
               className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md h-12 text-md"
             >
               {sending ? 'Sending Protocol...' : 'Send WhatsApp Message'}
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
