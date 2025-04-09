import { AlertTriangle, Shield } from 'lucide-react';
import React, { useState } from 'react';
import Header from './components/Header';
import LoadingIndicator from './components/LoadingIndicator';
import ScanForm from './components/ScanForm';
import VulnerabilityTable from './components/VulnerabilityTable';

function App() {
  const [url, setUrl] = useState<string>('');
  const [scanResults, setScanResults] = useState<any>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>('All');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleScan = async () => {
    if (!url) {
      setError("Please enter a URL to scan");
      return;
    }

    try {
      setError(null);
      setIsScanning(true);

      const response = await fetch('http://localhost:5000/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const results = await response.json();

      setScanResults({
        scanId: results.scanId,
        vulnerabilities: results.vulnerabilities || [],
      });
    } catch (err) {
      setError("Failed to scan website. Please try again.");
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!scanResults?.scanId) {
      setError("Please scan a website first");
      return;
    }

    try {
      setError(null);
      setIsGeneratingReport(true);

      const response = await fetch('http://localhost:5000/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vulnerabilities: scanResults.vulnerabilities }),
      });

      const data = await response.json();

      const a = document.createElement('a');
      a.href = data.reportUrl;
      a.download = 'shadowtrace_report.pdf';
      a.click();
    } catch (err) {
      setError("Failed to generate report. Please try again.");
      console.error(err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const filteredVulnerabilities = scanResults?.vulnerabilities?.filter((vuln: any) => {
    return riskFilter === 'All' || vuln.risk === riskFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <ScanForm
            url={url}
            onUrlChange={handleUrlChange}
            onScan={handleScan}
            onGenerateReport={handleGenerateReport}
            isScanning={isScanning}
            isGeneratingReport={isGeneratingReport}
            hasResults={!!scanResults}
          />

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              {error}
            </div>
          )}
        </div>

        {isScanning && (
          <LoadingIndicator message="Scanning website for vulnerabilities..." />
        )}

        {isGeneratingReport && (
          <LoadingIndicator message="Generating security report..." />
        )}

        {scanResults && !isScanning && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Shield size={24} className="mr-2 text-red-600" />
                Scan Results
              </h2>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none"
              >
                <option value="All">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {filteredVulnerabilities.length > 0 ? (
              <VulnerabilityTable vulnerabilities={filteredVulnerabilities} />
            ) : (
              <p className="text-gray-600">Aucune vulnérabilité détectée 🎉</p>
            )}
          </div>
        )}
      </main>

      <footer className="bg-black text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>ShadowTrace Security Scanner &copy; 2025</p>
          <p className="text-gray-400 text-sm mt-2">
            Powered by OWASP ZAP and Playwright
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
