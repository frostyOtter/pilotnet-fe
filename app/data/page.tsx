'use client';

import React, { useEffect } from 'react';
import Header from '@/app/components/Header';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { MediaControlPanel } from './components/MediaControlPanel';
import { MediaDisplay } from './components/MediaDisplay';
import SteeringDemoModal from './components/SteeringDemoModal';
import SpeedDemoModal from './components/SpeedDemoModal';
import { useMediaState } from './hooks/useMediaState';
import { useDemoState } from './hooks/useDemoState';
import * as api from './utils/api';

export default function DataPage() {
  const {
    availableMedia,
    setAvailableMedia,
    randomVideoBlob,
    setRandomVideoBlob,
    randomImageBlobs,
    setRandomImageBlobs,
    mediaId,
    setMediaId,
    selectedVideoBlob,
    setSelectedVideoBlob,
    selectedImageBlob,
    setSelectedImageBlob,
    currentMediaId,
    setCurrentMediaId,
  } = useMediaState();

  const {
    isDemoModalOpen,
    setIsDemoModalOpen,
    demoWebSocket,
    setDemoWebSocket,
    isSpeedDemoModalOpen,
    setIsSpeedDemoModalOpen,
    speedDemoWebSocket,
    setSpeedDemoWebSocket,
    currentSpeedPrediction,
    setCurrentSpeedPrediction,
    cleanupSpeedDemo,
  } = useDemoState();

  // Fetch available media on mount
  useEffect(() => {
    api.fetchAvailableMedia()
      .then(setAvailableMedia)
      .catch(console.error);

    return () => {
      demoWebSocket?.close();
      speedDemoWebSocket?.close();
    };
  }, []);

  const handleGetRandomVideo = async () => {
    try {
      const { url, filename } = await api.fetchRandomVideo();
      setRandomVideoBlob(url);
      setSelectedVideoBlob(null);
      setCurrentMediaId(filename ?? null);
    } catch (error) {
      console.error('Error fetching random video:', error);
    }
  };

  const handleGetRandomImages = async () => {
    try {
      const { blobs, paths } = await api.fetchRandomImages();
      setRandomImageBlobs(blobs);
      setSelectedImageBlob(null);
      setCurrentMediaId(paths[0]);
    } catch (error) {
      console.error('Error fetching random images:', error);
    }
  };

  const handleGetMediaById = async (type: 'video' | 'image') => {
    try {
      const { url } = await api.fetchMediaById(mediaId, type);
      if (type === 'video') {
        setSelectedVideoBlob(url);
        setRandomVideoBlob(null);
      } else {
        setSelectedImageBlob(url);
        setRandomImageBlobs([]);
      }
      setCurrentMediaId(mediaId);
    } catch (error) {
      console.error(`Error fetching ${type} by ID:`, error);
    }
  };

  const handleSteeringDemo = async () => {
    if (!currentMediaId) return;

    try {
      const isVideo = Boolean(selectedVideoBlob || randomVideoBlob);
      setIsDemoModalOpen(true);
      const result = await api.startSteeringDemo(currentMediaId, isVideo);
      setDemoWebSocket(result.ws);
    } catch (error) {
      console.error('Error in steering demo:', error);
      setIsDemoModalOpen(false);
    }
  };

  const handleSpeedDemo = async () => {
    if (!currentMediaId) return;

    try {
      const isVideo = Boolean(selectedVideoBlob || randomVideoBlob);
      if (!isVideo) {
        alert('Speed demo is only available for videos');
        return;
      }

      setIsSpeedDemoModalOpen(true);
      const result = await api.startSpeedDemo(currentMediaId, isVideo);
      setSpeedDemoWebSocket(result.ws);
    } catch (error) {
      console.error('Error in speed demo:', error);
      cleanupSpeedDemo();
    }
  };

  const handleCloseSteeringDemo = () => {
    setIsDemoModalOpen(false);
    if (demoWebSocket) {
      demoWebSocket.close();
      setDemoWebSocket(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-800 dark:to-black">
      <Header />
      
      <main className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Data Explorer</h1>

        <MediaControlPanel
          availableMedia={availableMedia}
          onGetRandomVideo={handleGetRandomVideo}
          onGetRandomImages={handleGetRandomImages}
          mediaId={mediaId}
          onMediaIdChange={setMediaId}
          onGetVideoById={() => handleGetMediaById('video')}
          onGetImageById={() => handleGetMediaById('image')}
        />

        <MediaDisplay
          selectedVideoBlob={selectedVideoBlob}
          selectedImageBlob={selectedImageBlob}
          randomVideoBlob={randomVideoBlob}
          randomImageBlobs={randomImageBlobs}
          onSteeringDemo={handleSteeringDemo}
          onSpeedDemo={handleSpeedDemo}
        />

        <SteeringDemoModal
          isOpen={isDemoModalOpen}
          onClose={handleCloseSteeringDemo}
          mediaUrl={selectedVideoBlob || randomVideoBlob || selectedImageBlob || randomImageBlobs[0]}
          mediaId={currentMediaId}
          isVideo={Boolean(selectedVideoBlob || randomVideoBlob)}
          websocket={demoWebSocket}
        />

        <SpeedDemoModal
          isOpen={isSpeedDemoModalOpen}
          onClose={cleanupSpeedDemo}
          mediaUrl={selectedVideoBlob || randomVideoBlob}
          mediaId={currentMediaId}
          websocket={speedDemoWebSocket}
          currentPrediction={currentSpeedPrediction}
          setCurrentPrediction={setCurrentSpeedPrediction}
        />
      </main>

      <Navbar />
      <Footer />
    </div>
  );
}