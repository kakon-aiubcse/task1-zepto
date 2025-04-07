import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center pt-4 ">
      <div className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-500 rounded-xl p-8 w-full max-w-md text-center space-y-4">
        
       
        <img className="w-10 h-10 text-green-500" src='/upload.png'/>

        
        <span className="text-lg font-semibold text-gray-700">
          Click to upload or drag and drop
        </span>

     
        <label className="text-sm text-gray-500">
          Only .ttf files are allowed
        </label>

      </div>
    </div>
  );
};

export default Loader;

