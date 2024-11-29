// utils/api.ts
import { CacheCheckResponse, SteeringDemoResponse, TelemetryData, SpeedDemoResponse, SpeedPredictionData } from '../types';
export const fetchAvailableMedia = async () => {
  try {
    const response = await fetch('/api/py/data/available-media');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching media data:', error);
    throw error;
  }
};

export const fetchRandomVideo = async () => {
  try {
    const response = await fetch('/api/py/data/random-video');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const filename = response.headers.get('content-disposition')?.split('filename=')[1] || 'random';
    return { url, filename };
  } catch (error) {
    console.error('Error fetching random video:', error);
    throw error;
  }
};

export const fetchRandomImages = async () => {
  try {
    const response = await fetch('/api/py/data/random-images');
    const data = await response.json();
    const imageBlobs = await Promise.all(
      data.image_paths.map(async (path: string) => {
        const imageResponse = await fetch(`/api/py/data/image/${path}`);
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

export const fetchMediaById = async (mediaId: string, type: 'video' | 'image') => {
  try {
    const response = await fetch(`/api/py/data/${type}/${mediaId}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return { url, mediaId };
  } catch (error) {
    console.error(`Error fetching ${type} by ID:`, error);
    throw error;
  }
};

export const checkPredictionCache = async (videoId: string): Promise<CacheCheckResponse> => {
  try {
    const response = await fetch(`/api/py/demo/check-cache/${videoId}`);
    if (!response.ok) {
      throw new Error('Failed to check prediction cache');
    }
    return await response.json();
  } catch (error) {
    console.error('Error checking prediction cache:', error);
    return { cached: false };
  }
};

export const startSteeringDemo = async (
  mediaId: string, 
  isVideo: boolean,
): Promise<SteeringDemoResponse> => {
  try {
    if (isVideo) {
      // First check if we have cached predictions
      const cacheCheck = await checkPredictionCache(mediaId);
      
      if (cacheCheck.cached && cacheCheck.predictions) {
        return { 
          cached: true,
          predictions: cacheCheck.predictions,
          ws: null
        };
      }

      // If no cache, start WebSocket connection for real-time processing
      const ws = new WebSocket(`ws://localhost:8000/api/demo/ws/steering`);
      
      ws.onopen = () => {
        ws.send(JSON.stringify({
          video_id: mediaId,
        }));
      };

      return { 
        cached: false,
        predictions: null,
        ws 
      };
    } else {
      // For images, use REST API
      const response = await fetch(`/api/py/demo/evaluate-image/${mediaId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start steering demo');
      }

      const result = await response.json();
      return {
        cached: false,
        predictions: [{
          angle: result.results.steering_angle,
          timestamp: 0,
          status: 'complete'
        }],
        ws: null
      };
    }
  } catch (error) {
    console.error('Error in steering demo:', error);
    throw error;
  }
};


// export const checkSpeedFrames = async (videoId: string) => {
//   try {
//     const response = await fetch(`/api/py/demo/check-frames/${videoId}`);
//     if (!response.ok) {
//       throw new Error('Failed to check video frames');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error checking video frames:', error);
//     throw error;
//   }
// };


export const startSpeedDemo = async (
  mediaId: string,
  isVideo: boolean,
): Promise<SpeedDemoResponse> => {
  try {
    if (!isVideo) {
      throw new Error('Speed demo is only available for videos');
    }

    // Create WebSocket connection
    const ws = new WebSocket(`ws://localhost:8000/api/demo/ws/speed`);
    
    // Set up initial connection
    ws.onopen = () => {
      ws.send(JSON.stringify({
        video_id: mediaId,
      }));
    };

    return {
      cached: false,
      predictions: null,
      ws
    };

  } catch (error) {
    console.error('Error in speed demo:', error);
    throw error;
  }
};

// Function to handle speed prediction for image sequences (if needed)
export const predictSpeedFromImages = async (files: File[]): Promise<SpeedPredictionData> => {
  try {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    const response = await fetch('/api/py/demo/predict-speed', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to predict speed from images');
    }

    const data = await response.json();
    return {
      velocity_kmh: data.velocity_kmh,
      ground_truth_velocity_kmh: null, // No ground truth for uploaded images
      confidence_lower_kmh: data.lower_bound_kmh,
      confidence_upper_kmh: data.upper_bound_kmh,
      iqr_kmh: data.iqr_kmh,
      frame_count: files.length,
      status: 'complete'
    };
  } catch (error) {
    console.error('Error predicting speed from images:', error);
    throw error;
  }
};
