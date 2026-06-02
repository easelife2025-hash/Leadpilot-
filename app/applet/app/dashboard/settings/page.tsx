'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Settings, CheckCircle2, ShieldAlert, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have a success callback from Meta OAuth
    if (searchParams.get('success') === 'true') {
      setIsConnected(true);
      // Clean up URL parameters
      router.replace('/dashboard/settings');
    } else {
      // Check local storage for connection state in this demo/preview
      const connected = localStorage.getItem('whatsapp_connected') === 'true';
      setIsConnected(connected);
    }
    setIsLoading(false);
  }, [searchParams, router]);

  useEffect(() => {
    if (isConnected) {
      localStorage.setItem('whatsapp_connected', 'true');
    }
  }, [isConnected]);

  const connectWhatsApp = () => {
    setIsLoading(true);
    // Redirect to our backend auth route which handles Meta OAuth Embedded Signup flow
    window.location.href = '/api/whatsapp/auth';
  };

  const disconnectWhatsApp = () => {
    localStorage.removeItem('whatsapp_connected');
    setIsConnected(false);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your integrations and Meta Cloud API credentials</p>
      </div>

      <Card className="border-slate-200/60 shadow-sm bg-white/70 backdrop-blur-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" />
            WhatsApp Cloud API Connection
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Connect your Meta Business account to send and receive messages automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center space-x-2 text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Checking connection state...</span>
            </div>
          ) : isConnected ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex items-start space-x-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900">Connected to Meta successfully</h4>
                  <p className="text-sm text-emerald-700 font-medium mt-1">
                    Your WhatsApp Business number is active. The webhook is listening for incoming messages.
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label>Phone Number ID</Label>
                   <Input disabled value="101xxxxxxxxxxxxx7" className="bg-slate-50 text-slate-500" />
                </div>
                <div className="space-y-2">
                   <Label>WABA ID</Label>
                   <Input disabled value="113xxxxxxxxxxxxx9" className="bg-slate-50 text-slate-500" />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button variant="outline" className="font-bold text-red-600 hover:text-red-700 hover:bg-red-50" onClick={disconnectWhatsApp}>
                  Disconnect Account
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50 flex items-start space-x-4">
                <ShieldAlert className="w-6 h-6 text-sky-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sky-900">Setup Required</h4>
                  <p className="text-sm text-sky-700 font-medium mt-1">
                     Initiate the Meta Embedded Signup flow. This requires a business account and verified phone number. 
                     In this preview environment, clicking Connect will simulate a successful OAuth loop.
                  </p>
                </div>
              </div>

              <Button onClick={connectWhatsApp} className="font-bold h-12 px-6 shadow-md shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                <LinkIcon className="w-4 h-4 mr-2" />
                Connect WhatsApp via Meta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
