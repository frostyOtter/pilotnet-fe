"use client";
//The "use client" directive at the top of the file tells Next.js that this is a Client Component,
//allowing the use of React hooks and other client-side features.
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DataPage() {
  const [availableMedia, setAvailableMedia] = useState({ videos: [], images: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/py/data/available-media');
        const data = await response.json();
        setAvailableMedia(data);
      } catch (error) {
        console.error('Error fetching media data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-800 dark:to-black">
      <Header />
      <Navbar />
      
      <main className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Data Explorer</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Videos Section */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Available Videos</h2>
            {availableMedia.videos.length > 0 ? (
              <ul className="list-disc list-inside">
                {availableMedia.videos.map((video, index) => (
                  <li key={index} className="mb-2">{video}</li>
                ))}
              </ul>
            ) : (
              <p>No videos available.</p>
            )}
          </div>

          {/* Images Section */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Available Images</h2>
            {availableMedia.images.length > 0 ? (
              <ul className="list-disc list-inside">
                {availableMedia.images.map((image, index) => (
                  <li key={index} className="mb-2">{image}</li>
                ))}
              </ul>
            ) : (
              <p>No images available.</p>
            )}
          </div>
        </div>

        {/* Data Upload Section */}
        <div className="mt-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Upload New Data</h2>
          <div className="mb-4">
            <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Video
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </div>
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}