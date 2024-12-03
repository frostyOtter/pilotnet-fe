import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SynchronizedVideoPlayer from './SynchronizedVideoPlayer';
import { TelemetryData } from '../types';

interface SteeringDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaId: string | null;
  isVideo: boolean;
  websocket: WebSocket | null;
}

const SteeringWheel = ({ angle, label }: { angle: number; label: string }) => (
  <div className="flex flex-col items-center space-y-2">
    <h3 className="text-lg font-semibold">{label}</h3>
    <div className="relative w-40 h-40">
      <div 
        className="relative w-full h-full transition-transform duration-150 ease-out"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <Image
          src="/steering_wheel_image.jpg"
          alt={`${label} Steering Wheel`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </div>
    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
      {angle.toFixed(1)}°
    </div>
  </div>
);

const SteeringDemoModal = ({
  isOpen,
  onClose,
  mediaUrl,
  isVideo,
  websocket
}: SteeringDemoModalProps) => {
  const [predictionData, setPredictionData] = useState<TelemetryData | null>(null);
  // Track WebSocket readiness separately from video player initialization
  const [isWebSocketReady, setIsWebSocketReady] = useState(false);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPredictionData(null);
      setIsWebSocketReady(false);
    }
  }, [isOpen]);

  // Handle direct WebSocket messages (for both video and image predictions)
  useEffect(() => {
    if (!websocket) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.status === 'error') {
          console.error('Steering demo error:', data.message);
          onClose();
          return;
        }

        // For non-video predictions, update immediately
        if (!isVideo && data.status === 'streaming') {
          setPredictionData(data);
          setIsWebSocketReady(true);
        }

        // For video predictions, let SynchronizedVideoPlayer handle the updates
        if (isVideo && data.status === 'streaming') {
          setIsWebSocketReady(true);
        }

        // Handle completion
        if (data.status === 'complete') {
          console.log('Steering demo completed');
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.addEventListener('message', handleWebSocketMessage);
    
    return () => {
      websocket.removeEventListener('message', handleWebSocketMessage);
    };
  }, [websocket, isVideo, onClose]);

  // Handle WebSocket errors and closure
  useEffect(() => {
    if (!websocket) return;

    const handleError = (error: Event) => {
      console.error('WebSocket error:', error);
      onClose();
    };

    const handleClose = () => {
      console.log('WebSocket closed');
      setIsWebSocketReady(true);
    };

    websocket.addEventListener('error', handleError);
    websocket.addEventListener('close', handleClose);

    return () => {
      websocket.removeEventListener('error', handleError);
      websocket.removeEventListener('close', handleClose);
    };
  }, [websocket, onClose]);

  if (!mediaUrl || !isOpen) return null;

  const predictedAngle = predictionData?.predicted_angle || predictionData?.angle || 0;
  const groundTruthAngle = predictionData?.ground_truth_angle || 0;

  const handlePredictionUpdate = (data: TelemetryData) => {
    setPredictionData(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col space-y-6">
          {/* Media Display */}
          <div className="flex justify-center">
            {isVideo ? (
              <div className="w-full max-w-3xl">
                <SynchronizedVideoPlayer<TelemetryData>
                  videoUrl={mediaUrl}
                  websocket={websocket}
                  demoType="steering"
                  onUpdate={handlePredictionUpdate}
                  isInitialized={isWebSocketReady}
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden bg-black max-w-3xl">
                <img src={mediaUrl} alt="Demo media" className="w-full h-auto" />
              </div>
            )}
          </div>

          {/* Steering Wheels */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-6">
            <div className="flex justify-center space-x-12 p-6">
              <SteeringWheel angle={predictedAngle} label="Predicted" />
              <SteeringWheel angle={groundTruthAngle} label="Ground Truth" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SteeringDemoModal;
