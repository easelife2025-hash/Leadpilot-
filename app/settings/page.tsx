'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, Users, Settings as SettingsIcon, LogOut, BarChart3, 
  Zap, User, Bell, Lock, CreditCard, Key, Smartphone, Shield,
  CheckCircle2, Plus, Copy, Eye, EyeOff, MoreVertical, Loader2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

// Keep window.FB typing simple
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

function WhatsAppSettings() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [envError, setEnvError] = useState(false);

  useEffect(() => {
    // 1. Fetch current config
    fetch('/api/whatsapp/config')
      .then(res => res.json())
      .then(data => {
        if (data.connected) {
          setConfig(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // 2. Load FB SDK
    const appId = process.env.NEXT_PUBLIC_META_APP_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    if (!appId) {
      setEnvError(true);
      return;
    }

    if (window.FB) {
      setSdkLoaded(true);
      return;
    }

    window.fbAsyncInit = function() {
      window.FB.init({
        appId            : appId,
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v19.0'
      });
      setSdkLoaded(true);
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement; js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }, []);

  const handleConnect = () => {
    if (!window.FB) {
      toast.error('Facebook SDK not loaded yet.');
      return;
    }

    // Use specific FB.login for WhatsApp Business Management
    window.FB.login((response: any) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        setLoading(true);
        // Exchange with backend
        fetch('/api/whatsapp/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken })
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            toast.error(data.error);
          } else {
            toast.success("Successfully connected Meta Account!");
            setConfig({ connected: true, wabaId: data.wabaId, phoneNumberId: data.phoneNumberId });
          }
        })
        .catch(() => toast.error("Failed to connect. API Error."))
        .finally(() => setLoading(false));

      } else {
        toast.error('User cancelled login or did not fully authorize.');
      }
    }, {
      scope: 'whatsapp_business_management,whatsapp_business_messaging',
      // If config_id is provided, pass it here
      // config_id: process.env.NEXT_PUBLIC_FACEBOOK_CONFIG_ID,
    });
  };

  if (envError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm">Missing Meta Config</h3>
          <p className="text-sm mt-1">Please set <code>NEXT_PUBLIC_META_APP_ID</code> in your `.env` file and restart the server.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  if (config?.connected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg font-medium text-sm">
          <CheckCircle2 className="w-5 h-5" /> Account Connected via Meta Cloud API
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">WABA ID (WhatsApp Business Account)</label>
            <input type="text" readOnly value={config.wabaId} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm font-mono text-slate-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Phone Number ID</label>
            <input type="text" readOnly value={config.phoneNumberId} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm font-mono text-slate-500" />
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4 mt-6">
          <h4 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2">Webhook Configuration</h4>
          <p className="text-xs text-slate-500 mb-2">Provide these details in your <a href="https://developers.facebook.com/apps/" target="_blank" rel="noreferrer" className="text-indigo-600 underline">Meta App Dashboard</a> to receive incoming messages.</p>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Callback URL</label>
            <div className="flex gap-2">
              <input type="text" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : 'https://leadpilot.app'}/api/whatsapp/webhook`} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-mono text-slate-600" />
              <Button variant="outline" size="icon" className="shrink-0" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/api/whatsapp/webhook`); toast.success('Callback URL copied to clipboard'); }}><Copy className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Verify Token</label>
            <div className="flex gap-2">
              <input type="text" readOnly value={'leadpilot_secure_token_8891'} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-mono text-slate-600" />
              <Button variant="outline" size="icon" className="shrink-0" onClick={() => { navigator.clipboard.writeText('leadpilot_secure_token_8891'); toast.success('Verify Token copied to clipboard'); }}><Copy className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-4 justify-end items-center">
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-transparent shrink-0" onClick={() => {
            fetch('/api/whatsapp/config', { method: 'DELETE' }); // Not implemented yet, just clearing UI for now
            setConfig(null);
            toast.success("Disconnected.");
          }}>
            Disconnect Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <Smartphone className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-slate-900 mb-2">Connect WhatsApp Business</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          Authorize your Meta developer app to enable real-time messaging, webhooks, and automated replies.
        </p>
        <Button 
          onClick={handleConnect} 
          disabled={!sdkLoaded}
          className="bg-[#1877F2] hover:bg-[#166FE5] text-white"
        >
          {sdkLoaded ? 'Continue with Facebook' : 'Loading SDK...'}
        </Button>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'whatsapp', label: 'WhatsApp API', icon: Smartphone },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  { id: 'api', label: 'API Keys', icon: Key },
];

