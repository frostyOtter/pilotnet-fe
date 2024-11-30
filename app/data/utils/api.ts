import { 
  AvailableMedia, 
  SingleMediaResponse, 
  MultipleImagesResponse, 
  TelemetryData, 
  SpeedPredictionData 
} from '../types';

const API_BASE = '/api/py';

export const fetchAvailableMedia = async (): Promise<AvailableMedia> => {
  try {
    const response = await fetch(`${API_BASE}/data/available-media`);
    if (!response.ok) throw new Error('Failed to fetch available media');
    return response.json();
  } catch (error) {
    console.error('Error fetching media data:', error);
    throw error;
  }
};

export const fetchRandomVideo = async (): Promise<SingleMediaResponse> => {
  try {
    const response = await fetch(`${API_BASE}/data/random-video`);
    if (!response.ok) throw new Error('Failed to fetch random video');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const filename = response.headers.get('content-disposition')?.split('filename=')[1] || 'random';
    return { url, filename };
  } catch (error) {
    console.error('Error fetching random video:', error);
    throw error;
  }
};

export const fetchRandomImages = async (): Promise<MultipleImagesResponse> => {
  try {
    const response = await fetch(`${API_BASE}/data/random-images`);
    if (!response.ok) throw new Error('Failed to fetch random images');
    const data = await response.json();
    
    const imageBlobs = await Promise.all(
      data.image_paths.map(async (path: string) => {
        const imageResponse = await fetch(`${API_BASE}/data/image/${path}`);
        if (!imageResponse.ok) throw new Error('Failed to fetch image');
        const blob = await imageResponse.blob();
        return URL.createObjectURL(blob);
      })
    );

    return { blobs: imageBlobs, paths: data.image_paths };
  } catch (error) {
    console.error('Error fetching random images:', error);
    throw error;
  }
};

export const fetchMediaById = async (mediaId: string, type: 'video' | 'image'): Promise<SingleMediaResponse> => {
  try {
    const response = await fetch(`${API_BASE}/data/${type}/${mediaId}`);
    if (!response.ok) throw new Error(`Failed to fetch ${type}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { url, mediaId };
  } catch (error) {
    console.error(`Error fetching ${type} by ID:`, error);
    throw error;
  }
};

interface DemoResponse<T> {
  ws: WebSocket | null;
  prediction: T | null;
}

export const startSteeringDemo = async (
  mediaId: string,
  isVideo: boolean
): Promise<DemoResponse<TelemetryData>> => {
  try {
    if (!isVideo) {
      const response = await fetch(`${API_BASE}/demo/evaluate-image/${mediaId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to evaluate image');
      const data = await response.json();
      return {
        ws: null,
        prediction: {
          angle: data.results.steering_angle,
          timestamp: 0
        }
      };
    }

    // Create WebSocket with error handling
    const ws = new WebSocket(`ws://localhost:8000/api/demo/ws/steering`);

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('WebSocket connection timeout'));
      }, 5000);

      ws.onopen = () => {
        clearTimeout(timeout);
        console.log('WebSocket connection established');
        ws.send(JSON.stringify({ video_id: mediaId }));
        resolve({ ws, prediction: null });
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error('WebSocket error:', error);
        reject(error);
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        console.log('WebSocket closed:', event.code, event.reason);
        if (event.code !== 1000) {
          reject(new Error(`WebSocket closed abnormally: ${event.code}`));
        }
      };
    });

  } catch (error) {
    console.error('Error in steering demo:', error);
    throw error;
  }
};

export const startSpeedDemo = async (
  mediaId: string,
  isVideo: boolean
): Promise<DemoResponse<SpeedPredictionData>> => {
  try {
    if (!isVideo) {
      throw new Error('Speed demo is only available for videos');
    }

    const ws = new WebSocket(`ws://localhost:8000/api/demo/ws/speed`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ video_id: mediaId }));
    };

    return { ws, prediction: null };
  } catch (error) {
    console.error('Error in speed demo:', error);
    throw error;
  }
};