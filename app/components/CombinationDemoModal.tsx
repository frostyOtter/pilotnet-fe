import React, { useEffect } from 'react';
import Image from 'next/image';
import SynchronizedCombinationVideoPlayer from './SynchronizedCombinationVideoPlayer';
import { CombinationPredictionData } from '../types';

interface CombinationDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaId: string | null;
  websocket: WebSocket | null;
  currentPrediction: CombinationPredictionData | null;
  setCurrentPrediction: (prediction: CombinationPredictionData | null) => void;
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
          src="/IMG_3791.jpeg"
          alt={`${label} Steering Wheel`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </div>
    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
      {angle.toFixed(1)}
    </div>
  </div>
);

const Speedometer = ({ 
  speed, 
  label, 
  confidenceLower, 
  confidenceUpper 
}: {
  speed: number;
  label: string;
  confidenceLower?: number;
  confidenceUpper?: number;
}) => (
  <div className="flex flex-col items-center space-y-2">
    <h3 className="text-lg font-semibold">{label}</h3>
    <div className="relative w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full">
      <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center flex-col">
        <span className="text-3xl font-bold">
          {speed ? speed.toFixed(1) : '0.0'}
        </span>
        <span className="text-sm">km/h</span>
        {confidenceLower !== undefined && confidenceUpper !== undefined && (
          <span className="text-xs text-gray-500">
            ±{((confidenceUpper - confidenceLower) / 2).toFixed(1)} km/h
          </span>
        )}
      </div>
    </div>
  </div>
);

const CombinationDemoModal: React.FC<CombinationDemoModalProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  websocket,
  currentPrediction,
  setCurrentPrediction
}) => {
  const [isWebSocketReady, setIsWebSocketReady] = React.useState(false);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentPrediction(null);
      setIsWebSocketReady(false);
    }
  }, [isOpen, setCurrentPrediction]);

  // WebSocket message handling
  useEffect(() => {
    if (!websocket) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            
            if (data.status === 'error') {
            console.error('Combination demo error:', data.message);
            onClose();
            return;
            }

            if (data.status === 'complete') {
            console.log('Combination demo completed');
            return;
            }

            if (data.status === 'streaming' || data.status === 'initialized') {
            setIsWebSocketReady(true);
            // Add this line to update the prediction data
            // setCurrentPrediction(data);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };

    websocket.addEventListener('message', handleWebSocketMessage);
    
    return () => {
    websocket.removeEventListener('message', handleWebSocketMessage);
    };
}, [websocket, onClose, setCurrentPrediction]);


  if (!mediaUrl || !isOpen) return null;

  const predictedAngle = currentPrediction?.predicted_angle ?? 0;
  const groundTruthAngle = currentPrediction?.ground_truth_angle ?? 0;
  const predictedSpeed = currentPrediction?.velocity_kmh ?? 0;
  const groundTruthSpeed = currentPrediction?.ground_truth_velocity_kmh ?? 0;

  const handlePredictionUpdate = (data: CombinationPredictionData) => {
    setCurrentPrediction(data);
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
          {/* Video Player */}
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <SynchronizedCombinationVideoPlayer
                videoUrl={mediaUrl}
                websocket={websocket}
                onUpdate={handlePredictionUpdate}
                isInitialized={isWebSocketReady}
              />
            </div>
          </div>

          {/* Controls and Displays */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-6">
            <div className="grid grid-cols-2 gap-8 p-6">
              {/* Steering Controls */}
              <div className="flex justify-center space-x-12">
                <SteeringWheel angle={predictedAngle} label="Predicted Angle" />
                <SteeringWheel angle={groundTruthAngle} label="Ground Truth Angle" />
              </div>
              
              {/* Speed Controls */}
              <div className="flex justify-center space-x-12">
                <Speedometer 
                  speed={predictedSpeed}
                  label="Predicted Speed"
                  confidenceLower={currentPrediction?.confidence_lower_kmh}
                  confidenceUpper={currentPrediction?.confidence_upper_kmh}
                />
                <Speedometer 
                  speed={groundTruthSpeed}
                  label="Ground Truth Speed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinationDemoModal;