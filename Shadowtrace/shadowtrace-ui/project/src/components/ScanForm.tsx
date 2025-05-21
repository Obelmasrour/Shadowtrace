import { AlertTriangle, ClipboardCopy, FileText, Search } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

interface ScanFormProps {
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScan: () => void;
  onGenerateReport: () => void;
  isScanning: boolean;
  isGeneratingReport: boolean;
  hasResults: boolean;
}

const YOUR_VERIFICATION_KEY = "shadowtrace-verification=shadowtrace-localkey-123";

const ScanForm: React.FC<ScanFormProps> = ({
  url,
  onUrlChange,
  onScan,
  onGenerateReport,
  isScanning,
  isGeneratingReport,
  hasResults,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(YOUR_VERIFICATION_KEY);
    toast.success("Key copied to clipboard ✅");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Website Security Scanner</h2>

      <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 dark:bg-yellow-100/10 dark:text-yellow-300 border border-yellow-200 rounded-md flex items-start gap-2 text-sm">
        <AlertTriangle size={18} className="mt-0.5" />
        <span>
          <strong>Important:</strong> Before running a scan, you must add a <code>TXT</code> DNS entry in the target domain with the <code>shadowtrace-verification</code> key.
        </span>
      </div>

      <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 p-3 rounded-md text-sm flex items-center justify-between">
        <span>
          <strong>Your DNS key:</strong> <code>{YOUR_VERIFICATION_KEY}</code>
        </span>
        <button onClick={handleCopy} className="ml-4 text-blue-700 dark:text-blue-300 hover:underline text-sm flex items-center">
          <ClipboardCopy size={16} className="mr-1" /> Copy
        </button>
      </div>

      <div className="mb-4">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
          Target URL
        </label>
        <input
          type="url"
          id="url"
          placeholder="http://localhost:8080"
          value={url}
          onChange={onUrlChange}
          disabled={isScanning || isGeneratingReport}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-3">
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
