
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoChat from '@/components/VideoChat';
import LandingHero from '@/components/LandingHero';

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  const handleStartChatting = () => {
    setShowChat(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        {showChat ? (
          <VideoChat />
        ) : (
          <LandingHero onStartChatting={handleStartChatting} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
