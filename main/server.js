const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const dns = require("dns").promises; //cette commande qui remplace dig pour la verification pour faire des verifications dns

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ZAP API config , faut pas la changer apres !!!!!
const ZAP_API = "http://localhost:8081";
const ZAP_API_KEY = "q7p2qv6jl2l0rkj21jfm5ml0ea";

// mon domaines autorisés pour faire le test 
const CLE_DNS_PAR_DOMAINE = {
  "localhost": "shadowtrace-localkey-123" //c pas une clé perso  //dig -t txt domaine
};


const CLÉ_ATTENDUE = "shadowtrace-localkey-123";

async function verifierCleDNS(domaine) {
  if (domaine === "localhost") return true;

  try {
    const records = await dns.resolveTxt(domaine);
    const flat = records.flat().map(r => r.toString());

    console.log(`TXT DNS pour ${domaine} :`, flat);

    // Rechercher la clé
    return flat.includes(`shadowtrace-verification=${CLÉ_ATTENDUE}`);
  } catch (error) {
    console.error(`Erreur DNS pour ${domaine} :`, error.message);
    return false;
  }
}

// api zap 
app.get("/", (req, res) => {
  res.send("ShadowTrace API is running...");
});

// Route principale de scan
app.post("/scan", async (req, res) => {
  const { url } = req.body;
  console.log("Requête reçue pour scanner :", url);

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const domaine = new URL(url).hostname;
  const autorise = await verifierCleDNS(domaine);

  if (!autorise) {
    return res.status(403).json({
      error: "Accès refusé : Vous devez ajouter une entrée DNS TXT avec votre clé ShadowTrace."
    });
  }

  try {
    // lance Spider 
    await axios.get(`${ZAP_API}/JSON/spider/action/scan/`, {
      params: { apikey: ZAP_API_KEY, url, recurse: true }
    });

    // Attente du spider
    let spiderStatus = 0;
    while (spiderStatus < 100) {
      const { data } = await axios.get(`${ZAP_API}/JSON/spider/view/status/`, {
        params: { apikey: ZAP_API_KEY }
      });
      spiderStatus = parseInt(data.status);
      await new Promise(r => setTimeout(r, 1000));
    }

    // Scan actif zap
    const scanRes = await axios.get(`${ZAP_API}/JSON/ascan/action/scan/`, {
      params: {
        apikey: ZAP_API_KEY,
        url,
        recurse: true,
        scanPolicyName: "ShadowTrace"
      }
    });

    const scanId = scanRes.data.scan;

    // Attent scan actif
    let scanProgress = 0;
    while (scanProgress < 100) {
      const { data } = await axios.get(`${ZAP_API}/JSON/ascan/view/status/`, {
        params: { apikey: ZAP_API_KEY, scanId }
      });
      scanProgress = parseInt(data.status);
      await new Promise(r => setTimeout(r, 2000));
    }

    //Récupération des vulnérabilités trouves 
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

    console.log("Scan terminé - Vulnérabilités détectées :", vulnerabilities.length);
    res.json({ scanId, vulnerabilities });

  } catch (error) {
    console.error("Erreur ZAP Scan:", error.message);
    res.status(500).json({ error: "Scan failed", details: error.message });
  }
});

//Route génération PDF
app.post("/generate-report", async (req, res) => {
  const { vulnerabilities } = req.body;

  if (!vulnerabilities || vulnerabilities.length === 0) {
    return res.status(400).json({ error: "No vulnerabilities provided" });
  }

  try {
    // Génération dynamique d'un nom de fichier unique
    const timestamp = Date.now();
    const filePath = `security_report_${timestamp}.pdf`;

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Titre
    doc.fontSize(20).text("Rapport de Sécurité - ShadowTrace", { align: "center" });
    doc.moveDown();

    // Contenu des vulnérabilités
    vulnerabilities.forEach((vuln, index) => {
      doc.fontSize(14).text(`${index + 1}. ${vuln.name}`);
      doc.fontSize(12).text(`Risque : ${vuln.risk}`, { indent: 20 });
      doc.fontSize(12).text(`URL : ${vuln.url}`, { indent: 20 });
      doc.fontSize(12).text(`Description : ${vuln.description}`, { indent: 20 });
      doc.fontSize(12).text(`Solution : ${vuln.fix}`, { indent: 20 });
      doc.moveDown();
    });

    doc.end();

    // Attendre que le fichier soit écrit avant de l'envoyer
    writeStream.on("finish", () => {
      res.download(filePath, (err) => {
        if (err) {
          console.error("Erreur lors du téléchargement :", err);
          res.status(500).json({ error: "Failed to send the PDF file." });
        } else {
          fs.unlink(filePath, () => {}); // Supprime le fichier après envoi (optionnel)
        }
      });
    });
  } catch (err) {
    console.error("Erreur génération rapport :", err.message);
    res.status(500).json({ error: "Erreur serveur lors de la génération du PDF." });
  }
});


app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
