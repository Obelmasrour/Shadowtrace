import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { ScanResult, XSSTestResult } from '../types'

const API_BASE_URL = 'http://localhost:5000'

// === APPELS API ===
export const scanWebsite = async (url: string): Promise<ScanResult> => {
  const res = await fetch(`${API_BASE_URL}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error(`Erreur scan: ${res.status}`)
  return await res.json()
}

export const testXSS = async (url: string): Promise<XSSTestResult> => {
  const res = await fetch(`${API_BASE_URL}/test-xss`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error(`Erreur XSS: ${res.status}`)
  return await res.json()
}

export const generateReport = async (scanId: string): Promise<string> => {
  const res = await fetch(`${API_BASE_URL}/generate-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scanId }),
  })
  if (!res.ok) throw new Error(`Erreur PDF: ${res.status}`)
  const data = await res.json()
  return data.reportUrl
}

// === HOOKS TANSTACK QUERY ===

export const useScanMutation = (): UseMutationResult<ScanResult, Error, string> => {
  const queryClient = useQueryClient()
  return useMutation<ScanResult, Error, string>({
    mutationFn: scanWebsite,
    onSuccess: (data) => {
      queryClient.setQueryData(['vulnerabilities'], data.alerts)
    },
  })
}

export const useXSSMutation = (): UseMutationResult<XSSTestResult, Error, string> => {
  return useMutation<XSSTestResult, Error, string>({
    mutationFn: testXSS,
  })
}

export const useReportMutation = (): UseMutationResult<string, Error, string> => {
  return useMutation<string, Error, string>({
    mutationFn: generateReport,
  })
}
