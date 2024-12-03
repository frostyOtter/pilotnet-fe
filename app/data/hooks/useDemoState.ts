import { useState, useEffect } from 'react';
import { SpeedPredictionData, CombinationPredictionData } from '../types';

export const useDemoState = () => {
  // Steering demo state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoWebSocket, setDemoWebSocket] = useState<WebSocket | null>(null);
  
  // Speed demo state
  const [isSpeedDemoModalOpen, setIsSpeedDemoModalOpen] = useState(false);
  const [speedDemoWebSocket, setSpeedDemoWebSocket] = useState<WebSocket | null>(null);
  const [currentSpeedPrediction, setCurrentSpeedPrediction] = useState<SpeedPredictionData | null>(null);

  // Combination demo state
  const [isCombinationDemoModalOpen, setIsCombinationDemoModalOpen] = useState(false);
  const [combinationDemoWebSocket, setCombinationDemoWebSocket] = useState<WebSocket | null>(null);
  const [currentCombinationPrediction, setCurrentCombinationPrediction] = useState<CombinationPredictionData | null>(null);

  const cleanupSpeedDemo = () => {
    setIsSpeedDemoModalOpen(false);
    setCurrentSpeedPrediction(null);
    if (speedDemoWebSocket) {
      speedDemoWebSocket.close();
      setSpeedDemoWebSocket(null);
    }
  };

  const cleanupCombinationDemo = () => {
    setIsCombinationDemoModalOpen(false);
    setCurrentCombinationPrediction(null);
    if (combinationDemoWebSocket) {
      combinationDemoWebSocket.close();
      setCombinationDemoWebSocket(null);
    }
  };

  // Cleanup WebSockets on unmount
  useEffect(() => {
    return () => {
      demoWebSocket?.close();
      speedDemoWebSocket?.close();
      combinationDemoWebSocket?.close();
    };
  }, [demoWebSocket, speedDemoWebSocket, combinationDemoWebSocket]);

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

    // Combination demo
    isCombinationDemoModalOpen,
    setIsCombinationDemoModalOpen,
    combinationDemoWebSocket,
    setCombinationDemoWebSocket,
    currentCombinationPrediction,
    setCurrentCombinationPrediction,
    cleanupCombinationDemo,
  };
};