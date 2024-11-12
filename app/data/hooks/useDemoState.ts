// hooks/useDemoState.ts

import { useState, useEffect } from 'react';
import { TelemetryData } from '../types';

export const useDemoState = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [demoSteeringAngle, setDemoSteeringAngle] = useState<number>(0);
  const [isStreamingDemo, setIsStreamingDemo] = useState<boolean>(false);
  const [demoWebSocket, setDemoWebSocket] = useState<WebSocket | null>(null);
  const [cachedPredictions, setCachedPredictions] = useState<TelemetryData[]>([]);
  const [isPredictionCached, setIsPredictionCached] = useState<boolean>(false);

  useEffect(() => {
    // Cleanup WebSocket on unmount
    return () => {
      if (demoWebSocket) {
        demoWebSocket.close();
      }
    };
  }, [demoWebSocket]);

  return {
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
    setIsPredictionCached
  };
};