const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const dns = require("dns").promises; // replaces 'dig' for DNS verification

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ZAP API config — do not change this!
const ZAP_API = "http://localhost:8081";
const ZAP_API_KEY = "q7p2qv6jl2l0rkj21jfm5ml0ea";

// Authorized domains for testing
const DNS_KEYS_BY_DOMAIN = {
  "localhost": "shadowtrace-localkey-123" // test key, not personal
};

const EXPECTED_KEY = "shadowtrace-localkey-123";

async function verifyDnsKey(domain) {
  if (domain === "localhost") return true;

  try {
    const records = await dns.resolveTxt(domain);
    const flat = records.flat().map(r => r.toString());

    console.log(`TXT DNS for ${domain}:`, flat);

    // Search for the verification key
    return flat.includes(`shadowtrace-verification=${EXPECTED_KEY}`);
  } catch (error) {
    console.error(`DNS error for ${domain}:`, error.message);
    return false;
  }
}

// ZAP API test route
app.get("/", (req, res) => {
  res.send("ShadowTrace API is running...");
});

// Main scan route
app.post("/scan", async (req, res) => {
  const { url } = req.body;
  console.log("Scan request received for:", url);

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const domain = new URL(url).hostname;
  const authorized = await verifyDnsKey(domain);

  if (!authorized) {
    return res.status(403).json({
      error: "Access denied: You must add a TXT DNS entry with your ShadowTrace key."
    });
  }

  try {
    // Start spidering
    await axios.get(`${ZAP_API}/JSON/spider/action/scan/`, {
      params: { apikey: ZAP_API_KEY, url, recurse: true }
    });

    // Wait for spider to complete
    let spiderStatus = 0;
    while (spiderStatus < 100) {
      const { data } = await axios.get(`${ZAP_API}/JSON/spider/view/status/`, {
        params: { apikey: ZAP_API_KEY }
      });
      spiderStatus = parseInt(data.status);
      await new Promise(r => setTimeout(r, 1000));
    }

    // Start active scan
    const scanRes = await axios.get(`${ZAP_API}/JSON/ascan/action/scan/`, {
      params: {
        apikey: ZAP_API_KEY,
        url,
        recurse: true,
        scanPolicyName: "ShadowTrace"
      }
    });

    const scanId = scanRes.data.scan;

    // Wait for active scan to complete
    let scanProgress = 0;
    while (scanProgress < 100) {
      const { data } = await axios.get(`${ZAP_API}/JSON/ascan/view/status/`, {
        params: { apikey: ZAP_API_KEY, scanId }
      });
      scanProgress = parseInt(data.status);
      await new Promise(r => setTimeout(r, 2000));
    }

    // Retrieve vulnerabilities
    const alertsRes = await axios.get(`${ZAP_API}/JSON/core/view/alerts/`, {
      params: { apikey: ZAP_API_KEY, baseurl: url }
    });

    const vulnerabilities = alertsRes.data.alerts.map((alert, index) => ({
      id: index + 1,
      name: alert.name,
      risk: alert.risk,
      url: alert.url,
      description: alert.description,
      fix: alert.solution
    }));

    console.log("Scan completed - Vulnerabilities found:", vulnerabilities.length);
    res.json({ scanId, vulnerabilities });

  } catch (error) {
    console.error("ZAP Scan error:", error.message);
    res.status(500).json({ error: "Scan failed", details: error.message });
  }
});

// PDF report generation route
app.post("/generate-report", async (req, res) => {
  const { vulnerabilities } = req.body;

  if (!vulnerabilities || vulnerabilities.length === 0) {
    return res.status(400).json({ error: "No vulnerabilities provided" });
  }

  try {
    const timestamp = Date.now();
    const filePath = `security_report_${timestamp}.pdf`;

    const doc = new PDFDocument({ margin: 40 });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // 🔺 Title
    doc.fontSize(22).fillColor('#e60000').text("Security Report - ShadowTrace", { align: "center" });
    doc.moveDown(1.5);

    // 🧩 Styled formatting
    vulnerabilities.forEach((vuln, index) => {
      // 🎨 Risk-level coloring
      let color = "#000000";
      switch (vuln.risk.toLowerCase()) {
        case "high": color = "#cc0000"; break;
        case "medium": color = "#e69100"; break;
        case "low": color = "#3366cc"; break;
        case "informational": color = "#999999"; break;
      }

      doc
        .fontSize(14)
        .fillColor('#000000')
        .text(`${index + 1}. ${vuln.name}`);

      doc
        .fontSize(12)
        .fillColor(color)
        .text(`Risk: ${vuln.risk}`, { indent: 20 });

      doc
        .fillColor('#000000')
        .text(`URL: ${vuln.url}`, { indent: 20 })
        .text(`Description: ${vuln.description}`, { indent: 20 })
        .text(`Solution: ${vuln.fix}`, { indent: 20 })
        .moveDown(1.2);
    });

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, (err) => {
        if (err) {
          console.error("Download error:", err);
          res.status(500).json({ error: "Failed to send the PDF file." });
        } else {
          fs.unlink(filePath, () => {}); // Delete file after sending
        }
      });
    });
  } catch (err) {
    console.error("Report generation error:", err.message);
    res.status(500).json({ error: "Server error during PDF generation." });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
