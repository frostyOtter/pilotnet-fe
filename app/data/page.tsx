'use client';

import React, { useEffect } from 'react';
import Header from '@/app/components/Header';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { MediaControlPanel } from './components/MediaControlPanel';
import { MediaDisplay } from './components/MediaDisplay';
import SteeringDemoModal from './components/SteeringDemoModal';
import { SpeedDemoModal } from './components/SpeedDemoModal';
import { useMediaState } from './hooks/useMediaState';
import { useDemoState } from './hooks/useDemoState';
import * as api from './utils/api';
import { SteeringDemoResponse, TelemetryData } from './types';

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
  } = useDemoState();

  useEffect(() => {
    fetchAvailableMedia();
    return () => {
      if (demoWebSocket) {
        demoWebSocket.close();
      }
      if (speedWebSocket) {
        speedWebSocket.close();
      }
    };
  }, []);

  const fetchAvailableMedia = async () => {
    try {
      const data = await api.fetchAvailableMedia();
      setAvailableMedia(data);
    } catch (error) {
      console.error('Error fetching media data:', error);
    }
  };

  const handleGetRandomVideo = async () => {
    try {
      const { url, filename } = await api.fetchRandomVideo();
      setRandomVideoBlob(url);
      setSelectedVideoBlob(null);
      setCurrentMediaId(filename);
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

  const handleGetVideoById = async () => {
    try {
      const { url } = await api.fetchMediaById(mediaId, 'video');
      setSelectedVideoBlob(url);
      setRandomVideoBlob(null);
      setCurrentMediaId(mediaId);
    } catch (error) {
      console.error('Error fetching video by ID:', error);
    }
  };

  const handleGetImageById = async () => {
    try {
      const { url } = await api.fetchMediaById(mediaId, 'image');
      setSelectedImageBlob(url);
      setRandomImageBlobs([]);
      setCurrentMediaId(mediaId);
    } catch (error) {
      console.error('Error fetching image by ID:', error);
    }
  };

  const handleSteeringDemo = async () => {
    if (!currentMediaId) return;

    try {
      setIsDemoModalOpen(true);
      setIsStreamingDemo(true);

      const isVideo = Boolean(selectedVideoBlob || randomVideoBlob);
      const result: SteeringDemoResponse = await api.startSteeringDemo(currentMediaId, isVideo);

      if (isVideo) {
        if (result.cached && result.predictions) {
          // Handle cached predictions
          setSteeringCachedPredictions(result.predictions);
          setIsSteeringPredictionCached(true);
          setDemoWebSocket(null);
        } else {
          // Handle real-time processing
          setIsSteeringPredictionCached(false);
          setSteeringCachedPredictions([]); 
          setDemoWebSocket(result.ws);
        }
      } else {
        // Handle image predictions
        if (result.predictions && result.predictions.length > 0) {
          setDemoSteeringAngle(result.predictions[0].angle || 0);
        }
      }
    } catch (error) {
      console.error('Error in steering demo:', error);
      alert('Error running steering demo');
      handleCloseSteeringDemo();
    }
  };

  const handleSpeedDemo = async () => {
    if (!currentMediaId) return;

    try {
      setIsSpeedModalOpen(true);
      const isVideo = Boolean(selectedVideoBlob || randomVideoBlob);

      // Check for cached predictions first
      const cacheResponse = await api.checkPredictionCache(currentMediaId);
      if (cacheResponse.cached && cacheResponse.predictions) {
        setSpeedCachedPredictions(cacheResponse.predictions);
        setIsSpeedPredictionCached(true);
        return;
      }

      // Create WebSocket connection for speed prediction
      const ws = new WebSocket('ws://localhost:8000/api/demo/ws/speed');
      setSpeedWebSocket(ws);

      ws.onopen = () => {
        ws.send(JSON.stringify({
          video_id: currentMediaId,
        }));
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        alert('Error connecting to speed prediction service');
        handleCloseSpeedDemo();
      };

    } catch (error) {
      console.error('Error in speed demo:', error);
      alert('Error running speed demo');
      handleCloseSpeedDemo();
    }
  };

  const handleCloseSteeringDemo = () => {
    setIsDemoModalOpen(false);
    setIsStreamingDemo(false);
    setIsSteeringPredictionCached(false);
    setSteeringCachedPredictions([]); 
    if (demoWebSocket) {
      demoWebSocket.close();
      setDemoWebSocket(null);
    }
  };

  const handleCloseSpeedDemo = () => {
    setIsSpeedModalOpen(false);
    setIsSpeedPredictionCached(false);
    setSpeedCachedPredictions([]);
    if (speedWebSocket) {
      speedWebSocket.close();
      setSpeedWebSocket(null);
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
          onGetVideoById={handleGetVideoById}
          onGetImageById={handleGetImageById}
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
          mediaUrl={
            selectedVideoBlob || 
            randomVideoBlob || 
            selectedImageBlob || 
            (randomImageBlobs.length > 0 ? randomImageBlobs[0] : null)
          }
          mediaId={currentMediaId}
          steeringAngle={demoSteeringAngle}
          isVideo={Boolean(selectedVideoBlob || randomVideoBlob)}
          websocket={demoWebSocket}
          isPredictionCached={isSteeringPredictionCached}
          cachedPredictions={steeringCachedPredictions}
        />

        <SpeedDemoModal
          isOpen={isSpeedModalOpen}
          onClose={handleCloseSpeedDemo}
          mediaUrl={
            selectedVideoBlob || 
            randomVideoBlob || 
            selectedImageBlob || 
            (randomImageBlobs.length > 0 ? randomImageBlobs[0] : null)
          }
          mediaId={currentMediaId}
          isVideo={Boolean(selectedVideoBlob || randomVideoBlob)}
          websocket={speedWebSocket}
        />
      </main>

      <Navbar />
      <Footer />
    </div>
  );
}