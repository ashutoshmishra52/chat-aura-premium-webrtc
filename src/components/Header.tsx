
import React from 'react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-card to-muted shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-gradient text-2xl font-bold">ChatAura</span>
          <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
            Premium
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-4">
          <Button variant="ghost" className="text-foreground hover:text-primary">
            About
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Help
          </Button>
          <Button variant="ghost" className="text-foreground hover:text-primary">
            Terms
          </Button>
        </nav>
        
        <Button className="bg-primary hover:bg-primary/80">
          Sign In
        </Button>
      </div>
    </header>
  );
};

export default Header;
