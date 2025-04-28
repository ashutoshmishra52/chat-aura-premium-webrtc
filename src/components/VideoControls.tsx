
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Users } from 'lucide-react';

interface VideoControlsProps {
  isConnected: boolean;
  isConnecting: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onNext: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isConnected,
  isConnecting,
  videoEnabled,
  audioEnabled,
  onToggleVideo,
  onToggleAudio,
  onConnect,
  onDisconnect,
  onNext,
}) => {
  return (
    <div className="p-4 bg-gradient-to-r from-muted to-card rounded-xl my-4 flex flex-wrap justify-center gap-2 md:gap-4">
      <Button
        onClick={onToggleVideo}
        variant="outline"
        size="icon"
        className={`glass h-12 w-12 ${videoEnabled ? 'text-white' : 'text-muted-foreground bg-muted/50'}`}
      >
        {videoEnabled ? <Video /> : <VideoOff />}
      </Button>
      
      <Button
        onClick={onToggleAudio}
        variant="outline"
        size="icon"
        className={`glass h-12 w-12 ${audioEnabled ? 'text-white' : 'text-muted-foreground bg-muted/50'}`}
      >
        {audioEnabled ? <Mic /> : <MicOff />}
      </Button>
      
      {!isConnected ? (
        <Button
          onClick={onConnect}
          className="bg-accent hover:bg-accent/80 text-white px-6 h-12 btn-glow"
          disabled={isConnecting}
        >
          <Phone className="mr-2 h-4 w-4" />
          {isConnecting ? 'Connecting...' : 'Connect'}
        </Button>
      ) : (
        <>
          <Button
            onClick={onDisconnect}
            variant="destructive"
            className="h-12"
          >
            <PhoneOff className="mr-2 h-4 w-4" />
            End
          </Button>
          
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/80 text-white px-6 h-12"
          >
            <Users className="mr-2 h-4 w-4" />
            Next
          </Button>
        </>
      )}
    </div>
  );
};

export default VideoControls;
