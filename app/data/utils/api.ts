// utils/api.ts
import { CacheCheckResponse, SteeringDemoResponse, TelemetryData } from '../types';

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