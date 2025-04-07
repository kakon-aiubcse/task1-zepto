import React, { useState, useRef } from 'react';

const Loader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadStatus('');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadStatus('');
    }
  };

  const validateFile = (file) => {
    if (file && file.name.endsWith('.ttf')) {
      return true;
    } else {
      setUploadStatus('Only .ttf files are allowed');
      return false;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('font', selectedFile);

    try {
      const response = await fetch('http://localhost:8080/api/upload-font', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadStatus('Upload successful');
      console.log(result);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading file:', error);
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
          accept=".ttf"
          onChange={handleFileSelect}
          ref={fileInputRef}
          className="hidden"
        />

        {selectedFile && (
          <>
            <div className="text-sm flex justify-between gap-4 items-center text-gray-600">Selected: {selectedFile.name}
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                handleUpload();
              }}
              className="px-2 py-1 bg-gray-500 text-white rounded-lg hover:bg-blue-900"
            >
              Upload
            </button>
            </div>
          </>
        )}

        {uploadStatus && <p className="text-sm text-blue-900">{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default Loader;
