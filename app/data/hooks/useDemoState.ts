// hooks/useDemoState.ts

import { useState, useEffect } from 'react';
import { TelemetryData, SpeedPredictionData } from '../types';

export const useDemoState = () => {
  // Existing steering demo state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [demoSteeringAngle, setDemoSteeringAngle] = useState<number>(0);
  const [isStreamingDemo, setIsStreamingDemo] = useState<boolean>(false);
  const [demoWebSocket, setDemoWebSocket] = useState<WebSocket | null>(null);
  const [cachedPredictions, setCachedPredictions] = useState<TelemetryData[]>([]);
  const [isPredictionCached, setIsPredictionCached] = useState<boolean>(false);

  // New speed demo state
  const [isSpeedDemoModalOpen, setIsSpeedDemoModalOpen] = useState<boolean>(false);
  const [speedDemoWebSocket, setSpeedDemoWebSocket] = useState<WebSocket | null>(null);
  const [isStreamingSpeedDemo, setIsStreamingSpeedDemo] = useState<boolean>(false);
  const [currentSpeedPrediction, setCurrentSpeedPrediction] = useState<SpeedPredictionData | null>(null);
  const [speedPredictions, setSpeedPredictions] = useState<SpeedPredictionData[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);

  useEffect(() => {
    // Cleanup WebSockets on unmount
    return () => {
      if (demoWebSocket) {
        demoWebSocket.close();
      }
      if (speedDemoWebSocket) {
        speedDemoWebSocket.close();
      }
    };
  }, [demoWebSocket, speedDemoWebSocket]);

  // Helper function to handle speed demo cleanup
  const cleanupSpeedDemo = () => {
    setIsSpeedDemoModalOpen(false);
    setIsStreamingSpeedDemo(false);
    setCurrentSpeedPrediction(null);
    setSpeedPredictions([]);
    setCurrentFrameIndex(0);
    if (speedDemoWebSocket) {
      speedDemoWebSocket.close();
      setSpeedDemoWebSocket(null);
    }
  };

  // Helper function to update current speed prediction based on frame index
  const updateCurrentSpeedPrediction = (frameIndex: number) => {
    // Since speed predictions come every 3 frames, we need to find the corresponding prediction
    const predictionIndex = Math.floor(frameIndex / 3);
    if (speedPredictions[predictionIndex]) {
      setCurrentSpeedPrediction(speedPredictions[predictionIndex]);
      setCurrentFrameIndex(frameIndex);
    }
  };

  return {
    // Existing steering demo state
    isDemoModalOpen,
    setIsDemoModalOpen,
    demoSteeringAngle,
    setDemoSteeringAngle,
    isStreamingDemo,
    setIsStreamingDemo,
    demoWebSocket,
    setDemoWebSocket,
    cachedPredictions,
    setCachedPredictions,
    isPredictionCached,
    setIsPredictionCached,

    // New speed demo state and functions
    isSpeedDemoModalOpen,
    setIsSpeedDemoModalOpen,
    speedDemoWebSocket,
    setSpeedDemoWebSocket,
    isStreamingSpeedDemo,
    setIsStreamingSpeedDemo,
    currentSpeedPrediction,
    setCurrentSpeedPrediction,
    speedPredictions,
    setSpeedPredictions,
    currentFrameIndex,
    setCurrentFrameIndex,
    cleanupSpeedDemo,
    updateCurrentSpeedPrediction,
  };
};