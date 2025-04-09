const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const { chromium } = require("playwright");
const PDFDocument = require("pdfkit");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ZAP API
const ZAP_API = "http://localhost:8081"; 
const ZAP_API_KEY = "q7p2qv6jl2l0rkj21jfm5ml0ea"; 
app.get("/", (req, res) => {
  res.send("ShadowTrace API is running...");
});

//Scan OWASP ZAP

app.post("/scan", async (req, res) => {
  const { url } = req.body;
console.log("Requête reçue pour scanner :", url);

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // 1. Spider
    await axios.get(`${ZAP_API}/JSON/spider/action/scan/`, {
      params: {
        apikey: ZAP_API_KEY,
        url,
        recurse: true,
      },
    });

    // 2. Attente Spider
    let spiderStatus = 0;
    while (spiderStatus < 100) {
      const { data } = await axios.get(`${ZAP_API}/JSON/spider/view/status/`, {
        params: { apikey: ZAP_API_KEY },
      });
      spiderStatus = parseInt(data.status);
      await new Promise((r) => setTimeout(r, 1000));
    }

    // 3. Scan Actif
    const scanRes = await axios.get(`${ZAP_API}/JSON/ascan/action/scan/`, {
      params: {
        apikey: ZAP_API_KEY,
        url,
        recurse: true,
        scanPolicyName: "ShadowTrace",
      },
    });

    const scanId = scanRes.data.scan;

    // 4. Attente Scan Actif
    let scanProgress = 0;
    while (scanProgress < 100) {
      const { data } = await axios.get(`${ZAP_API}/JSON/ascan/view/status/`, {
        params: { apikey: ZAP_API_KEY, scanId },
      });
      scanProgress = parseInt(data.status);
      await new Promise((r) => setTimeout(r, 2000));
    }

    // 5. Récupération des alertes
    const alertsRes = await axios.get(`${ZAP_API}/JSON/core/view/alerts/`, {
      params: {
        apikey: ZAP_API_KEY,
        baseurl: url,
      },
    });

    const vulnerabilities = alertsRes.data.alerts.map((alert) => ({
      name: alert.name,
      risk: alert.risk,
      url: alert.url,
      description: alert.description,
      solution: alert.solution,
    }));
    console.log("Scan terminé - Vulnérabilités détectées :", vulnerabilities.length);

    res.json({ scanId, vulnerabilities });
  } catch (error) {
    console.error("Erreur ZAP Scan:", error.message);
    res.status(500).json({ error: "Scan failed", details: error.message });
  }
});


//Rapport PDF
app.post("/generate-report", async (req, res) => {
  const { vulnerabilities } = req.body;

  if (!vulnerabilities || vulnerabilities.length === 0) {
    return res.status(400).json({ error: "No vulnerabilities provided" });
  }

  const doc = new PDFDocument();
  const filePath = "security_report.pdf";
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Rapport de Sécurité ShadowTrace", { align: "center" });
  doc.moveDown();

  vulnerabilities.forEach((vuln, index) => {
    doc.fontSize(14).text(`${index + 1}. ${vuln.name}`);
    doc.fontSize(12).text(`Risque: ${vuln.risk}`, { indent: 20 });
    doc.fontSize(12).text(`URL: ${vuln.url}`, { indent: 20 });
    doc.fontSize(12).text(`Description: ${vuln.description}`, { indent: 20 });
    doc.fontSize(12).text(`Solution: ${vuln.solution}`, { indent: 20 });
    doc.moveDown();
  });

  doc.end();

  res.download(filePath);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
