import { useState } from 'react';
import { MediaState } from '../types';

export const useMediaState = () => {
  const [availableMedia, setAvailableMedia] = useState<MediaState['availableMedia']>({
    videos: [],
    images: [], 
    video_count: 0,
    image_count: 0
  });
  const [randomVideoBlob, setRandomVideoBlob] = useState<string | null>(null);
  const [randomImageBlobs, setRandomImageBlobs] = useState<string[]>([]);
  const [mediaId, setMediaId] = useState('');
  const [selectedVideoBlob, setSelectedVideoBlob] = useState<string | null>(null);
  const [selectedImageBlob, setSelectedImageBlob] = useState<string | null>(null);
  const [currentMediaId, setCurrentMediaId] = useState<string | null>(null);

  return {
    availableMedia,
    setAvailableMedia,
    randomVideoBlob,
    setRandomVideoBlob,
    randomImageBlobs,
    setRandomImageBlobs,
    mediaId,
    setMediaId,
    selectedVideoBlob,
    setSelectedVideoBlob,
    selectedImageBlob,
    setSelectedImageBlob,
    currentMediaId,
    setCurrentMediaId,
  };
};