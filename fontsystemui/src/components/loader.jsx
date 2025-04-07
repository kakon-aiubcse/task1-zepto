import React, { useState, useRef } from 'react';

const Loader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (validateFiles(files)) {
      setSelectedFiles(files);
      setUploadStatus('');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (validateFiles(files)) {
      setSelectedFiles(files);
      setUploadStatus('');
    }
  };

  const validateFiles = (files) => {
    const invalidFiles = files.filter(file => !file.name.endsWith('.ttf'));
    if (invalidFiles.length > 0) {
      setUploadStatus('Only .ttf files are allowed');
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('font[]', file);  // 'font[]' to indicate multiple files
    });

    try {
      const response = await fetch('http://localhost:8080/api/upload-font', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadStatus('Upload successful');
      setTimeout(() => {
        setUploadStatus('');
      }, 3000);
      console.log(result);
      setSelectedFiles([]);  // Clear selected files after upload
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('Upload failed');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex items-center justify-center pt-4">
      <div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-500 rounded-xl p-8 w-full max-w-md text-center space-y-4 cursor-pointer"
      >
        <img className="w-10 h-10" src="/upload.png" alt="Upload Icon" />

        <span className="text-lg font-semibold text-gray-700">
          Click to upload or drag and drop
        </span>

        <label className="text-sm text-gray-500">
          Only .ttf files are allowed
        </label>

        <input
          type="file"
          multiple
          accept=".ttf"
          onChange={handleFileSelect}
          ref={fileInputRef}
          className="hidden"
        />

        {selectedFiles.length > 0 && (
          <>
            <div className="text-sm flex flex-col gap-2 items-center text-gray-600">
              <span>Selected Files:</span>
              <ul className="text-sm text-gray-600">
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation(); 
                handleUpload();
              }}
              className="px-2 py-1 bg-gray-500 text-white rounded-lg hover:bg-blue-900"
            >
              Upload
            </button>
          </>
        )}

        {uploadStatus && <p className="text-sm text-blue-900">{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default Loader;
