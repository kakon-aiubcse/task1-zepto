import React, { useEffect, useState } from 'react';

const FontData = () => {
  const [fonts, setFonts] = useState([]);
  useEffect(() => {
    const fetchFonts = () => {
      fetch('http://localhost:8080/api/fonts')
        .then((res) => res.json())
        .then((data) => setFonts(data.fonts || []))
        .catch((err) => console.error('Error fetching fonts:', err));
    };
  
    fetchFonts()
    const interval = setInterval(fetchFonts, 2000);
  
    return () => clearInterval(interval); 
  }, []);
  
  useEffect(() => {
    fetch('http://localhost:8080/api/fonts')
      .then((res) => res.json())
      .then((data) => setFonts(data.fonts || []))
      .catch((err) => console.error('Error fetching fonts:', err));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/delete-font/${id}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFonts((prevFonts) => prevFonts.filter((font) => font.id !== id));
        } else {
          console.error(data.error);
          alert('Error: ' + data.error);
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        alert('Something went wrong');
      });
  };
  

  return (
    <div className='flex flex-col ml-60 w-full pt-6 px-4'>
    <div className="flex flex-col items-start justify-start mt-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Fonts</h1>
      <h3 className="text-lg text-gray-500 mb-6">Browse more data</h3>
    </div>
  
    <div className='overflow-x-auto items-center justify-center w-full max-w-5xl'>
      <table className='min-w-full table-auto border-collapse'>
        <thead>
          <tr className='bg-gray-100 text-left text-sm font-semibold text-gray-700'>
            <th className='border-b border-gray-300 px-4 py-2'>ID</th>
            <th className='border-b border-gray-300 px-4 py-2'>Font Name</th>
            <th className='border-b border-gray-300 px-4 py-2'>File Path</th>
            <th className='border-b border-gray-300 px-4 py-2'>Created At</th>
            <th className='border-b border-gray-300 px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fonts.map((font) => (
            <tr key={font.id} className='text-sm text-gray-700 hover:bg-gray-50'>
              <td className='border-b border-gray-300 px-4 py-2'>{font.id}</td>
              <td className='border-b border-gray-300 px-4 py-2'>{font.name}</td>
              <td className='border-b border-gray-300 px-4 py-2'>{font.file_path}</td>
              <td className='border-b border-gray-300 px-4 py-2'>
                {new Date(font.created_at).toLocaleString()}
              </td>
              <td className='border-b border-gray-300 px-4 py-2'>
                <button
                  onClick={() => handleDelete(font.id)}
                  className='text-red-500 hover:underline'
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {fonts.length === 0 && (
            <tr>
              <td colSpan='5' className='text-center px-4 py-6 text-gray-500'>
                No font data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  
  );
};

export default FontData;
