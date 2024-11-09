// page.tsx
'use client';

import React, { useEffect } from 'react';
import Header from '@/app/components/Header';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { MediaControlPanel } from './components/MediaControlPanel';
import { MediaDisplay } from './components/MediaDisplay';
import { SteeringDemoModal } from './components/SteeringDemoModal';
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
    demoSteeringAngle,
    setDemoSteeringAngle,
    isStreamingDemo,
    setIsStreamingDemo,
    demoWebSocket,
    setDemoWebSocket
  } = useDemoState();

  useEffect(() => {
    fetchAvailableMedia();
    // Cleanup WebSocket on unmount
    return () => {
      if (demoWebSocket) {
        demoWebSocket.close();
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
      const result = await api.startSteeringDemo(currentMediaId, isVideo);

      if (isVideo && result.ws) {
        setDemoWebSocket(result.ws);
      } else {
        setDemoSteeringAngle(result.results.steering_angle);
      }
    } catch (error) {
      console.error('Error in steering demo:', error);
      alert('Error running steering demo');
      handleCloseDemo();
    }
  };

  const handleCloseDemo = () => {
    setIsDemoModalOpen(false);
    setIsStreamingDemo(false);
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
          onGetVideoById={handleGetVideoById}
          onGetImageById={handleGetImageById}
        />

        <MediaDisplay
          selectedVideoBlob={selectedVideoBlob}
          selectedImageBlob={selectedImageBlob}
          randomVideoBlob={randomVideoBlob}
          randomImageBlobs={randomImageBlobs}
          onSteeringDemo={handleSteeringDemo}
        />

        <SteeringDemoModal
          isOpen={isDemoModalOpen}
          onClose={handleCloseDemo}
          mediaUrl={
            selectedVideoBlob || 
            randomVideoBlob || 
            selectedImageBlob || 
            (randomImageBlobs.length > 0 ? randomImageBlobs[0] : null)
          }
          steeringAngle={demoSteeringAngle}
          isVideo={Boolean(selectedVideoBlob || randomVideoBlob)}
          websocket={demoWebSocket}
        />
      </main>

      <Navbar />
      <Footer />
    </div>
  );
}