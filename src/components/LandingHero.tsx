
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LandingHeroProps {
  onStartChatting: () => void;
}

const LandingHero: React.FC<LandingHeroProps> = ({ onStartChatting }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartClick = () => {
    setIsLoading(true);
    
    // Simulate request for camera permissions
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(() => {
        onStartChatting();
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
        toast({
          title: "Camera Access Error",
          description: "Please allow camera and microphone access to use this app.",
          variant: "destructive"
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-premium-gradient min-h-[calc(100vh-64px-56px)] flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-gradient">Premium</span> Random Video Chat
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Connect with interesting people around the world with our secure, high-quality video chat platform.
        </p>
        
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <div className="glass p-6 rounded-xl">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-gray-300">End-to-end encryption for all your conversations.</p>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast</h3>
            <p className="text-gray-300">High-quality video with minimum latency.</p>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Global</h3>
            <p className="text-gray-300">Meet people from all around the world.</p>
          </div>
        </div>
        
        <Button 
          className="bg-accent hover:bg-accent/80 text-white px-8 py-6 text-lg rounded-full btn-glow"
          size="lg"
          onClick={handleStartClick}
          disabled={isLoading}
        >
          {isLoading ? 'Preparing Camera...' : 'Start Chatting Now'}
        </Button>
      </div>
    </div>
  );
};

export default LandingHero;
