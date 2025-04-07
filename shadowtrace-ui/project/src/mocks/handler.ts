import { delay, http, HttpResponse } from 'msw'

export const handlers = [
  // 🔍 SCAN WEBSITE
  http.post('http://localhost:5000/scan', async () => {
    await delay()
    return HttpResponse.json({
      scanId: 'scan-123456',
      vulnerabilities: [
        {
          id: 1,
          name: 'Cross-Site Scripting (XSS)',
          riskLevel: 'High',
          description: 'Reflected XSS in search param',
          fix: 'Sanitize inputs and encode outputs',
        },
        {
          id: 2,
          name: 'SQL Injection',
          riskLevel: 'High',
          description: 'Possible SQL injection in login form',
          fix: 'Use prepared statements',
        },
        {
          id: 3,
          name: 'Insecure Cookies',
          riskLevel: 'Medium',
          description: 'Cookies missing Secure and HttpOnly flags',
          fix: 'Add Secure and HttpOnly attributes to all cookies',
        },
        {
          id: 4,
          name: 'Missing Security Headers',
          riskLevel: 'Medium',
          description: 'Content-Security-Policy header not set',
          fix: 'Add CSP, X-Content-Type-Options headers',
        },
        {
          id: 5,
          name: 'Information Disclosure',
          riskLevel: 'Low',
          description: 'Server version leaked in response headers',
          fix: 'Remove version info from headers',
        },
      ]
    })
  }),

  // 🧪 TEST XSS
  http.post('http://localhost:5000/test-xss', async () => {
    await delay()
    return HttpResponse.json({
      vulnerable: true,
      details: 'XSS vuln détectée dans le champ de recherche',
    })
  }),

  // 🧾 GENERATE REPORT
  http.post('http://localhost:5000/generate-report', async () => {
    await delay()
    return HttpResponse.json({
      reportUrl: '/mock-reports/shadowtrace-demo-report.pdf',
    })
  }),
]
