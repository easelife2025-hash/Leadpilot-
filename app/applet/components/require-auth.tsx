'use client';

import { useAuth } from './auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user && pathname.startsWith('/dashboard')) {
        // Bypass redirect in preview mode if no real Firebase keys are present
        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('dummy')) {
          setIsReady(true);
        } else {
          router.push('/login');
        }
      } else {
        setIsReady(true);
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || !isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return <>{children}</>;
}
