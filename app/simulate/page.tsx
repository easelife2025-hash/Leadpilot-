'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

export default function SimulateWhatsAppPage() {
  const [phoneNumber, setPhoneNumber] = useState('+15551234567');
  const [contactName, setContactName] = useState('Jane Smith');
  const [message, setMessage] = useState('Hi, I am interested in your services. Can you send pricing?');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      // Simulate the exact Meta Graph API WhatsApp webhook payload
      const payload = {
        object: 'whatsapp_business_account',
        entry: [
          {
            changes: [
              {
                value: {
                  contacts: [
                    {
                      profile: {
                        name: contactName,
                      },
                    },
                  ],
                  messages: [
                    {
                      from: phoneNumber.replace(/[^a-zA-Z0-9]/g, ''), // Strip formatting for API
                      type: 'text',
                      text: {
                        body: message,
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      const response = await fetch('/api/whatsapp/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Message sent to webhook!');
        setMessage(''); // Clear input after sending
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-emerald-200">
        <CardHeader className="bg-emerald-600 text-white rounded-t-xl pb-4">
          <CardTitle className="flex items-center gap-2 font-display">
            <Smartphone className="w-5 h-5" />
            Customer POV (Simulator)
          </CardTitle>
          <CardDescription className="text-emerald-100">
            Send a fake WhatsApp message to trigger your AI agent.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4 bg-white/50">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Customer Name</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm min-h-[100px] resize-y focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={isSending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isSending ? 'Sending...' : 'Send WhatsApp Message'}
            {!isSending && <Send className="w-4 h-4 ml-2" />}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
