import React, { useState, useCallback, useEffect } from 'react';
import Lottie from 'lottie-react';
import { useDropzone } from 'react-dropzone';
import resume_animation from './resume_animation.json'; // Update with the actual path
import axios from 'axios';

const App = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  // const [userId, setUserId] = useState(null);
  const userId = localStorage.getItem('userId');


  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(file)
    console.log(userId)
    if (file) {
      const formData = new FormData();
      formData.append('resume', file); 
      formData.append('userId', userId);
  
      try {
        const response = await axios.post('http://localhost:5000/api/upload-resume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setMessage('Resume uploaded successfully!');
      } catch (err) {
        console.error('Error uploading resume:', err);
        setMessage('Error uploading resume. Please try again.');
      }
    } else {
      setMessage('Please select a file to upload.');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Animation */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Lottie animationData={resume_animation} loop={true} className="w-full h-full object-cover" />
      </div>

      
      <div className="relative z-10 flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-customStart">Upload Your Resume</h2>
          <div
            {...getRootProps()}
            className={`flex justify-center items-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
            `}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-gray-700">Drop the file here...</p>
            ) : (
              <p className="text-gray-700">Drag and drop your resume here, or click to browse</p>
            )}
          </div>
          {file && (
            <div className="mt-4 text-center">
              <p className="text-gray-700">Selected file: {file.name}</p>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:shadow-outline mt-6"
          >
            Upload
          </button>
          {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default App;