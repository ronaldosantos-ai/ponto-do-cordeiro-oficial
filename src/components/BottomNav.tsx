import { Home, History, Bell, Settings, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verificarPremium } from '@/lib/storage';

const items = [
  { path: '/premium', icon: Home, label: 'Início' },
  { path: '/historico', icon: History, label: 'Histórico' },
  { path: '/graficos', icon: BarChart3, label: 'Gráficos' },
  { path: '/alertas', icon: Bell, label: 'Alertas' },
  { path: '/settings', icon: Settings, label: 'Config' }
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPremium = verificarPremium();
  
  if (!isPremium) return null;
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
