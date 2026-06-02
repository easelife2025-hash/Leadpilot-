'use client';

import { RequireAuth } from '@/components/require-auth';
import { Button } from '@/components/ui/button';
import { MessageSquare, LayoutDashboard, Database, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('dummy')) {
      router.push('/login');
      return;
    }
    await signOut(auth);
    router.push('/');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/dashboard/leads', icon: Database },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <RequireAuth>
      <div className="min-h-screen flex bg-slate-50 text-slate-900">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 bg-white/50 backdrop-blur-xl flex flex-col hidden md:flex sticky top-0 h-screen">
          <div className="p-6 flex items-center font-display font-bold text-xl text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center mr-3 shadow-md shadow-indigo-500/20">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            LeadPilot
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 relative' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 w-full transition-all"
            >
              <LogOut className="w-5 h-5 text-slate-400" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-x-hidden min-h-screen relative">
          <div className="pointer-events-none fixed inset-0 z-[-1] opacity-50">
            <div className="absolute top-[5%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-200/20 blur-[100px]" />
          </div>
          
          {/* Mobile Header */}
          <header className="md:hidden h-16 border-b border-slate-200 bg-white/70 backdrop-blur-md flex items-center justify-between px-4 z-10 sticky top-0">
            <div className="flex items-center font-display font-bold text-lg text-slate-900">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center mr-2">
                <MessageSquare className="w-3 h-3 text-white" />
              </div>
              LeadPilot
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </header>

          <div className="flex-1 p-6 md:p-10 w-full max-w-6xl mx-auto z-0">
            {children}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
