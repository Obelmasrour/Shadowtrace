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
const ZAP_API = "http://localhost:8081/JSON/ascan/action/scan/";


app.get("/", (req, res) => {
    res.send("ShadowTrace API is running...");
});

// Lancer un scan OWASP ZAP
app.post("/scan", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        const response = await axios.get(ZAP_API, { params: { url } });
        res.json({ scanId: response.data.scan });
    } catch (error) {
        res.status(500).json({ error: "Scan failed", details: error.message });
    }
});

// Exécuter un test XSS avec Playwright
app.post("/test-xss", async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url);
        await page.fill('input[name="username"]', '<script>alert("Hacked!")</script>');
        await page.fill('input[name="password"]', "password123");
        await page.click('button[type="submit"]');

        res.json({ success: true, message: "XSS test completed." });
    } catch (error) {
        res.status(500).json({ error: "Test failed", details: error.message });
    } finally {
        await browser.close();
    }
});

// Générer un rapport PDF
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
        doc.moveDown();
    });

    doc.end();

    res.download(filePath);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
