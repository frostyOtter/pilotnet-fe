import React from 'react';

interface MediaControlPanelProps {
  availableMedia: {
    video_count: number;
    image_count: number;
  };
  onGetRandomVideo: () => void;
  onGetRandomImages: () => void;
  mediaId: string;
  onMediaIdChange: (id: string) => void;
  onGetVideoById: () => void;
  onGetImageById: () => void;
}

export const MediaControlPanel: React.FC<MediaControlPanelProps> = ({
  availableMedia,
  onGetRandomVideo,
  onGetRandomImages,
  mediaId,
  onMediaIdChange,
  onGetVideoById,
  onGetImageById
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Available Media</h2>
          <p>Videos: {availableMedia.video_count}</p>
          <p>Images: {availableMedia.image_count}</p>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Random Media</h2>
          <button 
            onClick={onGetRandomVideo} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 transition-colors"
          >
            Get Random Video
          </button>
          <button 
            onClick={onGetRandomImages} 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Get Random Images
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Get Media by ID</h2>
        <input
          type="text"
          value={mediaId}
          onChange={(e) => onMediaIdChange(e.target.value)}
          placeholder="Enter media ID"
          className="border p-2 mr-2 rounded"
        />
        <button 
          onClick={onGetVideoById} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 transition-colors"
        >
          Get Video
        </button>
        <button 
          onClick={onGetImageById} 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Get Image
        </button>
      </div>
    </>
  );
};