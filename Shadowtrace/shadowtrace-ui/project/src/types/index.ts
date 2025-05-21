export interface Vulnerability {
  alert: string
  risk: string
  url?: string
  description?: string
  solution?: string
}

export interface ScanResult {
  scanId: string
  alerts: Vulnerability[]
}

export interface XSSTestResult {
  success: boolean
  message: string
}
