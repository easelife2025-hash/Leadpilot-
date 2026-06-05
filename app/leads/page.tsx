'use client';

import { useEffect, useState } from 'react';
import { 
  MessageSquare, Users, Settings, LogOut, BarChart3, 
  Search, Filter, ArrowDownWideNarrow, Phone, User, 
  Clock, Flame, CheckCircle2, MoreVertical, Sparkles, Send, Zap
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, getDocs, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScore, setFilterScore] = useState<string>('All');
  
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadMessages, setLeadMessages] = useState<any[]>([]);
  const [leadNotes, setLeadNotes] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('updatedAt', 'desc'));
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

  useEffect(() => {
    let result = leads;
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(l => 
        (l.name && l.name.toLowerCase().includes(lowerQ)) || 
        (l.phoneNumber && l.phoneNumber.includes(lowerQ))
      );
    }
    if (filterScore !== 'All') {
      result = result.filter(l => l.leadScore === filterScore);
    }
    setFilteredLeads(result);
  }, [leads, searchQuery, filterScore]);

  useEffect(() => {
    if (selectedLead) {
      // Fetch messages for selected lead
      const messagesRef = collection(db, 'leads', selectedLead.id, 'messages');
      const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
      
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeadMessages(msgs);
      });
      return () => unsubscribe();
    }
  }, [selectedLead]);

  const handleUpdateStatus = async (status: string) => {
    if (!selectedLead) return;
    try {
      const leadRef = doc(db, 'leads', selectedLead.id);
      await updateDoc(leadRef, { status, updatedAt: serverTimestamp() });
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !leadNotes.trim()) return;
    try {
      const leadRef = doc(db, 'leads', selectedLead.id);
      // We can append to a notes array or a subcollection, but let's just append to a string for simplicity, or an array field
      const currentNotes = selectedLead.notes || [];
      await updateDoc(leadRef, { 
        notes: [...currentNotes, { text: leadNotes, timestamp: new Date() }],
        updatedAt: serverTimestamp() 
      });
      setLeadNotes('');
      toast.success('Note added');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add note');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - same as dashboard */}
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
          <Link href="/campaigns" className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Zap className="w-5 h-5 mr-3" />
            Campaigns
          </Link>
          <Link href="/settings" className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <button className="flex items-center w-full px-3 py-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area - Split Pane */}
      <div className="flex-1 ml-64 min-w-0 flex flex-col h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between flex-shrink-0">
          <h1 className="text-xl font-bold text-slate-900 font-display flex items-center">
            Lead Management
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
            </div>
            <select 
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              className="border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Scores</option>
              <option value="Hot">Hot Intent</option>
              <option value="Warm">Warm</option>
              <option value="Cold">Cold</option>
            </select>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Leads List */}
          <div className="w-[350px] border-r border-slate-200 bg-white flex flex-col overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex flex-col gap-2 p-2 pb-4 border-b border-slate-50 last:border-0">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No leads found</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredLeads.map(lead => (
                  <button 
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex flex-col gap-2 ${selectedLead?.id === lead.id ? 'bg-indigo-50/50 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-semibold text-slate-900 truncate pr-2">{lead.name || lead.phoneNumber}</span>
                      {lead.leadScore === 'Hot' && <span className="shrink-0 px-2 flex py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-orange-100 text-orange-600"><Flame className="w-3 h-3 mr-1" />Hot</span>}
                      {lead.leadScore === 'Warm' && <span className="shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-yellow-100 text-yellow-700">Warm</span>}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1">{lead.lastMessage}</p>
                    <div className="flex justify-between items-center w-full mt-1">
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{lead.status || 'New'}</span>
                      <span className="text-xs text-slate-400">
                        {lead.lastMessageAt?.toDate ? lead.lastMessageAt.toDate().toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ''}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Pane: Lead Profile */}
          <div className="flex-1 bg-slate-50 overflow-y-auto">
            {selectedLead ? (
              <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
                
                {/* Profile Header */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-display text-2xl font-bold">
                      {selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedLead.name || 'Unknown Contact'}</h2>
                      <div className="flex items-center text-slate-500 text-sm mt-1 gap-2">
                        <Phone className="w-4 h-4" /> {selectedLead.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={selectedLead.status || 'New'}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 font-medium font-display"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                      <option value="Recovered">Recovered</option>
                    </select>
                    <Button variant="outline"><MoreVertical className="w-4 h-4" /></Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: AI & Notes */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* AI Insights */}
                    <Card className="border-indigo-100 shadow-md shadow-indigo-100/50 bg-gradient-to-b from-indigo-50/50 to-white">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-center gap-2 font-display font-semibold text-indigo-900 border-b border-indigo-100 pb-3">
                          <Sparkles className="w-5 h-5 text-indigo-500" /> AI Insights
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">Score & Intent</span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {selectedLead.leadScore && (
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                                selectedLead.leadScore === 'Hot' ? 'bg-orange-100 text-orange-700' :
                                selectedLead.leadScore === 'Warm' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {selectedLead.leadScore} Score
                              </span>
                            )}
                            {selectedLead.intent && (
                              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-100 text-indigo-700">
                                {selectedLead.intent}
                              </span>
                            )}
                          </div>
                        </div>

                        {selectedLead.summary && (
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">Summary</span>
                            <p className="text-sm text-slate-700 leading-relaxed bg-white/60 p-3 rounded-lg border border-indigo-50">
                              {selectedLead.summary}
                            </p>
                          </div>
                        )}

                        {selectedLead.nextAction && (
                          <div className="space-y-1">
                            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">Suggested Action</span>
                            <div className="flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-indigo-50">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-sm font-medium text-slate-800">{selectedLead.nextAction}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Internal Notes */}
                    <Card>
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-slate-900 mb-4">Internal Notes</h3>
                        <div className="space-y-4 mb-4">
                          {!selectedLead.notes || selectedLead.notes.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">No notes yet</p>
                          ) : (
                            <div className="space-y-3">
                              {selectedLead.notes.map((note: any, i: number) => (
                                <div key={i} className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-100">
                                  <p className="text-slate-700">{note.text}</p>
                                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                    {note.timestamp?.toDate ? note.timestamp.toDate().toLocaleString() : 'Just now'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <textarea 
                            value={leadNotes}
                            onChange={(e) => setLeadNotes(e.target.value)}
                            placeholder="Add a note..."
                            className="w-full text-sm border border-slate-200 rounded-lg p-2 min-h-[60px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <Button onClick={handleAddNote} className="shrink-0 h-auto" size="sm">Add</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column: Conversation History & Follow-ups */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="flex flex-col h-[600px]">
                      <CardContent className="px-0 py-0 flex flex-col h-full">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                          <h3 className="font-semibold text-slate-900">Conversation History</h3>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {leadMessages.length === 0 ? (
                            <p className="text-center text-slate-500 text-sm py-12">No messages loaded</p>
                          ) : (
                            leadMessages.map((msg, i) => (
                              <div key={msg.id || i} className={`max-w-[80%] rounded-2xl p-3 ${
                                msg.type === 'outbound' 
                                  ? 'bg-indigo-600 text-white ml-auto rounded-tr-sm' 
                                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                              }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${msg.type === 'outbound' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                  {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                        
                        {/* Draft Follow-up / Reply */}
                        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                          {selectedLead.suggestedFollowUp && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">AI Suggested Reply</p>
                              <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 text-sm text-indigo-900 group cursor-pointer hover:bg-indigo-100 transition-colors">
                                {selectedLead.suggestedFollowUp}
                                <span className="block text-xs font-medium text-indigo-500 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Click to copy to editor
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="relative">
                            <textarea 
                              placeholder="Type a message..."
                              className="w-full text-sm border border-slate-300 rounded-xl pl-4 pr-12 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 max-h-32 min-h-[50px] resize-y shadow-sm"
                            />
                            <Button size="sm" className="absolute right-2 bottom-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 w-8 h-8 p-0 flex items-center justify-center">
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Users className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-medium text-slate-500">Select a lead to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
