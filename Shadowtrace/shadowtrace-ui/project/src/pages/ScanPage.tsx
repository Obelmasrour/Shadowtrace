// ✅ ScanPage.tsx with dynamic title + favicon during scan
import { AlertTriangle, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import LoadingIndicator from '../components/LoadingIndicator';
import ScanForm from '../components/ScanForm';
import Topbar from '../components/TopBar';
import VulnerabilityTable from '../components/VulnerabilityTable';

const ScanPage = ({ darkMode, setDarkMode }) => {
  const [url, setUrl] = useState('');
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [error, setError] = useState(null);
  const [riskFilter, setRiskFilter] = useState('All');

  useEffect(() => {
    if (isScanning) {
      document.title = '🛡 Scanning... | ShadowTrace';
      const favicon = document.getElementById('favicon');
      if (favicon) favicon.setAttribute('href', '/spinner-icon.ico');
    } else {
      document.title = 'Scanner | ShadowTrace';
      const favicon = document.getElementById('favicon');
      if (favicon) favicon.setAttribute('href', '/favicon.ico');
    }
  }, [isScanning]);

  const handleUrlChange = (e) => setUrl(e.target.value);

  const handleScan = async () => {
    if (!url) {
      setError("Please enter a URL to scan");
      return;
    }

    try {
      setScanResults(null);
      setError(null);
      setIsScanning(true);

      const response = await fetch('http://localhost:5000/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (response.status === 403) {
        const { error } = await response.json();
        setError(error || "Unauthorized access for this domain.");
        return;
      }

      const results = await response.json();
      setScanResults({
        scanId: results.scanId,
        vulnerabilities: results.vulnerabilities || [],
      });
      toast.success("Scan completed successfully ✅");
    } catch {
      setError("Scan failed. Please try again.");
      toast.error("Scan error ❌");
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!scanResults?.vulnerabilities?.length) {
      setError("Please run a scan before generating a report.");
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

      if (!response.ok) throw new Error();

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shadowtrace_report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setError("Error generating the PDF report.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const filteredVulnerabilities = scanResults?.vulnerabilities?.filter((vuln) =>
    riskFilter === 'All' || vuln.risk === riskFilter
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="container mx-auto px-4 py-32">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
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
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              {error}
            </div>
          )}
        </div>

        {isScanning && <LoadingIndicator message="Scanning the website..." />}
        {isGeneratingReport && <LoadingIndicator message="Generating PDF report..." />}

        {scanResults && !isScanning && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Shield size={24} className="mr-2 text-red-600" />
                Scan Results
              </h2>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-1 rounded"
              >
                <option value="All">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {filteredVulnerabilities?.length > 0 ? (
              <VulnerabilityTable vulnerabilities={filteredVulnerabilities} />
            ) : (
              <p className="text-gray-600 dark:text-gray-300">No vulnerabilities detected 🎉</p>
            )}
          </div>
        )}
      </main>

      <footer className="bg-black text-white py-6 mt-10">
        <div className="text-center text-sm text-gray-400">
          ShadowTrace © 2025 — Powered by OWASP ZAP
        </div>
      </footer>
    </div>
  );
};

export default ScanPage;
