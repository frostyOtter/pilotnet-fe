import React, { useEffect, useRef, useState } from 'react';
import { TelemetryData } from '../types';

interface SynchronizedVideoPlayerProps {
  videoUrl: string;
  websocket: WebSocket | null;
  onEnd: (predictions: TelemetryData[]) => void;
  isPredictionCached: boolean;
  cachedPredictions?: TelemetryData[];
  onAnglesUpdate: (predicted: number, groundTruth: number) => void;
}

interface Prediction {
  predictedAngle: number;
  groundTruthAngle: number;
  timestamp: number;
}

const SynchronizedVideoPlayer: React.FC<SynchronizedVideoPlayerProps> = ({ 
  videoUrl, 
  websocket,
  onEnd,
  isPredictionCached,
  cachedPredictions = [],
  onAnglesUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFirstFrameProcessed, setIsFirstFrameProcessed] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<Prediction[]>(
    cachedPredictions.map(pred => ({
      predictedAngle: pred.angle,
      groundTruthAngle: pred.ground_truth_angle || 0,
      timestamp: pred.timestamp
    }))
  );
  const [currentPredictionIndex, setCurrentPredictionIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (isPredictionCached && cachedPredictions.length > 0) {
      setPredictions(cachedPredictions.map(pred => ({
        predictedAngle: pred.angle,
        groundTruthAngle: pred.ground_truth_angle || 0,
        timestamp: pred.timestamp
      })));
      setIsFirstFrameProcessed(true);
    } else if (websocket) {
      websocket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        
        if (data.status === 'error') {
          console.error('Steering demo error:', data.message);
          return;
        }

        if (!isFirstFrameProcessed && data.status === 'streaming') {
          setIsFirstFrameProcessed(true);
          videoRef.current?.play();
        }
        
        if (data.status === 'streaming') {
          setPredictions(prev => [...prev, {
            predictedAngle: data.predicted_angle,
            groundTruthAngle: data.ground_truth_angle,
            timestamp: data.timestamp
          }]);
        }
      };
    }

    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket, isPredictionCached, cachedPredictions]);

  useEffect(() => {
    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      if (!video) return;
      
      const currentTime = video.currentTime;
      const newIndex = predictions.findIndex(
        (pred, idx) => {
          const nextPred = predictions[idx + 1];
          return pred.timestamp <= currentTime && 
                 (!nextPred || nextPred.timestamp > currentTime);
        }
      );
      
      if (newIndex !== -1) {
        setCurrentPredictionIndex(newIndex);
        const currentPrediction = predictions[newIndex];
        onAnglesUpdate(
          currentPrediction.predictedAngle,
          currentPrediction.groundTruthAngle
        );
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnd) {
        onEnd(predictions.map(pred => ({
          angle: pred.predictedAngle,
          ground_truth_angle: pred.groundTruthAngle,
          timestamp: pred.timestamp
        })));
      }
    };

    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('ended', handleEnded);
    
    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('ended', handleEnded);
    };
  }, [predictions, onEnd, onAnglesUpdate]);

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

  const currentPrediction = predictions[currentPredictionIndex];

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      <video 
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto"
        controls={false}
      />
      
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black bg-opacity-50 p-2 rounded">
        <button
          onClick={handlePlayPause}
          disabled={!isFirstFrameProcessed}
          className={`px-4 py-2 rounded ${
            isFirstFrameProcessed 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-500 cursor-not-allowed'
          } text-white`}
        >
          {!isFirstFrameProcessed 
            ? 'Processing...' 
            : isPlaying 
              ? 'Pause' 
              : 'Play'}
        </button>
        
        <div className="text-white space-x-4">
          <span>Predicted: {currentPrediction?.predictedAngle.toFixed(1)}°</span>
          <span>Ground Truth: {currentPrediction?.groundTruthAngle.toFixed(1)}°</span>
        </div>
      </div>
    </div>
  );
};

export default SynchronizedVideoPlayer;