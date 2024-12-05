import { useState } from 'react';

interface MediaCounts {
  video_count: number;
  image_count: number;
}

export const useMediaState = () => {
  // Available media info
  const [availableMedia, setAvailableMedia] = useState<MediaCounts>({
    video_count: 0,
    image_count: 0
  });

  // Media selection state
  const [mediaId, setMediaId] = useState('');
  const [currentMediaId, setCurrentMediaId] = useState<string | null>(null);
  
  // Video state
  const [selectedVideoBlob, setSelectedVideoBlob] = useState<string | null>(null);
  const [randomVideoBlob, setRandomVideoBlob] = useState<string | null>(null);
  
  // Image state
  const [selectedImageBlob, setSelectedImageBlob] = useState<string | null>(null);
  const [randomImageBlobs, setRandomImageBlobs] = useState<string[]>([]);

  return {
    // Available media
    availableMedia,
    setAvailableMedia,
    
    // Media selection
    mediaId,
    setMediaId,
    currentMediaId,
    setCurrentMediaId,
    
    // Video state
    selectedVideoBlob,
    setSelectedVideoBlob,
    randomVideoBlob,
    setRandomVideoBlob,
    
    // Image state
    selectedImageBlob,
    setSelectedImageBlob,
    randomImageBlobs,
    setRandomImageBlobs,
  };
};