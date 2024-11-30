import React, { useEffect, useRef, useState } from 'react';
import { TelemetryData, SpeedPredictionData } from '../types';

interface SynchronizedVideoPlayerProps<T extends TelemetryData | SpeedPredictionData> {
  videoUrl: string;
  websocket: WebSocket | null;
  demoType: 'steering' | 'speed';
  onUpdate: (data: T) => void;
}

const SynchronizedVideoPlayer = <T extends TelemetryData | SpeedPredictionData>({ 
  videoUrl, 
  websocket,
  demoType,
  onUpdate
}: SynchronizedVideoPlayerProps<T>) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFirstFrameProcessed, setIsFirstFrameProcessed] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<T[]>([]);
  const [currentPredictionIndex, setCurrentPredictionIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        
        if (data.status === 'error') {
          console.error(`${demoType} demo error:`, data.message);
          return;
        }

        if (!isFirstFrameProcessed && data.status === 'streaming') {
          setIsFirstFrameProcessed(true);
          videoRef.current?.play();
        }
        
        if (data.status === 'streaming') {
          setPredictions(prev => [...prev, data as T]);
        }
      };
    }

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket, demoType]);

  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (!video) return;

      const currentTime = video.currentTime;
      let newIndex: number;

      if (demoType === 'speed') {
        // For speed demo, find prediction based on frame count
        // Assuming 30fps video and predictions every 3 frames
        const currentFrame = Math.floor(currentTime * 30);
        const predictionFrame = Math.floor(currentFrame / 3) * 3;
        newIndex = predictions.findIndex(pred => 
          (pred as SpeedPredictionData).frame_count === predictionFrame);
      } else {
        // For steering demo, find prediction based on timestamp
        newIndex = predictions.findIndex(
          (pred, idx) => {
            const nextPred = predictions[idx + 1];
            const timestamp = (pred as TelemetryData).timestamp;
            const nextTimestamp = nextPred ? (nextPred as TelemetryData).timestamp : Infinity;
            return timestamp <= currentTime && nextTimestamp > currentTime;
          }
        );
      }
      
      if (newIndex !== -1 && newIndex !== currentPredictionIndex) {
        setCurrentPredictionIndex(newIndex);
        onUpdate(predictions[newIndex]);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('ended', handleEnded);
    
    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('ended', handleEnded);
    };
  }, [predictions, currentPredictionIndex, onUpdate, demoType]);

  const handlePlayPause = () => {
    if (!isFirstFrameProcessed) return;
    
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      <video 
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto"
        controls={false}
      />
      
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <button
          onClick={handlePlayPause}
          disabled={!isFirstFrameProcessed}
          className={`px-4 py-2 rounded ${
            isFirstFrameProcessed 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-500 cursor-not-allowed'
          } text-white transition-colors`}
        >
          {!isFirstFrameProcessed 
            ? 'Processing...' 
            : isPlaying 
              ? 'Pause' 
              : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default SynchronizedVideoPlayer;