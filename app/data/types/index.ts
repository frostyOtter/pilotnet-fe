export interface MediaState {
    availableMedia: {
      videos: string[];
      images: string[];
      video_count: number;
      image_count: number;
    };
    randomVideoBlob: string | null;
    randomImageBlobs: string[];
    mediaId: string;
    selectedVideoBlob: string | null;
    selectedImageBlob: string | null;
    currentMediaId: string | null;
  }
  
  export interface DemoState {
    isDemoModalOpen: boolean;
    demoSteeringAngle: number;
    isStreamingDemo: boolean;
    ws: WebSocket | null;
  }
  
  export interface ApiResponse {
    url: string;
    mediaId?: string;
    filename?: string;
    paths?: string[];
    blobs?: string[];
  }
  
  export interface SteeringDemoResult {
    status: string;
    results: {
      steering_angle: number;
      [key: string]: any;
    };
  }

  export interface SteeringDemoModalProps {
    isOpen: boolean;
    onClose: () => void;
    mediaUrl: string | null;
    steeringAngle: number;
    isVideo: boolean;
  }
  
  export interface TelemetryData {
    angle: number;
    timestamp: number;
    status: 'analyzing' | 'streaming' | 'complete' | 'error';
    confidence?: number;
  }