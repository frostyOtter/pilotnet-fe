import React, { useEffect, useRef, useState } from 'react';
import { TelemetryData, SpeedPredictionData } from '../types';


interface SynchronizedVideoPlayerProps<T extends TelemetryData | SpeedPredictionData> {
  videoUrl: string;
  websocket: WebSocket | null;
  demoType: 'steering' | 'speed';
  onUpdate: (data: T) => void;
  isInitialized: boolean;
}

const formatTimestamp = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const TOTAL_FRAMES = 601;
const VIDEO_DURATION = 20; // seconds
const DEFAULT_PLAYBACK_RATE = 0.5; // 50% of normal speed

const SynchronizedVideoPlayer = <T extends TelemetryData | SpeedPredictionData>({ 
  videoUrl, 
  websocket,
  demoType,
  onUpdate,
  isInitialized,
}: SynchronizedVideoPlayerProps<T>) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [predictions, setPredictions] = useState<T[]>([]);
  const [currentPredictionIndex, setCurrentPredictionIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [backendProcessingComplete, setBackendProcessingComplete] = useState<boolean>(false);

  // Calculate ideal frame time based on total frames and video duration
  const frameTime = VIDEO_DURATION / TOTAL_FRAMES;
  
  // Reset state when video changes
  useEffect(() => {
    setPredictions([]);
    setCurrentPredictionIndex(0);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setBackendProcessingComplete(false);
    
    // Set initial playback rate
    if (videoRef.current) {
      videoRef.current.playbackRate = DEFAULT_PLAYBACK_RATE;
    }
  }, [videoUrl]);

  // WebSocket message handling
  useEffect(() => {
    if (!websocket) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
        
      if (data.status === 'error') {
        console.error(`${demoType} demo error:`, data.message);
        return;
      }

      if (data.status === 'complete') {
        setBackendProcessingComplete(true);
        return;
      }

      if (data.status === 'streaming' || (data.status === 'initialized' && demoType === 'speed')) {
        setPredictions(prev => [...prev, data as T]);
      }
    };

    websocket.addEventListener('message', handleWebSocketMessage);

    return () => {
      websocket.removeEventListener('message', handleWebSocketMessage);
    };
  }, [websocket, demoType]);

  // Video metadata and time synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      video.playbackRate = DEFAULT_PLAYBACK_RATE;
    };

    const handleTimeUpdate = () => {
      if (!video || predictions.length === 0) return;

      const currentVideoTime = video.currentTime;
      setCurrentTime(currentVideoTime);
      
      // Calculate expected frame based on current time
      const expectedFrame = Math.floor(currentVideoTime / frameTime);
      
      // If we're ahead of predictions, pause the video
      if (expectedFrame > predictions.length - 1) {
        video.pause();
        setIsPlaying(false);
        return;
      }

      // Update prediction index based on current time
      if (expectedFrame !== currentPredictionIndex && expectedFrame < predictions.length) {
        setCurrentPredictionIndex(expectedFrame);
        onUpdate(predictions[expectedFrame]);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(duration);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [predictions, currentPredictionIndex, onUpdate, duration, frameTime]);

  // Playback control
  const handlePlayPause = () => {
    if (!isInitialized) return;
    
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      // Only play if we have predictions to show
      if (predictions.length > currentPredictionIndex) {
        video.play();
        setIsPlaying(true);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Calculate progress percentages
  const videoProgress = (currentTime / duration) * 100;
  const processingProgress = (predictions.length / TOTAL_FRAMES) * 100;

  return (
    <div className="relative rounded-lg overflow-hidden bg-black">
      <video 
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto"
        controls={false}
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress bars */}
        <div className="mb-2 space-y-1">
          {/* Video progress */}
          <div className="h-1 bg-gray-600 rounded overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
          {/* Processing progress */}
          <div className="h-1 bg-gray-600 rounded overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              disabled={!isInitialized}
              className={`px-4 py-2 rounded ${
                isInitialized 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-500 cursor-not-allowed'
              } text-white transition-colors`}
            >
              {!isInitialized 
                ? demoType === 'speed' ? 'Initializing...' : 'Processing...'
                : isPlaying 
                  ? 'Pause' 
                  : 'Play'}
            </button>
            
            <div className="text-white text-sm">
              {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
            </div>
          </div>
          
          <div className="flex flex-col items-end text-white text-sm">
            <div>
              Frame: {currentPredictionIndex + 1} / {TOTAL_FRAMES}
            </div>
            <div>
              Processed: {predictions.length} frames 
              {backendProcessingComplete ? ' (Complete)' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SynchronizedVideoPlayer;
