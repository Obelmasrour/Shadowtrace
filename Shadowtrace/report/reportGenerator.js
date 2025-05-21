const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateReport(scanResults) {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('scan_report.pdf'));

    doc.fontSize(20).text('ShadowTrace Security Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Vulnerabilities found: ${scanResults.length}`);

    scanResults.forEach((result, index) => {
        doc.moveDown();
        doc.text(`${index + 1}. ${result.name} - ${result.risk}`);
    });

    doc.end();
    console.log("PDF report generated.");
}

generateReport([{ name: "XSS", risk: "High" }]);
