import { useState, useEffect } from 'react';
import { SpeedPredictionData } from '../types';

export const useDemoState = () => {
  // Steering demo state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoWebSocket, setDemoWebSocket] = useState<WebSocket | null>(null);
  
  // Speed demo state
  const [isSpeedDemoModalOpen, setIsSpeedDemoModalOpen] = useState(false);
  const [speedDemoWebSocket, setSpeedDemoWebSocket] = useState<WebSocket | null>(null);
  const [currentSpeedPrediction, setCurrentSpeedPrediction] = useState<SpeedPredictionData | null>(null);

  const cleanupSpeedDemo = () => {
    setIsSpeedDemoModalOpen(false);
    setCurrentSpeedPrediction(null);
    if (speedDemoWebSocket) {
      speedDemoWebSocket.close();
      setSpeedDemoWebSocket(null);
    }
  };

  // Cleanup WebSockets on unmount
  useEffect(() => {
    return () => {
      demoWebSocket?.close();
      speedDemoWebSocket?.close();
    };
  }, [demoWebSocket, speedDemoWebSocket]);

  return {
    // Steering demo
    isDemoModalOpen,
    setIsDemoModalOpen,
    demoWebSocket,
    setDemoWebSocket,
    
    // Speed demo
    isSpeedDemoModalOpen,
    setIsSpeedDemoModalOpen,
    speedDemoWebSocket,
    setSpeedDemoWebSocket,
    currentSpeedPrediction,
    setCurrentSpeedPrediction,
    cleanupSpeedDemo,
  };
};