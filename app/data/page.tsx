import React, { useState, useEffect } from 'react';

const DataPage = () => {
  const [availableMedia, setAvailableMedia] = useState<{videos: string[], images: string[]}>({ videos: [], images: [] });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/py/data/available-media');
      const data = await response.json();
      setAvailableMedia(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Data Explorer</h1>
      <div>
        <h2>Available Media</h2>
        <h3>Videos</h3>
        <ul>
          {availableMedia.videos.map((video, index) => (
            <li key={index}>{video}</li>
          ))}
        </ul>
        <h3>Images</h3>
        <ul>
          {availableMedia.images.map((image, index) => (
            <li key={index}>{image}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataPage;