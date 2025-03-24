import { ScanResult, XSSTestResult } from '../types';

// Base API URL - would be replaced with actual API endpoint
const API_BASE_URL = 'https://api.example.com';

// Function to scan a website for vulnerabilities
export const scanWebsite = async (url: string): Promise<ScanResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error scanning website:', error);
    throw error;
  }
};

// Function to test for XSS vulnerabilities
export const testXSS = async (url: string): Promise<XSSTestResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-xss`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error testing XSS:', error);
    throw error;
  }
};

// Function to generate a PDF report
export const generateReport = async (scanId: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scanId }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.reportUrl;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};