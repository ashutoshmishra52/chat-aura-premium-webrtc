
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Users } from 'lucide-react';
import webRTCService from '@/utils/webrtcService';
import { useToast } from '@/hooks/use-toast';
import VideoControls from '@/components/VideoControls';

const VideoChat: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeWebRTC = async () => {
      if (localVideoRef.current && remoteVideoRef.current) {
        const success = await webRTCService.initialize(
          localVideoRef.current,
          remoteVideoRef.current
        );
        
        if (success) {
          setIsInitialized(true);
        }
      }
    };

    initializeWebRTC();

    return () => {
      webRTCService.cleanup();
    };
  }, []);

  const handleConnectClick = async () => {
    if (!isInitialized) {
      toast({
        title: "Not Ready",
        description: "Camera initialization is not complete. Please allow camera access.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      await webRTCService.connectToRandomUser();
      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: "You are now connected to a random user.",
      });
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to a random user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectClick = () => {
    webRTCService.disconnect();
    setIsConnected(false);
    
    toast({
      title: "Disconnected",
      description: "You have disconnected from the chat.",
    });
  };

  const handleToggleVideo = () => {
    const enabled = webRTCService.toggleVideo();
    setVideoEnabled(enabled);
  };

  const handleToggleAudio = () => {
    const enabled = webRTCService.toggleAudio();
    setAudioEnabled(enabled);
  };

  const handleNextClick = () => {
    handleDisconnectClick();
    handleConnectClick();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative flex-grow flex flex-col md:flex-row gap-4 p-4">
        {/* Remote video (large) */}
        <div className="relative h-full md:h-auto md:flex-grow flex-shrink-0 rounded-xl overflow-hidden bg-muted">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="text-center">
                <Users className="h-20 w-20 mx-auto text-primary mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isConnecting ? 'Connecting...' : 'No One Connected'}
                </h2>
                <p className="text-gray-300">
                  {isConnecting 
                    ? 'Looking for someone to chat with...' 
                    : 'Click connect to start a random chat'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Local video (small) */}
        <div className="absolute bottom-8 right-8 w-1/3 max-w-[200px] max-h-[150px] rounded-xl overflow-hidden shadow-lg border-2 border-primary">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {(!videoEnabled || !isInitialized) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <VideoOff className="h-10 w-10 text-white/70" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <VideoControls 
        isConnected={isConnected}
        isConnecting={isConnecting}
        videoEnabled={videoEnabled}
        audioEnabled={audioEnabled}
        onToggleVideo={handleToggleVideo}
        onToggleAudio={handleToggleAudio}
        onConnect={handleConnectClick}
        onDisconnect={handleDisconnectClick}
        onNext={handleNextClick}
      />
    </div>
  );
};

export default VideoChat;
