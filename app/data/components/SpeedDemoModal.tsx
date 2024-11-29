import React, { useEffect } from 'react';
import { SpeedPredictionData } from '../types';
import SynchronizedVideoPlayer from './SynchronizedVideoPlayer';

interface SpeedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaId: string | null;
  websocket: WebSocket | null;
  currentPrediction: SpeedPredictionData | null;
  setCurrentPrediction: (prediction: SpeedPredictionData | null) => void;
}

interface SpeedometerProps {
  speed: number;
  label: string;
  confidenceLower?: number;
  confidenceUpper?: number;
  className?: string;
}

const Speedometer: React.FC<SpeedometerProps> = ({ 
  speed, 
  label, 
  confidenceLower, 
  confidenceUpper,
  className 
}) => (
  <div className={`flex flex-col items-center space-y-2 ${className}`}>
    <h3 className="text-lg font-semibold">{label}</h3>
    <div className="relative w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-full">
      <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center flex-col">
        <span className="text-3xl font-bold">{typeof speed === 'number' ? speed.toFixed(1) : '0.0'}</span>
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
  mediaId,
  websocket,
  currentPrediction,
  setCurrentPrediction
}) => {
  useEffect(() => {
    // Reset prediction when modal closes
    if (!isOpen) {
      setCurrentPrediction(null);
    }
  }, [isOpen, setCurrentPrediction]);

  if (!mediaUrl || !isOpen) return null;

  const status = currentPrediction?.status || 'analyzing';
  const groundTruthSpeed = currentPrediction?.ground_truth_velocity_kmh ?? 0;
  const predictedSpeed = currentPrediction?.velocity_kmh ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-7xl w-full mx-4">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Media Display */}
          <div>
            <SynchronizedVideoPlayer<SpeedPredictionData>
              videoUrl={mediaUrl}
              websocket={websocket}
              demoType="speed"
              onUpdate={setCurrentPrediction}
            />
          </div>

          {/* Speed Display and Telemetry */}
          <div className="flex flex-col space-y-6">
            {/* Speedometers */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* Analysis Panel */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Analysis</h3>
              <div className="space-y-2">
                {currentPrediction && (
                  <>
                    <p>IQR: {currentPrediction.iqr_kmh.toFixed(1)} km/h</p>
                    <p>Confidence Range: {currentPrediction.confidence_lower_kmh.toFixed(1)} - {currentPrediction.confidence_upper_kmh.toFixed(1)} km/h</p>
                    {currentPrediction.ground_truth_velocity_kmh && (
                      <p>Error: {Math.abs(currentPrediction.velocity_kmh - currentPrediction.ground_truth_velocity_kmh).toFixed(1)} km/h</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Status Panel */}
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
                  {status}
                </span>
              </div>
              {currentPrediction?.frame_count && (
                <p className="mt-2">Frame: {currentPrediction.frame_count}</p>
              )}
            </div>

            {/* Processing Info */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Processing Info</h3>
              <div className="space-y-2">
                <p>Mode: Real-time Processing</p>
                {status === 'streaming' && (
                  <p>Processing every 3 frames...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedDemoModal;