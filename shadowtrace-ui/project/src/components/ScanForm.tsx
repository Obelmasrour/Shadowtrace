import { FileText, Search, AlertTriangle, ClipboardCopy } from 'lucide-react';
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

// 🧠 Clé d'autorisation simulée (à lier plus tard à un vrai utilisateur)
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
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Website Security Scanner</h2>

      {/* 🔔 Alerte : clé DNS requise */}
      <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md flex items-start gap-2 text-sm">
        <AlertTriangle size={18} className="mt-0.5" />
        <span>
          <strong>Important :</strong> Avant d'effectuer un scan, vous devez ajouter une entrée DNS <code>TXT</code> dans le domaine cible avec la clé <code>shadowtrace-verification</code>. 
          Cette vérification est obligatoire pour s’assurer que vous avez l’autorisation de scanner ce site.
        </span>
      </div>

      {/* 📋 Clé visible et copiable */}
      <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md text-sm flex items-center justify-between">
        <span>
          <strong>Votre clé DNS à insérer :</strong>{' '}
          <code>{YOUR_VERIFICATION_KEY}</code>
        </span>
        <button
          onClick={handleCopy}
          className="ml-4 text-blue-700 hover:underline text-sm flex items-center"
        >
          <ClipboardCopy size={16} className="mr-1" /> Copier
        </button>
      </div>

      {/* 🌐 Formulaire URL */}
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

      {/* 🛠️ Boutons actions */}
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

        {/* Generate Report Button */}
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
