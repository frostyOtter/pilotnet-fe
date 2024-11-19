// types.ts

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
  // Steering demo state
  isDemoModalOpen: boolean;
  demoSteeringAngle: number;
  isStreamingDemo: boolean;
  demoWebSocket: WebSocket | null;
  steeringCachedPredictions: TelemetryData[];
  isSteeringPredictionCached: boolean;
  
  // Speed demo state
  isSpeedModalOpen: boolean;
  speedWebSocket: WebSocket | null;
  speedCachedPredictions: TelemetryData[];
  isSpeedPredictionCached: boolean;
}

export interface TelemetryData {
  // Common fields
  timestamp: number;
  status?: 'analyzing' | 'streaming' | 'complete' | 'error';

  // Steering specific fields
  angle?: number;
  ground_truth_angle?: number;

  // Speed specific fields
  velocity_kmh?: number;
  ground_truth_velocity?: number;
  confidence_lower_kmh?: number;
  confidence_upper_kmh?: number;
}

export interface SteeringDemoResponse {
  cached: boolean;
  predictions: TelemetryData[] | null;
  ws: WebSocket | null;
}

export interface SpeedDemoResponse {
  cached: boolean;
  predictions: TelemetryData[] | null;
  ws: WebSocket | null;
}

export interface WebSocketMessage {
  status: 'streaming' | 'complete' | 'error';
  message?: string;
  
  // Steering specific fields
  predicted_angle?: number;
  ground_truth_angle?: number;
  
  // Speed specific fields
  velocity_kmh?: number;
  ground_truth_velocity?: number;
  confidence_lower_kmh?: number;
  confidence_upper_kmh?: number;
  
  timestamp?: number;
}

export interface CacheCheckResponse {
  cached: boolean;
  predictions?: TelemetryData[];
}

export interface MediaDisplayProps {
  selectedVideoBlob: string | null;
  selectedImageBlob: string | null;
  randomVideoBlob: string | null;
  randomImageBlobs: string[];
  onSteeringDemo: () => void;
  onSpeedDemo: () => void;
}

export interface SpeedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaId: string | null;
  isVideo: boolean;
  websocket: WebSocket | null;
  isPredictionCached?: boolean;
  cachedPredictions?: TelemetryData[];
}

export interface SteeringDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaId: string | null;
  steeringAngle: number;
  isVideo: boolean;
  websocket: WebSocket | null;
  isPredictionCached?: boolean;
  cachedPredictions?: TelemetryData[];
}