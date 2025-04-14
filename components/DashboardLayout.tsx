import { ReactNode, useState } from 'react';
import { useAuth } from '../contexts/auth.context';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ClientOnly } from './common/ClientOnly';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientOnly>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </ClientOnly>
      
      <div className="lg:pl-64">
        <ClientOnly>
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
        </ClientOnly>
        
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 