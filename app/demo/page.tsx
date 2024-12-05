"use client"
import React, { useState } from 'react';
import Header from '@/app/components/Header';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const DemoPage = () => {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const extracted = extractVideoId(url);
    
    if (!extracted) {
      setError('Invalid YouTube URL');
      return;
    }

    setVideoId(extracted);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-800 dark:to-black">
      <Header />
      
      <main className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-center">YouTube Demo</h1>

        {/* URL Input Form */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube URL"
                className="flex-1 border dark:border-gray-600 p-2 rounded bg-white dark:bg-zinc-700 dark:text-white"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load Video'}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </form>
        </div>

        {/* Video Display */}
        {videoId && (
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* Demo Buttons */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              <button
                onClick={() => console.log('Start Steering Demo')}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Start Steering Demo
              </button>
              <button
                onClick={() => console.log('Start Speed Demo')}
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Start Speed Demo
              </button>
              <button
                onClick={() => console.log('Start Combined Demo')}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Start Combined Demo
              </button>
            </div>
          </div>
        )}

        {/* Instructions or Additional Info */}
        {!videoId && (
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Enter a YouTube URL above to start the demo.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: youtube.com/watch?v=..., youtu.be/...
            </p>
          </div>
        )}
      </main>

      <Navbar />
      <Footer />
    </div>
  );
};

export default DemoPage;