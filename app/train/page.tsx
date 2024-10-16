import React, { useState, useEffect } from 'react';

const TrainPage = () => {
  const [architectures, setArchitectures] = useState<string[]>([]);
  const [availableData, setAvailableData] = useState<string[]>([]);
  const [configFiles, setConfigFiles] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const archResponse = await fetch('/api/py/train/supported-architectures');
      const archData = await archResponse.json();
      setArchitectures(archData);

      const dataResponse = await fetch('/api/py/train/available-data');
      const dataData = await dataResponse.json();
      setAvailableData(dataData);

      const configResponse = await fetch('/api/py/train/config-files');
      const configData = await configResponse.json();
      setConfigFiles(configData);
    };

    fetchData();
  }, []);

  const handleConfigUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/py/train/upload-config', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      // Refresh config files list
      const configResponse = await fetch('/api/py/train/config-files');
      const configData = await configResponse.json();
      setConfigFiles(configData);
    }
  };

  return (
    <div>
      <h1>Train Model</h1>
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
    </div>
  );
};

export default TrainPage;