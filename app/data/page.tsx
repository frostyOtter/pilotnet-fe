"use client";

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DataPage() {
  const [availableMedia, setAvailableMedia] = useState({ videos: [], images: [], video_count: 0, image_count: 0 });
  const [randomVideoBlob, setRandomVideoBlob] = useState<string | null>(null);
  const [randomImageBlobs, setRandomImageBlobs] = useState<string[]>([]);
  const [mediaId, setMediaId] = useState('');
  const [selectedVideoBlob, setSelectedVideoBlob] = useState<string | null>(null);
  const [selectedImageBlob, setSelectedImageBlob] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableMedia();
  }, []);

  const fetchAvailableMedia = async () => {
    try {
      const response = await fetch('/api/py/data/available-media');
      const data = await response.json();
      setAvailableMedia(data);
    } catch (error) {
      console.error('Error fetching media data:', error);
    }
  };

  const handleGetRandomVideo = async () => {
    try {
      const response = await fetch('/api/py/data/random-video');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setRandomVideoBlob(url);
      setSelectedVideoBlob(null);
    } catch (error) {
      console.error('Error fetching random video:', error);
    }
  };

  const handleGetRandomImages = async () => {
    try {
      const response = await fetch('/api/py/data/random-images');
      const data = await response.json();
      const imageBlobs = await Promise.all(
        data.image_paths.map(async (path: string) => {
          const imageResponse = await fetch(`/api/py/data/image/${path}`);
          const blob = await imageResponse.blob();
          return URL.createObjectURL(blob);
        })
      );
      setRandomImageBlobs(imageBlobs);
      setSelectedImageBlob(null);
    } catch (error) {
      console.error('Error fetching random images:', error);
    }
  };

  const handleGetVideoById = async () => {
    try {
      const response = await fetch(`/api/py/data/video/${mediaId}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setSelectedVideoBlob(url);
      setRandomVideoBlob(null);
    } catch (error) {
      console.error('Error fetching video by ID:', error);
    }
  };

  const handleGetImageById = async () => {
    try {
      const response = await fetch(`/api/py/data/image/${mediaId}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setSelectedImageBlob(url);
      setRandomImageBlobs([]);
    } catch (error) {
      console.error('Error fetching image by ID:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-800 dark:to-black">
      <Header />
      
      <main className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Data Explorer</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Available Media</h2>
            <p>Videos: {availableMedia.video_count}</p>
            <p>Images: {availableMedia.image_count}</p>
          </div>

          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Random Media</h2>
            <button onClick={handleGetRandomVideo} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Get Random Video</button>
            <button onClick={handleGetRandomImages} className="bg-green-500 text-white px-4 py-2 rounded">Get Random Images</button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Get Media by ID</h2>
          <input
            type="text"
            value={mediaId}
            onChange={(e) => setMediaId(e.target.value)}
            placeholder="Enter media ID"
            className="border p-2 mr-2"
          />
          <button onClick={handleGetVideoById} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Get Video</button>
          <button onClick={handleGetImageById} className="bg-green-500 text-white px-4 py-2 rounded">Get Image</button>
        </div>

        {selectedVideoBlob && (
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Selected Video</h2>
            <video src={selectedVideoBlob} controls className="w-full" />
          </div>
        )}

        {selectedImageBlob && (
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Selected Image</h2>
            <img src={selectedImageBlob} alt="Selected image" className="w-full h-auto" />
          </div>
        )}

        {randomVideoBlob && !selectedVideoBlob && (
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Random Video</h2>
            <video src={randomVideoBlob} controls className="w-full" />
          </div>
        )}

        {randomImageBlobs.length > 0 && !selectedImageBlob && (
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Random Images</h2>
            <div className="grid grid-cols-3 gap-4">
              {randomImageBlobs.map((blob, index) => (
                <img key={index} src={blob} alt={`Random image ${index + 1}`} className="w-full h-auto" />
              ))}
            </div>
          </div>
        )}
      </main>
      <Navbar />
      <Footer />
    </div>
  );
}