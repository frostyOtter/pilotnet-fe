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

export const startSteeringDemo = async (
  mediaId: string, 
  isVideo: boolean, 
) => {
  try {
    if (isVideo) {
      // For videos, we'll use WebSocket for real-time updates
      const ws = new WebSocket('ws://localhost:8000/api/demo/ws/steering');
      
      ws.onopen = () => {
        ws.send(JSON.stringify({
          video_id: mediaId,
        }));
      };

      return { ws };
    } else {
      // For images, we'll use REST API
      const endpoint = `/api/py/demo/evaluate-image/${mediaId}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start steering demo');
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error in steering demo:', error);
    throw error;
  }
};