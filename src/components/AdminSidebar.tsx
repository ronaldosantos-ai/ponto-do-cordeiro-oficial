import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Bell,
  Download,
  DollarSign,
  Settings,
  FileText,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Usuários', path: '/admin/users', icon: Users },
  { label: 'Simulações', path: '/admin/simulations', icon: TrendingUp },
  { label: 'Alertas', path: '/admin/alerts', icon: Bell },
  { label: 'Exportações', path: '/admin/exports', icon: Download },
  { label: 'Financeiro', path: '/admin/billing', icon: DollarSign },
  { label: 'Configurações', path: '/admin/settings', icon: Settings },
  { label: 'Logs', path: '/admin/logs', icon: FileText },
];

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const truncateEmail = (email: string) => {
    if (email.length > 20) {
      return email.substring(0, 17) + '...';
    }
    return email;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐑</span>
          <div>
            <h1 className="font-bold text-foreground">PONTO DO CORDEIRO</h1>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              isActive(item.path)
                ? 'bg-primary/10 text-primary border-l-4 border-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
          <span className="text-sm text-muted-foreground truncate">
            {truncateEmail(user?.email || '')}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao App
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile (drawer) */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-200 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar - Desktop (fixed) */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-card border-r border-border">
        <SidebarContent />
      </aside>
    </>
  );
}
