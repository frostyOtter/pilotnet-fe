import React from 'react';
import SteeringDemoButton from './SteeringDemoButton';

interface MediaDisplayProps {
  selectedVideoBlob: string | null;
  selectedImageBlob: string | null;
  randomVideoBlob: string | null;
  randomImageBlobs: string[];
  onSteeringDemo: () => void;
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({
  selectedVideoBlob,
  selectedImageBlob,
  randomVideoBlob,
  randomImageBlobs,
  onSteeringDemo
}) => {
  return (
    <>
      {selectedVideoBlob && (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Selected Video</h2>
          <video src={selectedVideoBlob} controls className="w-full" />
          <SteeringDemoButton onClick={onSteeringDemo} />
        </div>
      )}

      {selectedImageBlob && (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Selected Image</h2>
          <img src={selectedImageBlob} alt="Selected image" className="w-full h-auto" />
          <SteeringDemoButton onClick={onSteeringDemo} />
        </div>
      )}

      {randomVideoBlob && !selectedVideoBlob && (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Random Video</h2>
          <video src={randomVideoBlob} controls className="w-full" />
          <SteeringDemoButton onClick={onSteeringDemo} />
        </div>
      )}

      {randomImageBlobs.length > 0 && !selectedImageBlob && (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Random Images</h2>
          <div className="grid grid-cols-3 gap-4">
            {randomImageBlobs.map((blob, index) => (
              <div key={index} className="flex flex-col items-center">
                <img src={blob} alt={`Random image ${index + 1}`} className="w-full h-auto" />
                <SteeringDemoButton onClick={onSteeringDemo} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};