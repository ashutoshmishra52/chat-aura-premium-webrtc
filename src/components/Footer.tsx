
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card shadow-inner">
      <div className="container mx-auto py-4 px-6 text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} ottox.in. 
          All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="text-muted-foreground hover:text-primary text-xs">Privacy</a>
          <a href="#" className="text-muted-foreground hover:text-primary text-xs">Terms</a>
          <a href="#" className="text-muted-foreground hover:text-primary text-xs">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
