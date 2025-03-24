import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-3"></div>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;