function Toggle({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Fake states for toggles
  const [notifHot, setNotifHot] = useState(true);
  const [notifWarm, setNotifWarm] = useState(false);
  const [notifDaily, setNotifDaily] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10 w-shrink-0">
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
          <Link href="/settings" className="flex items-center w-full px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium transition-colors">
            <SettingsIcon className="w-5 h-5 mr-3" />
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
            Settings
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
            
            {/* Settings Navigation Navigation */}
            <div className="w-full md:w-64 shrink-0 space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60' 
                        : 'text-slate-600 hover:bg-slate-200/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Settings Content Area */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  
                  {activeTab === 'profile' && (
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-xl font-display">My Profile</CardTitle>
                        <CardDescription>Manage your personal information and avatar.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold font-display border-4 border-white shadow-sm">
                            JD
                          </div>
                          <div>
                            <Button variant="outline" size="sm" className="mb-1">Upload new picture</Button>
                            <p className="text-xs text-slate-500 mt-1">At least 800x800 px recommended (JPG or PNG).</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">First Name</label>
                            <input type="text" defaultValue="John" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Last Name</label>
                            <input type="text" defaultValue="Doe" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" defaultValue="johndoe@example.com" disabled className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                          <Button 
                            className="bg-indigo-600 hover:bg-indigo-700"
                            onClick={() => toast.success('Profile updated successfully')}
                          >
                            Save Changes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'whatsapp' && (
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-xl font-display flex items-center justify-between w-full">
                          <span>WhatsApp Business API</span>
                          {/* We will render connection status here based on real state */}
                        </CardTitle>
                        <CardDescription>Real Meta Graph API connection for WhatsApp Business.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <WhatsAppSettings />
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'team' && (
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                          <CardTitle className="text-xl font-display">Team Members</CardTitle>
                          <CardDescription>Manage who has access to this workspace.</CardDescription>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700"><Plus className="w-4 h-4 mr-2" /> Invite</Button>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                          {[
                            { name: 'John Doe', email: 'johndoe@example.com', role: 'Owner', initials: 'JD', active: true },
                            { name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', initials: 'AS', active: true },
                            { name: 'Bob Wilson', email: 'bob@example.com', role: 'Agent', initials: 'BW', active: false },
                          ].map((member, i) => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-semibold flex items-center justify-center text-sm border-2 border-white shadow-sm">
                                  {member.initials}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-slate-900 text-sm">{member.name}</p>
                                    {!member.active && <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Invited</span>}
                                  </div>
                                  <p className="text-slate-500 text-sm">{member.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <select 
                                  defaultValue={member.role} 
                                  disabled={member.role === 'Owner'}
                                  className="text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                                >
                                  <option value="Owner">Owner</option>
                                  <option value="Admin">Admin</option>
                                  <option value="Agent">Agent</option>
                                </select>
                                <Button variant="ghost" size="icon" disabled={member.role === 'Owner'} className="text-slate-400">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'notifications' && (
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-xl font-display">Notification Preferences</CardTitle>
                        <CardDescription>Control when and how you receive alerts.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-4">Lead Activity</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-slate-900 text-sm">Hot Lead Interacted</p>
                                  <p className="text-slate-500 text-xs mt-0.5">Alert me instantly when AI scores a lead as &quot;Hot&quot;.</p>
                                </div>
                                <Toggle checked={notifHot} onChange={setNotifHot} />
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div>
                                  <p className="font-medium text-slate-900 text-sm">Any Lead Reply</p>
                                  <p className="text-slate-500 text-xs mt-0.5">Alert me for standard lead replies.</p>
                                </div>
                                <Toggle checked={notifWarm} onChange={setNotifWarm} />
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-semibold text-slate-900 mb-4">Email Digests</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-slate-900 text-sm">Daily Performance Digest</p>
                                  <p className="text-slate-500 text-xs mt-0.5">A morning summary of lead acquisitions and automations.</p>
                                </div>
                                <Toggle checked={notifDaily} onChange={setNotifDaily} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'security' && (
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-xl font-display">Security Settings</CardTitle>
                        <CardDescription>Keep your account and workspace secure.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 mb-4">Change Password</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5 md:col-span-2">
                              <label className="text-sm font-medium text-slate-700">Current Password</label>
                              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-700">New Password</label>
                              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                              <input type="password" placeholder="••••••••" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => toast.success('Password updated successfully')}>Update Password</Button>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h4>
                              <p className="text-slate-500 text-xs mt-1 max-w-md">Add an extra layer of security to your account using an authenticator app.</p>
                            </div>
                            <Button variant="outline" onClick={() => setTwoFactor(!twoFactor)}>
                              {twoFactor ? 'Configured' : 'Set up 2FA'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'billing' && (
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-xl font-display">Billing & Plan</CardTitle>
                        <CardDescription>Manage your subscription and payment methods.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        
                        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-md">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <p className="text-indigo-200 font-medium mb-1">Current Plan</p>
                              <h3 className="text-3xl font-bold font-display">Professional</h3>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold font-display">$49 <span className="text-base text-indigo-300 font-normal">/mo</span></p>
                              <p className="text-sm text-indigo-200 mt-1">Renews on July 4, 2026</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-indigo-200">AI Automation Volume</span>
                              <span className="font-medium">1,245 / 5,000 requests</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                              <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex gap-3">
                            <Button className="bg-white text-indigo-900 hover:bg-slate-100 border-none">Upgrade Plan</Button>
                            <Button variant="outline" className="bg-transparent border-indigo-400 text-indigo-100 hover:bg-indigo-800 hover:text-white">Cancel Subscription</Button>
                          </div>
                        </div>

                        <div className="pt-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">Payment Method</h4>
                          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-8 bg-slate-100 border border-slate-200 rounded flex items-center justify-center font-bold text-slate-600 text-xs italic">
                                VISA
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 text-sm">Visa ending in 4242</p>
                                <p className="text-xs text-slate-500">Expires 12/28</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Update</Button>
                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'api' && (
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-display">API Keys</CardTitle>
                          <CardDescription>Connect LeadPilot to external tools via our REST API.</CardDescription>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700"><Plus className="w-4 h-4 mr-2" /> Generate Key</Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border border-slate-200 rounded-lg p-5">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-slate-900 text-sm">Production API Key</h4>
                                <p className="text-xs text-slate-500 mt-1">Created on Jan 15, 2026</p>
                              </div>
                              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Active</span>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <div className="relative flex-1">
                                <input 
                                  type={showApiKey ? 'text' : 'password'} 
                                  value="lp_pk_live_d8f7bXyZ9aQ12vBnM45pLrTsw"
                                  readOnly
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 font-mono text-slate-600 placeholder-slate-400 focus:outline-none" 
                                />
                                <button 
                                  onClick={() => setShowApiKey(!showApiKey)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                              <Button variant="outline" size="icon" className="shrink-0" onClick={() => { navigator.clipboard.writeText('lp_pk_live_d8f7bXyZ9aQ12vBnM45pLrTsw'); toast.success('API Key copied to clipboard'); }}><Copy className="w-4 h-4" /></Button>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">Revoke Key</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
