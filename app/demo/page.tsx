"use client"
import React, { useState, useCallback } from 'react';
import { startSteeringDemo, startSpeedDemo, startCombinationDemo } from '../api/api';
import { SpeedPredictionData, CombinationPredictionData } from '../types';
import SpeedDemoModal from '../components/SpeedDemoModal';
import SteeringDemoModal from '../components/SteeringDemoModal';
import CombinationDemoModal from '../components/CombinationDemoModal';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DemoPage = () => {
  // Video state
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Demo states
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSpeedDemoModalOpen, setIsSpeedDemoModalOpen] = useState(false);
  const [isCombinationDemoModalOpen, setIsCombinationDemoModalOpen] = useState(false);
  
  // WebSocket states
  const [demoWebSocket, setDemoWebSocket] = useState<WebSocket | null>(null);
  const [speedDemoWebSocket, setSpeedDemoWebSocket] = useState<WebSocket | null>(null);
  const [combinationDemoWebSocket, setCombinationDemoWebSocket] = useState<WebSocket | null>(null);
  
  // Prediction states
  const [currentSpeedPrediction, setCurrentSpeedPrediction] = useState<SpeedPredictionData | null>(null);
  const [currentCombinationPrediction, setCurrentCombinationPrediction] = useState<CombinationPredictionData | null>(null);

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if the file is a video
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file');
      return;
    }

    // Create object URL for the uploaded video
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoFile(file);

    // Reset states when new video is uploaded
    setIsDemoModalOpen(false);
    setIsSpeedDemoModalOpen(false);
    setIsCombinationDemoModalOpen(false);
    setDemoWebSocket(null);
    setSpeedDemoWebSocket(null);
    setCombinationDemoWebSocket(null);
    setCurrentSpeedPrediction(null);
    setCurrentCombinationPrediction(null);
  }, []);

  const uploadVideo = async () => {
    if (!videoFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await fetch('/api/py/data/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload response:', response.status, errorText);
        throw new Error(`Failed to upload video: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Demo handlers
  const handleSteeringDemo = async () => {
    try {
      if (!videoFile) return;
      
      // First upload the video and get its ID
      const videoId = await uploadVideo();
      if (!videoId) return;
      
      const { ws } = await startSteeringDemo(videoId, true);
      setDemoWebSocket(ws);
      setIsDemoModalOpen(true);
    } catch (error) {
      console.error('Error starting steering demo:', error);
      alert('Failed to start steering demo. Please try again.');
    }
  };

  const handleSpeedDemo = async () => {
    try {
      if (!videoFile) return;
      
      // First upload the video and get its ID
      const videoId = await uploadVideo();
      if (!videoId) return;
      
      const { ws } = await startSpeedDemo(videoId, true);
      setSpeedDemoWebSocket(ws);
      setIsSpeedDemoModalOpen(true);
    } catch (error) {
      console.error('Error starting speed demo:', error);
      alert('Failed to start speed demo. Please try again.');
    }
  };

  const handleCombinationDemo = async () => {
    try {
      if (!videoFile) return;
      
      // First upload the video and get its ID
      const videoId = await uploadVideo();
      if (!videoId) return;
      
      const { ws } = await startCombinationDemo(videoId, true);
      setCombinationDemoWebSocket(ws);
      setIsCombinationDemoModalOpen(true);
    } catch (error) {
      console.error('Error starting combination demo:', error);
      alert('Failed to start combination demo. Please try again.');
    }
  };

  // Cleanup handlers
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-800 dark:to-black">
      <Header />
      <main className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Video Demo</h1>

        {/* Video Upload Section */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Upload Video</h2>
          <div className="flex flex-col items-center gap-4">
            <label className={`w-full max-w-xl flex flex-col items-center px-4 py-6 bg-white dark:bg-zinc-700 text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-base leading-normal">
                {isUploading ? 'Uploading...' : 'Select a video file'}
              </span>
              <input 
                type="file" 
                accept="video/*"
                className="hidden" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
            {videoFile && (
              <p className="text-sm text-gray-500">
                Selected file: {videoFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Video Display Section */}
        {videoUrl && (
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
            <div className="relative pb-[56.25%] h-0 mb-6">
              <video
                src={videoUrl}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                controls
              />
            </div>

            {/* Demo Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleSteeringDemo}
                disabled={isUploading}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Processing...' : 'Start Steering Demo'}
              </button>
              <button
                onClick={handleSpeedDemo}
                disabled={isUploading}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Processing...' : 'Start Speed Demo'}
              </button>
              <button
                onClick={handleCombinationDemo}
                disabled={isUploading}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Processing...' : 'Start Combined Demo'}
              </button>
            </div>
          </div>
        )}

        {/* Demo Modals */}
        <SteeringDemoModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
          mediaUrl={videoUrl}
          mediaId={videoFile?.name || null}
          isVideo={true}
          websocket={demoWebSocket}
        />

        <SpeedDemoModal
          isOpen={isSpeedDemoModalOpen}
          onClose={cleanupSpeedDemo}
          mediaUrl={videoUrl}
          mediaId={videoFile?.name || null}
          websocket={speedDemoWebSocket}
          currentPrediction={currentSpeedPrediction}
          setCurrentPrediction={setCurrentSpeedPrediction}
        />

        <CombinationDemoModal
          isOpen={isCombinationDemoModalOpen}
          onClose={cleanupCombinationDemo}
          mediaUrl={videoUrl}
          mediaId={videoFile?.name || null}
          websocket={combinationDemoWebSocket}
          currentPrediction={currentCombinationPrediction}
          setCurrentPrediction={setCurrentCombinationPrediction}
        />
      </main>
      <Navbar />
      <Footer />
    </div>
  );
};

export default DemoPage;
