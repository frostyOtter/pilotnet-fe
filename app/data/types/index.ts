// Basic Media Types
export interface MediaCounts {
  video_count: number;
  image_count: number;
}

export interface AvailableMedia extends MediaCounts {
  videos: string[];
  images: string[];
}

// API Response Types
export interface SingleMediaResponse {
  url: string;
  mediaId?: string;
  filename?: string;
}

export interface MultipleImagesResponse {
  paths: string[];
  blobs: string[];
}

// Component Props Types
export interface MediaControlPanelProps {
  availableMedia: MediaCounts;
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
  onSpeedDemo: () => void;
  onCombinationDemo: () => void;
}

// Demo Types
export interface TelemetryData {
  predicted_angle?: number;
  ground_truth_angle?: number;
  angle?: number;
  timestamp: number;
}

export interface SpeedPredictionData {
  velocity_kmh: number;
  ground_truth_velocity_kmh: number | null;
  confidence_lower_kmh: number;
  confidence_upper_kmh: number;
  iqr_kmh: number;
  frame_count: number;
}

export interface CombinationPredictionData {
  status: string;
  frame_count: number;
  timestamp: number;
  // Steering data
  predicted_angle: number;
  ground_truth_angle: number;
  // Velocity data
  velocity_kmh: number;
  ground_truth_velocity_kmh: number | null;
  confidence_lower_kmh: number;
  confidence_upper_kmh: number;
  iqr_kmh: number;
}