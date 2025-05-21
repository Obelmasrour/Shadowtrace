import React from 'react';
import { PulseLoader } from 'react-spinners';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <PulseLoader color="#ef4444" />
      <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
