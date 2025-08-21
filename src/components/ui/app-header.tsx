import React from 'react';
import { Phone } from 'lucide-react';

export const AppHeader: React.FC = () => {
  return (
    <>
      {/* Barra dourada fixa no topo */}
      <div className="h-0.5 bg-[#D4AF37] w-full fixed top-0 z-50" />
      
      {/* Header principal */}
      <header className="sticky top-0.5 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">Cuellar Móveis</h1>
          </div>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors hover-lift"
          >
            <Phone className="h-4 w-4" />
            Fale conosco
          </a>
        </div>
      </header>
    </>
  );
};