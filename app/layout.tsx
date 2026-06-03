import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/components/auth-provider';

export const metadata: Metadata = {
  title: 'LeadPilot AI',
  description: 'Automated Lead Engagement System via WhatsApp Cloud API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrapping with AuthProvider after component is dynamically rebuilt */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
