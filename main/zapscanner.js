const axios = require("axios");

const ZAP_API = "http://localhost:8080/JSON/ascan/action/scan/";

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
