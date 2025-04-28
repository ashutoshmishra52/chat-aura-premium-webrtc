
import { toast } from '@/components/ui/use-toast';

interface PeerConnection {
  pc: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
}

class WebRTCService {
  private localStream: MediaStream | null = null;
  private peerConnection: PeerConnection | null = null;
  private remoteVideoRef: HTMLVideoElement | null = null;
  private localVideoRef: HTMLVideoElement | null = null;
  private signallingServer: WebSocket | null = null;
  private roomId: string | null = null;
  private isConnected: boolean = false;
  private isInitiator: boolean = false;
  
  private configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  constructor() {
    // For demo purposes, we'll use a mock signaling mechanism
    // In a real app, this would connect to a WebSocket server
    this.mockSignalingServer();
  }

  public async initialize(
    localVideoRef: HTMLVideoElement, 
    remoteVideoRef: HTMLVideoElement
  ): Promise<boolean> {
    this.localVideoRef = localVideoRef;
    this.remoteVideoRef = remoteVideoRef;
    
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (this.localVideoRef) {
        this.localVideoRef.srcObject = this.localStream;
      }
      
      return true;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Camera Access Error",
        description: "Please allow camera and microphone access to use this app.",
        variant: "destructive"
      });
      return false;
    }
  }

  public async connectToRandomUser(): Promise<void> {
    // Disconnect from any existing call
    this.disconnect();
    
    // In a real app, we would connect to a signaling server
    // that would match us with a random user
    this.isInitiator = Math.random() > 0.5;
    this.roomId = this.generateRandomRoomId();
    
    // Create a new peer connection
    this.createPeerConnection();
    
    // For demo purposes, we'll simulate finding a random user
    if (this.isInitiator) {
      setTimeout(() => {
        this.createOffer();
      }, 1000);
    } else {
      // In a real app, we would wait for an offer from the signaling server
      setTimeout(() => {
        this.simulateIncomingOffer();
      }, 1000);
    }
  }

  public toggleVideo(): boolean {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  }

  public toggleAudio(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  public disconnect(): void {
    if (this.peerConnection) {
      if (this.peerConnection.pc) {
        this.peerConnection.pc.close();
      }
      this.peerConnection = null;
    }
    
    if (this.remoteVideoRef) {
      this.remoteVideoRef.srcObject = null;
    }
    
    this.isConnected = false;
    this.roomId = null;
    
    // In a real app, we would send a disconnect message to the signaling server
  }

  public cleanup(): void {
    this.disconnect();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.localVideoRef) {
      this.localVideoRef.srcObject = null;
    }
    
    if (this.signallingServer) {
      this.signallingServer.close();
      this.signallingServer = null;
    }
  }

  private createPeerConnection(): void {
    try {
      const pc = new RTCPeerConnection(this.configuration);
      
      pc.onicecandidate = this.handleICECandidate.bind(this);
      pc.ontrack = this.handleTrackEvent.bind(this);
      pc.oniceconnectionstatechange = this.handleICEConnectionStateChange.bind(this);
      
      // Add local stream tracks to the connection
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          if (this.localStream) {
            pc.addTrack(track, this.localStream);
          }
        });
      }
      
      // Create data channel for messaging
      if (this.isInitiator) {
        const dataChannel = pc.createDataChannel('chat');
        this.setupDataChannel(dataChannel);
      } else {
        pc.ondatachannel = (event) => {
          this.setupDataChannel(event.channel);
        };
      }
      
      this.peerConnection = { pc };
    } catch (error) {
      console.error('Error creating peer connection:', error);
      toast({
        title: "Connection Error",
        description: "Failed to create peer connection. Please try again.",
        variant: "destructive"
      });
    }
  }

  private async createOffer(): Promise<void> {
    if (!this.peerConnection) return;
    
    try {
      const offer = await this.peerConnection.pc.createOffer();
      await this.peerConnection.pc.setLocalDescription(offer);
      
      // In a real app, we would send this offer to the signaling server
      this.mockSendSignalingMessage({ 
        type: 'offer', 
        sdp: offer.sdp,
        roomId: this.roomId
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  private async handleOfferReceived(offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      this.createPeerConnection();
    }
    
    if (!this.peerConnection) return;
    
    try {
      await this.peerConnection.pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.pc.createAnswer();
      await this.peerConnection.pc.setLocalDescription(answer);
      
      // In a real app, we would send this answer to the signaling server
      this.mockSendSignalingMessage({
        type: 'answer',
        sdp: answer.sdp,
        roomId: this.roomId
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  private async handleAnswerReceived(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) return;
    
    try {
      await this.peerConnection.pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  private async handleICECandidate(event: RTCPeerConnectionIceEvent): Promise<void> {
    if (event.candidate) {
      // In a real app, we would send this candidate to the signaling server
      this.mockSendSignalingMessage({
        type: 'candidate',
        candidate: event.candidate.toJSON(),
        roomId: this.roomId
      });
    }
  }

  private async handleNewICECandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) return;
    
    try {
      await this.peerConnection.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding received ice candidate:', error);
    }
  }

  private handleTrackEvent(event: RTCTrackEvent): void {
    if (this.remoteVideoRef && event.streams && event.streams[0]) {
      this.remoteVideoRef.srcObject = event.streams[0];
      this.isConnected = true;
      console.log('Connected to remote peer');
    }
  }

  private handleICEConnectionStateChange(): void {
    if (!this.peerConnection) return;
    
    console.log('ICE connection state:', this.peerConnection.pc.iceConnectionState);
    
    if (this.peerConnection.pc.iceConnectionState === 'disconnected' || 
        this.peerConnection.pc.iceConnectionState === 'failed' ||
        this.peerConnection.pc.iceConnectionState === 'closed') {
      this.isConnected = false;
    }
  }

  private setupDataChannel(dataChannel: RTCDataChannel): void {
    if (!this.peerConnection) return;
    
    dataChannel.onmessage = (event) => {
      console.log('Received message:', event.data);
      // Handle messages here
    };
    
    dataChannel.onopen = () => {
      console.log('Data channel is open');
    };
    
    dataChannel.onclose = () => {
      console.log('Data channel is closed');
    };
    
    this.peerConnection.dataChannel = dataChannel;
  }

  private generateRandomRoomId(): string {
    return Math.random().toString(36).substring(2, 12);
  }

  // Mock signaling server methods - in a real app, these would interact with a WebSocket server
  private mockSignalingServer(): void {
    // Simulate WebSocket connection
    this.signallingServer = {} as WebSocket;
    console.log('Connected to mock signaling server');
  }

  private mockSendSignalingMessage(message: any): void {
    console.log('Mock sending signaling message:', message);
    
    // For demo, we'll simulate receiving answers to our offers
    if (message.type === 'offer') {
      setTimeout(() => {
        this.handleSignalingMessage({
          type: 'answer',
          sdp: 'mock answer sdp',
          roomId: this.roomId
        });
      }, 1000);
    }
  }

  private handleSignalingMessage(message: any): void {
    if (!message) return;
    
    switch (message.type) {
      case 'offer':
        this.handleOfferReceived({
          type: message.type,
          sdp: message.sdp
        });
        break;
      case 'answer':
        this.handleAnswerReceived({
          type: message.type,
          sdp: message.sdp
        });
        break;
      case 'candidate':
        this.handleNewICECandidate(message.candidate);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }
  
  // For demo purposes only - simulates receiving an offer
  private simulateIncomingOffer(): void {
    setTimeout(() => {
      this.handleSignalingMessage({
        type: 'offer',
        sdp: 'mock offer sdp',
        roomId: this.roomId
      });
    }, 1000);
  }
}

// Create a singleton instance
const webRTCService = new WebRTCService();

export default webRTCService;
