import React, { useState, useEffect } from 'react';

const DemoPage = () => {
  const [architectures, setArchitectures] = useState<string[]>([]);
  const [availableData, setAvailableData] = useState<string[]>([]);
  const [configFiles, setConfigFiles] = useState<string[]>([]);
  const [availableMedia, setAvailableMedia] = useState<{videos: string[], images: string[]}>({ videos: [], images: [] });

  useEffect(() => {
    const fetchData = async () => {
      const archResponse = await fetch('/api/py/demo/supported-architectures');
      const archData = await archResponse.json();
      setArchitectures(archData);

      const dataResponse = await fetch('/api/py/demo/available-data');
      const dataData = await dataResponse.json();
      setAvailableData(dataData);

      const configResponse = await fetch('/api/py/demo/config-files');
      const configData = await configResponse.json();
      setConfigFiles(configData);

      const mediaResponse = await fetch('/api/py/data/available-media');
      const mediaData = await mediaResponse.json();
      setAvailableMedia(mediaData);
    };

    fetchData();
  }, []);

  const handleConfigUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/py/demo/upload-config', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      // Refresh config files list
      const configResponse = await fetch('/api/py/demo/config-files');
      const configData = await configResponse.json();
      setConfigFiles(configData);
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/py/demo/upload-video', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      // Refresh available media list
      const mediaResponse = await fetch('/api/py/data/available-media');
      const mediaData = await mediaResponse.json();
      setAvailableMedia(mediaData);
    }
  };

  return (
    <div>
      <h1>Demo Model</h1>
      <div>
        <h2>Supported Architectures</h2>
        <ul>
          {architectures.map((arch, index) => (
            <li key={index}>{arch}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Available Data</h2>
        <ul>
          {availableData.map((data, index) => (
            <li key={index}>{data}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Config Files</h2>
        <ul>
          {configFiles.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Upload Config File</h2>
        <input type="file" onChange={handleConfigUpload} accept=".yml,.yaml" />
      </div>
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
      <div>
        <h2>Upload Video</h2>
        <input type="file" onChange={handleVideoUpload} accept="video/*" />
      </div>
    </div>
  );
};

export default DemoPage;