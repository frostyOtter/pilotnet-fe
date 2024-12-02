import React, { useEffect } from 'react';
import SynchronizedVideoPlayer from './SynchronizedVideoPlayer';
import { SpeedPredictionData } from '../types';

interface SpeedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaId: string | null;
  websocket: WebSocket | null;
  currentPrediction: SpeedPredictionData | null;
  setCurrentPrediction: (prediction: SpeedPredictionData | null) => void;
}

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

const SpeedDemoModal: React.FC<SpeedDemoModalProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  websocket,
  currentPrediction,
  setCurrentPrediction
}) => {
  // Track WebSocket readiness
  const [isWebSocketReady, setIsWebSocketReady] = React.useState(false);
  // Store all predictions
  const [predictions, setPredictions] = React.useState<SpeedPredictionData[]>([]);
  
  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentPrediction(null);
      setIsWebSocketReady(false);
      setPredictions([]);
    }
  }, [isOpen, setCurrentPrediction]);

  // WebSocket message handling
  useEffect(() => {
    if (!websocket) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.status) {
          case 'initialized':
            setIsWebSocketReady(true);
            setPredictions(prev => [...prev, data]);
            break;
          case 'streaming':
            if (!isWebSocketReady) {
              setIsWebSocketReady(true);
            }
            setPredictions(prev => [...prev, data]);
            break;
          case 'error':
            console.error('Speed demo error:', data.message);
            onClose();
            break;
          case 'complete':
            console.log('Speed demo completed');
            break;
          default:
            console.warn('Unknown status:', data.status);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.addEventListener('message', handleWebSocketMessage);
    
    return () => {
      websocket.removeEventListener('message', handleWebSocketMessage);
    };
  }, [websocket, onClose, isWebSocketReady]);

  // Handle WebSocket errors and closure
  useEffect(() => {
    if (!websocket) return;

    const handleError = (error: Event) => {
      console.error('WebSocket error:', error);
      setIsWebSocketReady(false);
      onClose();
    };

    const handleClose = () => {
      console.log('WebSocket closed');
      setIsWebSocketReady(false);
      onClose();
    };

    websocket.addEventListener('error', handleError);
    websocket.addEventListener('close', handleClose);

    return () => {
      websocket.removeEventListener('error', handleError);
      websocket.removeEventListener('close', handleClose);
    };
  }, [websocket, onClose]);

  if (!mediaUrl || !isOpen) return null;

  const groundTruthSpeed = currentPrediction?.ground_truth_velocity_kmh ?? 0;
  const predictedSpeed = currentPrediction?.velocity_kmh ?? 0;

  // Handler for video time updates that syncs with predictions
  const handlePredictionUpdate = (prediction: SpeedPredictionData) => {
    setCurrentPrediction(prediction);
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
              <SynchronizedVideoPlayer<SpeedPredictionData>
                videoUrl={mediaUrl}
                websocket={websocket}
                demoType="speed"
                onUpdate={handlePredictionUpdate}
                isInitialized={isWebSocketReady}
                predictions={predictions}
              />
            </div>
          </div>

          {/* Speedometers */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-6">
            <div className="flex justify-center space-x-12 p-6">
              <Speedometer 
                speed={predictedSpeed}
                label="Predicted Speed"
                confidenceLower={currentPrediction?.confidence_lower_kmh}
                confidenceUpper={currentPrediction?.confidence_upper_kmh}
              />
              <Speedometer 
                speed={groundTruthSpeed}
                label="Ground Truth"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedDemoModal;
