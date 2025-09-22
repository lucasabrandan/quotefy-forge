import { ViewType } from '@/types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'quote' as ViewType, label: 'Cotización', active: true },
    { id: 'products' as ViewType, label: 'Productos', active: true },
    { id: 'history' as ViewType, label: 'Cotizaciones', active: false },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <h1 className="text-xl font-bold text-sidebar-primary mb-6 leading-tight">
          // Barra lateral<br />
          Cotizador
        </h1>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => item.active && onViewChange(item.id)}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg transition-colors font-medium
                    ${currentView === item.id 
                      ? 'bg-sidebar-accent text-sidebar-primary' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }
                    ${!item.active ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  disabled={!item.active}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}