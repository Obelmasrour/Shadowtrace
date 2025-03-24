export interface Vulnerability {
  id: number;
  name: string;
  riskLevel: string;
  description: string;
  fix: string;
}

export interface ScanResult {
  scanId: string;
  vulnerabilities: Vulnerability[];
}

export interface XSSTestResult {
  vulnerable: boolean;
  details: string;
}