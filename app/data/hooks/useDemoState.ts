// hooks/useDemoState.ts

import { useState, useEffect } from 'react';
import { TelemetryData } from '../types';

export const useDemoState = () => {
  // Steering demo state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [demoSteeringAngle, setDemoSteeringAngle] = useState<number>(0);
  const [isStreamingDemo, setIsStreamingDemo] = useState<boolean>(false);
  const [demoWebSocket, setDemoWebSocket] = useState<WebSocket | null>(null);
  const [steeringCachedPredictions, setSteeringCachedPredictions] = useState<TelemetryData[]>([]);
  const [isSteeringPredictionCached, setIsSteeringPredictionCached] = useState<boolean>(false);

  // Speed demo state
  const [isSpeedModalOpen, setIsSpeedModalOpen] = useState<boolean>(false);
  const [speedWebSocket, setSpeedWebSocket] = useState<WebSocket | null>(null);
  const [speedCachedPredictions, setSpeedCachedPredictions] = useState<TelemetryData[]>([]);
  const [isSpeedPredictionCached, setIsSpeedPredictionCached] = useState<boolean>(false);

  useEffect(() => {
    // Cleanup WebSockets on unmount
    return () => {
      if (demoWebSocket) {
        demoWebSocket.close();
      }
      if (speedWebSocket) {
        speedWebSocket.close();
      }
    };
  }, [demoWebSocket, speedWebSocket]);

  return {
    // Steering demo state
    isDemoModalOpen,
    setIsDemoModalOpen,
    demoSteeringAngle,
    setDemoSteeringAngle,
    isStreamingDemo,
    setIsStreamingDemo,
    demoWebSocket,
    setDemoWebSocket,
    steeringCachedPredictions,
    setSteeringCachedPredictions,
    isSteeringPredictionCached,
    setIsSteeringPredictionCached,
    
    // Speed demo state
    isSpeedModalOpen,
    setIsSpeedModalOpen,
    speedWebSocket,
    setSpeedWebSocket,
    speedCachedPredictions,
    setSpeedCachedPredictions,
    isSpeedPredictionCached,
    setIsSpeedPredictionCached,
  };
};