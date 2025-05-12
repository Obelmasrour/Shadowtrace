const axios = require("axios");

const ZAP_API = "http://localhost:8081"; 
const API_KEY = "lnocp1fl2rklhn3a8ivpgh9h6s"; 

const target = "http://localhost:8080"; 
async function spiderSite() {
  try {
    const res = await axios.get(`${ZAP_API}/JSON/spider/action/scan/`, {
      params: {
        apikey: API_KEY,
        url: target,
        recurse: true
      }
    });

    console.log("🕷️ Spider lancé ! ID :", res.data.scan);
  } catch (err) {
    console.error("Erreur Spider :", err.message);
  }
}

async function activeScan() {
  try {
    const res = await axios.get(`${ZAP_API}/JSON/ascan/action/scan/`, {
      params: {
        apikey: API_KEY,
        url: target,
        recurse: true
      }
    });

    console.log("Active Scan lancé ! ID :", res.data.scan);
  } catch (err) {
    console.error("Erreur Active Scan :", err.message);
  }
}

module.exports = {
  spiderSite,
  activeScan
};
