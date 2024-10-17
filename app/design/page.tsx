"use client";
//The "use client" directive at the top of the file tells Next.js that this is a Client Component,
//allowing the use of React hooks and other client-side features.
import React, { useState } from 'react';
import Header from '../components/Header'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DesignPage() {
  const [selectedSteeringModel, setSelectedSteeringModel] = useState('');
  const [selectedObjectDetectModel, setSelectedObjectDetectModel] = useState('');
  const [selectedMLPModel, setSelectedMLPModel] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedConfigFile, setSelectedConfigFile] = useState('');

  const handleStartTrain = () => {
    console.log('Starting training...');
    // Add logic for starting training
  };

  const handleStartDemo = () => {
    console.log('Starting demo...');
    // Add logic for starting demo
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-800 dark:to-black">
      <Header />
      <Navbar />
      
      <main className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Model Configuration</h1>

        {/* Model Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Steering Model */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Steering Model</h2>
            <select 
              className="w-full p-2 border rounded"
              value={selectedSteeringModel}
              onChange={(e) => setSelectedSteeringModel(e.target.value)}
            >
              <option value="">Select a model</option>
              <option value="Pilotnet">Pilotnet</option>
              <option value="ViT">ViT</option>
            </select>
          </div>

          {/* Object Detect Model */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Object Detect Model</h2>
            <select 
              className="w-full p-2 border rounded"
              value={selectedObjectDetectModel}
              onChange={(e) => setSelectedObjectDetectModel(e.target.value)}
            >
              <option value="">Select a model</option>
              <option value="RCNN">RCNN</option>
              <option value="...">...</option>
            </select>
          </div>

          {/* MLP Model */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">MLP Model</h2>
            <select 
              className="w-full p-2 border rounded"
              value={selectedMLPModel}
              onChange={(e) => setSelectedMLPModel(e.target.value)}
            >
              <option value="">Select a model</option>
              <option value="LSTM">LSTM</option>
            </select>
          </div>
        </div>

        {/* Configuration Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Dataset */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Dataset</h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="Train"
                  checked={selectedDataset === 'Train'}
                  onChange={() => setSelectedDataset('Train')}
                  className="form-radio"
                />
                <span>Train</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="Validation"
                  checked={selectedDataset === 'Validation'}
                  onChange={() => setSelectedDataset('Validation')}
                  className="form-radio"
                />
                <span>Validation</span>
              </label>
            </div>
          </div>

          {/* Config Files */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Config Files</h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="Training Colab"
                  checked={selectedConfigFile === 'Training Colab'}
                  onChange={() => setSelectedConfigFile('Training Colab')}
                  className="form-radio"
                />
                <span>Training Colab</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="Training kaggle"
                  checked={selectedConfigFile === 'Training kaggle'}
                  onChange={() => setSelectedConfigFile('Training kaggle')}
                  className="form-radio"
                />
                <span>Training kaggle</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleStartTrain}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Start Train
          </button>
          <button
            onClick={handleStartDemo}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Start Demo
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
// import React, { useState, useEffect } from 'react';

// const DesignPage = () => {
//   const [architectures, setArchitectures] = useState([]);
//   const [availableData, setAvailableData] = useState([]);
//   const [configFiles, setConfigFiles] = useState([]);
//   const [availableMedia, setAvailableMedia] = useState({ videos: [], images: [] });
//   const [selectedConfig, setSelectedConfig] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const archResponse = await fetch('/api/py/design/supported-architectures');
//       const archData = await archResponse.json();
//       setArchitectures(archData);

//       const dataResponse = await fetch('/api/py/design/available-data');
//       const dataData = await dataResponse.json();
//       setAvailableData(dataData);

//       const configResponse = await fetch('/api/py/design/config-files');
//       const configData = await configResponse.json();
//       setConfigFiles(configData);

//       const mediaResponse = await fetch('/api/py/data/available-media');
//       const mediaData = await mediaResponse.json();
//       setAvailableMedia(mediaData);
//     };

//     fetchData();
//   }, []);

//   const handleConfigUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) {
//       alert('No file selected.');
//       return;
//     }
  
//     const fileName = file.name;
//     if (!fileName) {
//       alert('File name is undefined.');
//       return;
//     }
  
//     const fileExtension = fileName.split('.').pop()?.toLowerCase();
//     if (fileExtension !== 'yaml' && fileExtension !== 'yml') {
//       alert('Please select a YAML or YML file.');
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append('file', file);
  
//     try {
//       const response = await fetch('/api/py/design/upload-config', {
//         method: 'POST',
//         body: formData,
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       const result = await response.json();
//       console.log(result);
  
//       // Refresh config files list
//       const configResponse = await fetch('/api/py/design/config-files');
//       if (!configResponse.ok) {
//         throw new Error(`HTTP error! status: ${configResponse.status}`);
//       }
  
//       const configData = await configResponse.json();
//       setConfigFiles(configData);
//     } catch (error) {
//       console.error('An error occurred:', error);
//       alert('An error occurred while uploading the file. Please try again.');
//     }
//   };

//   const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
  
//     // List of common video file extensions
//     const validVideoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
//     const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
//     if (!fileExtension || !validVideoExtensions.includes(fileExtension)) {
//       alert('Please select a valid video file.');
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append('file', file);
  
//     try {
//       const response = await fetch('/api/py/design/upload-video', {
//         method: 'POST',
//         body: formData,
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       const result = await response.json();
//       console.log(result);
  
//       // Refresh available media list
//       const mediaResponse = await fetch('/api/py/data/available-media');
//       if (!mediaResponse.ok) {
//         throw new Error(`HTTP error! status: ${mediaResponse.status}`);
//       }
  
//       const mediaData = await mediaResponse.json();
//       setAvailableMedia(mediaData);
//     } catch (error) {
//       console.error('An error occurred:', error);
//       alert('An error occurred while uploading the video. Please try again.');
//     }
//   };

//   const handleStartTrain = async () => {
//     if (selectedConfig) {
//       const response = await fetch('/api/py/design/start-train', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ config_file: selectedConfig }),
//       });
//       const result = await response.json();
//       console.log(result);
//     } else {
//       alert('Please select a configuration file before starting training.');
//     }
//   };

//   const handleStartDemo = async () => {
//     if (selectedConfig) {
//       const response = await fetch('/api/py/design/start-demo', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ config_file: selectedConfig }),
//       });
//       const result = await response.json();
//       console.log(result);
//     } else {
//       alert('Please select a configuration file before starting the demo.');
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Design Model</h1>
      
//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Supported Architectures</h2>
//         <ul className="list-disc list-inside">
//           {architectures.map((arch, index) => (
//             <li key={index}>{arch}</li>
//           ))}
//         </ul>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Available Data</h2>
//         <ul className="list-disc list-inside">
//           {availableData.map((data, index) => (
//             <li key={index}>{data}</li>
//           ))}
//         </ul>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Configuration Files</h2>
//         <select 
//           className="block w-full p-2 border rounded"
//           value={selectedConfig}
//           onChange={(e) => setSelectedConfig(e.target.value)}
//         >
//           <option value="">Select a configuration file</option>
//           {configFiles.map((file, index) => (
//             <option key={index} value={file}>{file}</option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Upload Configuration File</h2>
//         <input 
//           type="file" 
//           onChange={handleConfigUpload} 
//           accept=".yml,.yaml"
//           className="block w-full text-sm text-gray-500
//             file:mr-4 file:py-2 file:px-4
//             file:rounded-full file:border-0
//             file:text-sm file:font-semibold
//             file:bg-violet-50 file:text-violet-700
//             hover:file:bg-violet-100"
//         />
//       </div>

//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Available Media</h2>
//         <h3 className="text-xl font-semibold mb-2">Videos</h3>
//         <ul className="list-disc list-inside mb-4">
//           {availableMedia.videos.map((video, index) => (
//             <li key={index}>{video}</li>
//           ))}
//         </ul>
//         <h3 className="text-xl font-semibold mb-2">Images</h3>
//         <ul className="list-disc list-inside">
//           {availableMedia.images.map((image, index) => (
//             <li key={index}>{image}</li>
//           ))}
//         </ul>
//       </div>

//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Upload Video</h2>
//         <input 
//           type="file" 
//           onChange={handleVideoUpload} 
//           accept="video/*"
//           className="block w-full text-sm text-gray-500
//             file:mr-4 file:py-2 file:px-4
//             file:rounded-full file:border-0
//             file:text-sm file:font-semibold
//             file:bg-violet-50 file:text-violet-700
//             hover:file:bg-violet-100"
//         />
//       </div>

//       <div className="flex space-x-4">
//         <button 
//           onClick={handleStartTrain}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Start Training
//         </button>
//         <button 
//           onClick={handleStartDemo}
//           className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Start Demo
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DesignPage;