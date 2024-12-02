import React, { useEffect, useRef, useState } from 'react';
import { TelemetryData, SpeedPredictionData } from '../types';

interface SynchronizedVideoPlayerProps<T extends TelemetryData | SpeedPredictionData> {
  videoUrl: string;
  websocket: WebSocket | null;
  demoType: 'steering' | 'speed';
  onUpdate: (data: T) => void;
  isInitialized: boolean; // Now required, not optional
}

const SynchronizedVideoPlayer = <T extends TelemetryData | SpeedPredictionData>({ 
  videoUrl, 
  websocket,
  demoType,
  onUpdate,
  isInitialized,
}: SynchronizedVideoPlayerProps<T>) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [predictions, setPredictions] = useState<T[]>([]);
  const [currentPredictionIndex, setCurrentPredictionIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Reset state when video changes
  useEffect(() => {
    setPredictions([]);
    setCurrentPredictionIndex(0);
    setIsPlaying(false);
  }, [videoUrl]);

  // WebSocket message handling
  useEffect(() => {
    if (!websocket) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
        
      if (data.status === 'error') {
        console.error(`${demoType} demo error:`, data.message);
        return;
      }

      // Add prediction to our list
      if (data.status === 'streaming' || (data.status === 'initialized' && demoType === 'speed')) {
        setPredictions(prev => [...prev, data as T]);
      }
    };

    websocket.addEventListener('message', handleWebSocketMessage);

    return () => {
      websocket.removeEventListener('message', handleWebSocketMessage);
    };
  }, [websocket, demoType]);

  // Video time synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      if (!video || predictions.length === 0) return;

      const currentTime = video.currentTime;
      
      // Find the prediction that matches the current video time
      const newIndex = predictions.findIndex((pred, idx) => {
        const nextPred = predictions[idx + 1];
        const timestamp = 'timestamp' in pred ? pred.timestamp : 0;
        const nextTimestamp = nextPred && 'timestamp' in nextPred ? nextPred.timestamp : Infinity;
        return timestamp <= currentTime && nextTimestamp > currentTime;
      });

      // Fallback to last valid prediction if no exact match
      const fallbackIndex = predictions.reduce((closest, pred, index) => {
        const timestamp = 'timestamp' in pred ? pred.timestamp : 0;
        if (timestamp <= currentTime && 
            (closest === -1 || timestamp > ('timestamp' in predictions[closest] ? predictions[closest].timestamp : 0))) {
          return index;
        }
        return closest;
      }, -1);

      const finalIndex = newIndex !== -1 ? newIndex : fallbackIndex;

      if (finalIndex !== -1 && finalIndex !== currentPredictionIndex) {
        setCurrentPredictionIndex(finalIndex);
        onUpdate(predictions[finalIndex]);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [predictions, currentPredictionIndex, onUpdate]);

  // Playback control
  const handlePlayPause = () => {
    if (!isInitialized) return;
    
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
          disabled={!isInitialized}
          className={`px-4 py-2 rounded ${
            isInitialized 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-500 cursor-not-allowed'
          } text-white transition-colors`}
        >
          {!isInitialized 
            ? demoType === 'speed' ? 'Initializing...' : 'Processing...'
            : isPlaying 
              ? 'Pause' 
              : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default SynchronizedVideoPlayer;
