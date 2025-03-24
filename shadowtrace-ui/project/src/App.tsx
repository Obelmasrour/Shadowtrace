import React, { useState } from 'react';
import { AlertTriangle, FileText, Search, Shield, ShieldAlert } from 'lucide-react';
import ScanForm from './components/ScanForm';
import VulnerabilityTable from './components/VulnerabilityTable';
import LoadingIndicator from './components/LoadingIndicator';
import Header from './components/Header';

// Mock API functions (to be replaced with actual API calls)
const mockScanWebsite = async (url: string): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock response data
  return {
    scanId: "scan-" + Math.random().toString(36).substr(2, 9),
    vulnerabilities: [
      {
        id: 1,
        name: "Cross-Site Scripting (XSS)",
        riskLevel: "High",
        description: "Reflected XSS vulnerability found in search parameter",
        fix: "Implement proper input validation and output encoding"
      },
      {
        id: 2,
        name: "SQL Injection",
        riskLevel: "High",
        description: "Potential SQL injection in login form",
        fix: "Use parameterized queries or prepared statements"
      },
      {
        id: 3,
        name: "Missing HTTP Security Headers",
        riskLevel: "Medium",
        description: "Content-Security-Policy header is not set",
        fix: "Configure proper security headers in server responses"
      },
      {
        id: 4,
        name: "Insecure Cookies",
        riskLevel: "Medium",
        description: "Cookies missing secure and httpOnly flags",
        fix: "Set secure and httpOnly flags for all sensitive cookies"
      },
      {
        id: 5,
        name: "Information Disclosure",
        riskLevel: "Low",
        description: "Server version information exposed in headers",
        fix: "Configure server to hide version information"
      }
    ]
  };
};

const mockTestXSS = async (url: string): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    vulnerable: true,
    details: "XSS vulnerability detected in the search parameter. The application reflects user input without proper sanitization."
  };
};

const mockGenerateReport = async (scanResults: any): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return "report-" + Math.random().toString(36).substr(2, 9) + ".pdf";
};

function App() {
  const [url, setUrl] = useState<string>('');
  const [scanResults, setScanResults] = useState<any>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isTestingXSS, setIsTestingXSS] = useState<boolean>(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [xssResults, setXssResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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
      const results = await mockScanWebsite(url);
      setScanResults(results);
    } catch (err) {
      setError("Failed to scan website. Please try again.");
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleTestXSS = async () => {
    if (!url) {
      setError("Please enter a URL to test");
      return;
    }
    
    try {
      setError(null);
      setIsTestingXSS(true);
      const results = await mockTestXSS(url);
      setXssResults(results);
    } catch (err) {
      setError("Failed to test for XSS vulnerabilities. Please try again.");
      console.error(err);
    } finally {
      setIsTestingXSS(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!scanResults) {
      setError("Please scan a website first");
      return;
    }
    
    try {
      setError(null);
      setIsGeneratingReport(true);
      const reportUrl = await mockGenerateReport(scanResults);
      
      // In a real application, this would trigger a download
      alert(`Report generated: ${reportUrl}`);
    } catch (err) {
      setError("Failed to generate report. Please try again.");
      console.error(err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <ScanForm 
            url={url} 
            onUrlChange={handleUrlChange} 
            onScan={handleScan} 
            onTestXSS={handleTestXSS}
            onGenerateReport={handleGenerateReport}
            isScanning={isScanning}
            isTestingXSS={isTestingXSS}
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
        
        {isTestingXSS && (
          <LoadingIndicator message="Testing for XSS vulnerabilities..." />
        )}
        
        {isGeneratingReport && (
          <LoadingIndicator message="Generating security report..." />
        )}
        
        {xssResults && !isTestingXSS && (
          <div className={`mb-8 p-4 rounded-md ${xssResults.vulnerable ? 'bg-red-100' : 'bg-green-100'}`}>
            <h3 className={`text-lg font-semibold mb-2 flex items-center ${xssResults.vulnerable ? 'text-red-700' : 'text-green-700'}`}>
              <ShieldAlert size={20} className="mr-2" />
              XSS Test Results
            </h3>
            <p className={xssResults.vulnerable ? 'text-red-700' : 'text-green-700'}>
              {xssResults.details}
            </p>
          </div>
        )}
        
        {scanResults && !isScanning && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Shield size={24} className="mr-2 text-red-600" />
              Scan Results
            </h2>
            <VulnerabilityTable vulnerabilities={scanResults.vulnerabilities} />
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