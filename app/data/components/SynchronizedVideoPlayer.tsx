import React, { useEffect, useRef, useState } from 'react';
import { TelemetryData } from '../types';

interface SynchronizedVideoPlayerProps {
  videoUrl: string;
  websocket: WebSocket | null;
  onEnd?: (predictions: TelemetryData[]) => void;
  onSpeedUpdate?: (data: any) => void;
  onAnglesUpdate?: (predicted: number, groundTruth: number) => void;
  type: 'steering' | 'speed';
  isPredictionCached?: boolean;
  cachedPredictions?: TelemetryData[];
}

interface Prediction {
  predictedValue: number;
  groundTruthValue: number;
  timestamp: number;
  confidenceLower?: number;
  confidenceUpper?: number;
}

const SynchronizedVideoPlayer: React.FC<SynchronizedVideoPlayerProps> = ({ 
  videoUrl, 
  websocket,
  onEnd,
  onSpeedUpdate,
  onAnglesUpdate,
  type,
  isPredictionCached = false,
  cachedPredictions = []
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFirstFrameProcessed, setIsFirstFrameProcessed] = useState<boolean>(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [currentPredictionIndex, setCurrentPredictionIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        
        if (data.status === 'error') {
          console.error(`${type} demo error:`, data.message);
          return;
        }

        if (!isFirstFrameProcessed && data.status === 'streaming') {
          setIsFirstFrameProcessed(true);
          videoRef.current?.play();
        }
        
        if (data.status === 'streaming') {
          if (type === 'steering') {
            setPredictions(prev => [...prev, {
              predictedValue: data.predicted_angle || 0,
              groundTruthValue: data.ground_truth_angle || 0,
              timestamp: data.timestamp
            }]);
            if (onAnglesUpdate) {
              onAnglesUpdate(data.predicted_angle || 0, data.ground_truth_angle || 0);
            }
          } else {
            setPredictions(prev => [...prev, {
              predictedValue: data.velocity_kmh || 0,
              groundTruthValue: data.ground_truth_velocity || 0,
              timestamp: data.timestamp,
              confidenceLower: data.confidence_lower_kmh,
              confidenceUpper: data.confidence_upper_kmh
            }]);
            if (onSpeedUpdate) {
              onSpeedUpdate(data);
            }
          }
        }
      };
    }

    return () => {
      if (websocket) {
        websocket.onmessage = null;
      }
    };
  }, [websocket, type]);

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
        if (type === 'steering' && onAnglesUpdate) {
          onAnglesUpdate(
            currentPrediction.predictedValue,
            currentPrediction.groundTruthValue
          );
        } else if (type === 'speed' && onSpeedUpdate) {
          onSpeedUpdate({
            velocity_kmh: currentPrediction.predictedValue,
            confidence_lower_kmh: currentPrediction.confidenceLower,
            confidence_upper_kmh: currentPrediction.confidenceUpper,
            ground_truth_velocity: currentPrediction.groundTruthValue
          });
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnd) {
        const telemetryData: TelemetryData[] = predictions.map(pred => ({
          ...(type === 'steering' ? {
            angle: pred.predictedValue,
            ground_truth_angle: pred.groundTruthValue,
          } : {
            velocity_kmh: pred.predictedValue,
            ground_truth_velocity: pred.groundTruthValue,
            confidence_lower_kmh: pred.confidenceLower,
            confidence_upper_kmh: pred.confidenceUpper,
          }),
          timestamp: pred.timestamp
        }));
        onEnd(telemetryData);
      }
    };

    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('ended', handleEnded);
    
    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate);
      video?.removeEventListener('ended', handleEnded);
    };
  }, [predictions, type, onEnd, onAnglesUpdate, onSpeedUpdate]);

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
          <span>
            {type === 'steering' ? 'Predicted Angle' : 'Predicted Speed'}: 
            {currentPrediction?.predictedValue.toFixed(1)}
            {type === 'steering' ? '°' : ' km/h'}
          </span>
          <span>
            {type === 'steering' ? 'Ground Truth Angle' : 'Ground Truth Speed'}: 
            {currentPrediction?.groundTruthValue.toFixed(1)}
            {type === 'steering' ? '°' : ' km/h'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SynchronizedVideoPlayer;