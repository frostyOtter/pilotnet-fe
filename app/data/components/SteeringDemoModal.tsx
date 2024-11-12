import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import SynchronizedVideoPlayer from './SynchronizedVideoPlayer';
import { TelemetryData } from '../types';

interface SteeringDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaId: string | null;
  steeringAngle: number;
  isVideo: boolean;
  websocket: WebSocket | null;
}

export const SteeringDemoModal: React.FC<SteeringDemoModalProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  mediaId,
  steeringAngle,
  isVideo,
  websocket
}) => {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [status, setStatus] = useState<'analyzing' | 'streaming' | 'complete' | 'error'>('analyzing');
  const [cachedPredictions, setCachedPredictions] = useState<TelemetryData[]>([]);
  const [isPredictionCached, setIsPredictionCached] = useState(false);

  useEffect(() => {
    if (isVideo && mediaId) {
      checkPredictionsCache();
    }
  }, [mediaId, isVideo]);

  useEffect(() => {
    if (!isVideo) {
      setCurrentAngle(steeringAngle);
      setStatus('complete');
    }
  }, [isVideo, steeringAngle]);

  const checkPredictionsCache = async () => {
    try {
      const response = await fetch(`/api/py/demo/check-cache/${mediaId}`);
      const data = await response.json();
      
      if (data.cached) {
        setIsPredictionCached(true);
        setCachedPredictions(data.predictions);
        setStatus('complete');
      } else {
        setIsPredictionCached(false);
        setCachedPredictions([]);
      }
    } catch (error) {
      console.error('Error checking predictions cache:', error);
      setIsPredictionCached(false);
    }
  };

  const handleVideoEnd = (predictions: TelemetryData[]) => {
    setStatus('complete');
  };

  const handleAngleChange = (angle: number) => {
    setCurrentAngle(angle);
  };

  if (!mediaUrl) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'visible' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Media Display */}
          <div>
            {isVideo ? (
              <SynchronizedVideoPlayer
                videoUrl={mediaUrl}
                websocket={websocket}
                onEnd={handleVideoEnd}
                isPredictionCached={isPredictionCached}
                cachedPredictions={cachedPredictions}
                onAngleChange={handleAngleChange}
              />
            ) : (
              <div className="relative rounded-lg overflow-hidden bg-black">
                <img 
                  src={mediaUrl} 
                  alt="Demo media" 
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Steering Wheel and Telemetry */}
          <div className="flex flex-col items-center space-y-6">
            {/* Steering Wheel with dynamic rotation */}
            <div className="relative w-64 h-64">
              <div 
                className="relative w-full h-full transition-transform duration-150 ease-out"
                style={{ transform: `rotate(${currentAngle}deg)` }}
              >
                <Image
                  src="/steering_wheel_image.jpg"
                  alt="Steering Wheel"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>

            {/* Telemetry Display */}
            <div className="w-full space-y-4">
              {/* Steering Angle */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Steering Angle</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {currentAngle.toFixed(1)}°
                </p>
              </div>

              {/* Status */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Status</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'streaming' ? 'bg-green-500 animate-pulse' :
                    status === 'complete' ? 'bg-blue-500' :
                    status === 'error' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  <span className="capitalize">
                    {isPredictionCached ? 'Using cached predictions' : status}
                  </span>
                </div>
              </div>

              {/* Processing Info */}
              {isVideo && (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Processing Info</h3>
                  <div className="space-y-2">
                    <p>Source: {isPredictionCached ? 'Cache' : 'Real-time'}</p>
                    {status === 'streaming' && !isPredictionCached && (
                      <p>Processing frames in real-time...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SteeringDemoModal;