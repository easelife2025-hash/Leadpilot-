'use client';

import { RequireAuth } from '@/components/require-auth';
import { Button } from '@/components/ui/button';
import { MessageSquare, LayoutDashboard, Users, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut(auth);
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
  ];

  return (
    <RequireAuth>
      <div className="min-h-screen flex text-slate-900">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-10 hidden md:flex">
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <MessageSquare className="w-6 h-6 mr-2 text-indigo-600" />
            <span className="font-display font-bold text-lg">LeadPilot AI</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-200 space-y-2">
            <Button variant="ghost" className="w-full justify-start text-slate-600" onClick={handleSignOut}>
              <LogOut className="mr-3 h-5 w-5 text-slate-400" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:pl-64 flex flex-col min-h-0 bg-slate-50">
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
