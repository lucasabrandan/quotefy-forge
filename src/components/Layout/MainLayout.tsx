import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <main className="flex-1 p-7">
      <div className="bg-panel border border-border rounded-2xl p-6 max-w-7xl mx-auto shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
        {children}
      </div>
    </main>
  );
}