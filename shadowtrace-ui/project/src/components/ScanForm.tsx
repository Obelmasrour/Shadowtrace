import { FileText, Search } from 'lucide-react';
import React from 'react';

interface ScanFormProps {
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScan: () => void;
  onGenerateReport: () => void;
  isScanning: boolean;
  isGeneratingReport: boolean;
  hasResults: boolean;
}

const ScanForm: React.FC<ScanFormProps> = ({
  url,
  onUrlChange,
  onScan,
  onGenerateReport,
  isScanning,
  isGeneratingReport,
  hasResults,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Website Security Scanner</h2>

      <div className="mb-4">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Target URL
        </label>
        <input
          type="url"
          id="url"
          placeholder="http://localhost:8080"
          value={url}
          onChange={onUrlChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={isScanning || isGeneratingReport}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Scan Button */}
        <button
          onClick={onScan}
          disabled={isScanning || isGeneratingReport}
          className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
            isScanning ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          <Search size={18} className="mr-2" />
          {isScanning ? 'Scanning...' : 'Scan Website'}
        </button>

        {/* PDF Report Button */}
        <button
          onClick={onGenerateReport}
          disabled={!hasResults || isScanning || isGeneratingReport}
          className={`flex items-center px-4 py-2 rounded-md text-white font-medium ${
            !hasResults || isGeneratingReport
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-800'
          }`}
        >
          <FileText size={18} className="mr-2" />
          {isGeneratingReport ? 'Generating...' : 'Generate PDF Report'}
        </button>
      </div>
    </div>
  );
};

export default ScanForm;
