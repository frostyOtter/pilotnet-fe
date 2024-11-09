import { useState, useEffect } from 'react';

export const useDemoState = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [demoSteeringAngle, setDemoSteeringAngle] = useState<number>(0);
  const [isStreamingDemo, setIsStreamingDemo] = useState<boolean>(false);
  const [demoWebSocket, setDemoWebSocket] = useState<WebSocket | null>(null);

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
    setDemoWebSocket
  };
};