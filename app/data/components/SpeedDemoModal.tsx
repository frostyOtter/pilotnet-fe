import React, { useEffect, useState } from 'react';
import SynchronizedVideoPlayer from './SynchronizedVideoPlayer';

interface SpeedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaId: string | null;
  isVideo: boolean;
  websocket: WebSocket | null;
}

interface SpeedDisplayProps {
  label: string;
  value: number;
  range?: {
    lower: number;
    upper: number;
  };
}

interface SpeedData {
  velocity_kmh: number;
  confidence_lower_kmh: number;
  confidence_upper_kmh: number;
  ground_truth_velocity?: number;
}

export const SpeedDemoModal: React.FC<SpeedDemoModalProps> = ({
  isOpen,
  onClose,
  mediaUrl,
  mediaId,
  isVideo,
  websocket,
}) => {
  const [predictedSpeed, setPredictedSpeed] = useState<number>(0);
  const [groundTruthSpeed, setGroundTruthSpeed] = useState<number>(0);
  const [confidenceLower, setConfidenceLower] = useState<number>(0);
  const [confidenceUpper, setConfidenceUpper] = useState<number>(0);
  const [status, setStatus] = useState<'analyzing' | 'streaming' | 'complete' | 'error'>('analyzing');

  useEffect(() => {
    if (websocket) {
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.status === 'error') {
          setStatus('error');
          return;
        }

        if (data.status === 'streaming') {
          handleSpeedUpdate({
            velocity_kmh: data.velocity_kmh,
            confidence_lower_kmh: data.confidence_lower_kmh,
            confidence_upper_kmh: data.confidence_upper_kmh,
            ground_truth_velocity: data.ground_truth_velocity
          });
          setStatus('streaming');
        } else if (data.status === 'complete') {
          setStatus('complete');
        }
      };

      websocket.onerror = () => {
        setStatus('error');
      };
    }

    return () => {
      if (websocket) {
        websocket.onmessage = null;
        websocket.onerror = null;
      }
    };
  }, [websocket]);

  const handleSpeedUpdate = (data: SpeedData) => {
    setPredictedSpeed(data.velocity_kmh);
    setConfidenceLower(data.confidence_lower_kmh);
    setConfidenceUpper(data.confidence_upper_kmh);
    if (data.ground_truth_velocity !== undefined) {
      setGroundTruthSpeed(data.ground_truth_velocity);
    }
  };

  const SpeedDisplay: React.FC<SpeedDisplayProps> = ({ label, value, range }) => (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
        {value.toFixed(1)} km/h
      </div>
      {range && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Range: {range.lower.toFixed(1)} - {range.upper.toFixed(1)} km/h
        </div>
      )}
    </div>
  );

  const SpeedGauge: React.FC<{ speed: number; max: number }> = ({ speed, max }) => (
    <div className="w-24 h-24 relative">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={`${(speed / max) * 283} 283`}
          className="text-blue-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{speed.toFixed(0)}</span>
      </div>
    </div>
  );

  if (!mediaUrl) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? 'visible' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-7xl w-full mx-4">
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
            {isVideo ? (
            //   <SynchronizedVideoPlayer
            //     videoUrl={mediaUrl}
            //     websocket={websocket}
            //     onSpeedUpdate={handleSpeedUpdate}
            //     type="speed"
            //     isPredictionCached={isPredictionCached}
            //     cachedPredictions={cachedPredictions}
            <SynchronizedVideoPlayer
                videoUrl={mediaUrl}
                websocket={websocket}
                onSpeedUpdate={handleSpeedUpdate}
                type="speed"
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

          {/* Speed Display and Telemetry */}
          <div className="flex flex-col space-y-6">
            {/* Speed Displays with Gauges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <SpeedDisplay 
                  label="Predicted Speed" 
                  value={predictedSpeed}
                  range={{ lower: confidenceLower, upper: confidenceUpper }}
                />
                <SpeedGauge speed={predictedSpeed} max={200} />
              </div>
              <div className="flex flex-col items-center">
                <SpeedDisplay 
                  label="Ground Truth Speed" 
                  value={groundTruthSpeed} 
                />
                <SpeedGauge speed={groundTruthSpeed} max={200} />
              </div>
            </div>

            {/* Confidence Interval */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Confidence Interval</h3>
              <div className="relative h-8 bg-gray-200 dark:bg-gray-600 rounded">
                <div 
                  className="absolute h-full bg-blue-200 dark:bg-blue-800 rounded"
                  style={{
                    left: `${(confidenceLower / 200) * 100}%`,
                    right: `${100 - (confidenceUpper / 200) * 100}%`
                  }}
                />
                <div 
                  className="absolute h-full w-2 bg-blue-500"
                  style={{ left: `${(predictedSpeed / 200) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-sm">
                <span>0 km/h</span>
                <span>200 km/h</span>
              </div>
            </div>

            {/* Speed Error Analysis */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Error Analysis</h3>
              <div className="space-y-2">
                <p>Absolute Error: {Math.abs(predictedSpeed - groundTruthSpeed).toFixed(1)} km/h</p>
                <p>Relative Error: {((Math.abs(predictedSpeed - groundTruthSpeed) / groundTruthSpeed) * 100).toFixed(1)}%</p>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded">
                  <div 
                    className="h-full bg-blue-500 rounded transition-all duration-300"
                    style={{ 
                      width: `${Math.max(0, Math.min(100, 100 - (Math.abs(predictedSpeed - groundTruthSpeed) / 2)))}%` 
                    }}
                  />
                </div>
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
                <span className="capitalize">{status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};