'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Sparkles, Send } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

interface Lead {
  id: string;
  name: string;
  phone: string;
  industry: string;
  context: string;
  createdAt: any;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('');
  const [context, setContext] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchLeads = async () => {
    try {
      setErrorMsg('');
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetched: Lead[] = [];
      snapshot.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(fetched);
    } catch (e: any) {
      console.error(e);
      if (e.code === 'permission-denied') {
          setErrorMsg('Permission denied: Please update Firebase Firestore rules to allow read/write.');
      } else {
          setErrorMsg('Failed to load leads: ' + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'leads'), {
        name,
        phone,
        industry,
        context,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setName(''); setPhone(''); setIndustry(''); setContext('');
      fetchLeads();
    } catch (e: any) {
      console.error("Error adding doc: ", e);
      if (e.code === 'permission-denied') {
          alert('Permission denied: Please check your Firestore Security Rules allow document creation.');
      }
      setLoading(false);
    }
  };

  const handleGenerateAndSend = async (lead: Lead) => {
    setGeneratingFor(lead.id);
    try {
      // 1. Generate text with Gemini
      const genRes = await fetch('/api/ai/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: lead.name, industry: lead.industry, context: lead.context })
      });
      
      if (!genRes.ok) throw new Error('Failed to generate AI message');
      const { text } = await genRes.json();
      
      // 2. Send via WhatsApp API
      const whatsappRes = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: lead.phone, message: text })
      });
      
      if (!whatsappRes.ok) throw new Error('Failed to send WhatsApp message');
      
      alert(`Successfully sent message to ${lead.name}:\n\n"${text}"`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to generate or send message. Check console logs.');
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Leads</h1>
          <p className="text-slate-500 mt-1">Manage prospects and initiate AI outreach.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Add Lead</>}
        </Button>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      {isAdding && (
        <Card className="border-indigo-100 shadow-md">
          <CardHeader>
            <CardTitle>New Lead Details</CardTitle>
            <CardDescription>Enter prospect context for better AI personalization.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1234567890" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input required value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Real Estate" />
              </div>
              <div className="space-y-2">
                <Label>Context / Notes</Label>
                <Textarea required value={context} onChange={e => setContext(e.target.value)} placeholder="Looking for properties in downtown..." />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Lead'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {loading && !isAdding ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
        ) : leads.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
            <h3 className="text-lg font-medium text-slate-900 mb-2">No leads here</h3>
            <p className="text-slate-500">Currently no leads in this view. Add one to get started.</p>
          </div>
        ) : (
          leads.map(lead => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900">{lead.name}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-slate-600">
                     <span><strong>Phone:</strong> {lead.phone}</span>
                     <span><strong>Industry:</strong> {lead.industry}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500"><strong>Notes:</strong> {lead.context}</p>
                </div>
                <Button 
                  onClick={() => handleGenerateAndSend(lead)} 
                  disabled={generatingFor === lead.id}
                  className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto shrink-0"
                >
                  {generatingFor === lead.id ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-4 h-4 mr-2" /> AI Message & Send</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
