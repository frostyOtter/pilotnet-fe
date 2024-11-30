import React, { useEffect, useRef, useState } from 'react';
import { TelemetryData, SpeedPredictionData } from '../types';

interface SynchronizedVideoPlayerProps {
  videoUrl: string;
  websocket: WebSocket | null;
  demoType: 'steering' | 'speed';
  onUpdate: (data: TelemetryData | SpeedPredictionData) => void;
}

const SynchronizedVideoPlayer = ({ 
  videoUrl, 
  websocket,
  demoType,
  onUpdate
}: SynchronizedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    if (!websocket) return;

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.status === 'error') {
        console.error(`${demoType} demo error:`, data.message);
        return;
      }

      // Start video once we receive the first streaming data
      if (!isWsReady && data.status === 'streaming') {
        setIsWsReady(true);
        if (!isPlaying && videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }
      
      if (data.status === 'streaming') {
        setPredictions(prev => [...prev, data]);
        onUpdate(data);
      }
    };

    return () => {
      websocket.close();
    };
  }, [websocket, demoType, isPlaying, isWsReady, onUpdate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const currentFrame = Math.floor(currentTime * 30); // Assuming 30fps

      // Find the matching prediction
      const matchingPrediction = predictions.find(pred => {
        if (demoType === 'speed') {
          // For speed demo, predictions come every 3 frames
          const predictionFrame = Math.floor(pred.frame_count / 3) * 3;
          return predictionFrame === Math.floor(currentFrame / 3) * 3;
        } else {
          // For steering demo, match by timestamp
          return pred.timestamp <= currentTime && 
                 (!predictions[predictions.indexOf(pred) + 1] || 
                  predictions[predictions.indexOf(pred) + 1].timestamp > currentTime);
        }
      });

      if (matchingPrediction) {
        onUpdate(matchingPrediction);
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
  }, [predictions, onUpdate, demoType]);

  const handlePlayPause = () => {
    if (!isWsReady || !videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
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
          className={`px-4 py-2 rounded ${
            isWsReady 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-500 cursor-not-allowed'
          } text-white transition-colors`}
        >
          {!isWsReady 
            ? 'Initializing...' 
            : isPlaying 
              ? 'Pause' 
              : 'Play'
          }
        </button>
      </div>
    </div>
  );
};

export default SynchronizedVideoPlayer;