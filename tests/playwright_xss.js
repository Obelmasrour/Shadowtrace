const { chromium } = require("playwright");

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
