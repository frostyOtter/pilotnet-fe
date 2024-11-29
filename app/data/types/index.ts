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

export interface ApiResponse {
  url: string;
  mediaId?: string;
  filename?: string;
  paths?: string[];
  blobs?: string[];
}

export interface DemoState {
  isDemoModalOpen: boolean;
  demoSteeringAngle: number;
  isStreamingDemo: boolean;
  demoWebSocket: WebSocket | null;
  cachedPredictions: TelemetryData[];
  isPredictionCached: boolean;
  // New speed demo state
  isSpeedDemoModalOpen: boolean;
  speedDemoWebSocket: WebSocket | null;
  isStreamingSpeedDemo: boolean;
  currentSpeedPrediction: SpeedPredictionData | null;
}

export interface SteeringDemoResponse {
  cached: boolean;
  predictions: TelemetryData[] | null;
  ws: WebSocket | null;
}

export interface SteeringDemoResult {
  status: string;
  results: {
    steering_angle: number;
    [key: string]: any;
  };
}

export interface MediaControlPanelProps {
  availableMedia: {
    video_count: number;
    image_count: number;
  };
  onGetRandomVideo: () => void;
  onGetRandomImages: () => void;
  mediaId: string;
  onMediaIdChange: (id: string) => void;
  onGetVideoById: () => void;
  onGetImageById: () => void;
}

export interface MediaDisplayProps {
  selectedVideoBlob: string | null;
  selectedImageBlob: string | null;
  randomVideoBlob: string | null;
  randomImageBlobs: string[];
  onSteeringDemo: () => void;
}

export interface SteeringDemoButtonProps {
  onClick: () => void;
}

export interface SynchronizedVideoPlayerProps {
  videoUrl: string;
  websocket: WebSocket | null;
  onEnd: (predictions: TelemetryData[]) => void;
  isPredictionCached: boolean;
  cachedPredictions?: TelemetryData[];
}

export interface TelemetryData {
  predicted_angle?: number;  // From WebSocket for steering
  ground_truth_angle?: number;  // From WebSocket for steering
  angle?: number;  // From cached predictions
  timestamp: number;
  status?: 'analyzing' | 'streaming' | 'complete' | 'error';
  message?: string;
}
// export interface TelemetryData {
//   angle: number;
//   ground_truth_angle?: number;  // Added ground truth angle
//   timestamp: number;
//   status?: 'analyzing' | 'streaming' | 'complete' | 'error';
// }

export interface CacheCheckResponse {
  cached: boolean;
  predictions?: TelemetryData[];
}

export interface SpeedPredictionData {
  velocity_kmh: number;
  ground_truth_velocity_kmh: number | null;
  confidence_lower_kmh: number;
  confidence_upper_kmh: number;
  iqr_kmh: number;
  frame_count: number;
  status?: 'streaming' | 'complete' | 'error';
  message?: string;
}

export interface SpeedDemoResponse {
  cached: boolean;
  predictions: SpeedPredictionData[] | null;
  ws: WebSocket | null;
}

export interface SpeedWebSocketMessage {
  status: 'streaming' | 'complete' | 'error';
  velocity_kmh?: number;
  ground_truth_velocity_kmh?: number | null;
  confidence_lower_kmh?: number;
  confidence_upper_kmh?: number;
  iqr_kmh?: number;
  frame_count?: number;
  message?: string;
}