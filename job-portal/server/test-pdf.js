const fs = require('fs');
const path = require('path');
const { generateCertificatePDF } = require('./utils/pdfGenerator');

const dummyCertificate = {
  certificateId: 'CC-2026-F9812A',
  studentName: 'Fatima Ali',
  courseName: 'Full Stack Web Development Boot Camp',
  instructorName: 'Engr. John Doe',
  issueDate: new Date(),
  hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
};

const verifyUrl = 'http://localhost:5173/verify/CC-2026-F9812A';

async function test() {
  try {
    console.log('Generating dummy certificate PDF...');
    const buffer = await generateCertificatePDF(dummyCertificate, verifyUrl);
    const outputPath = path.join(__dirname, 'test_cert_fixed.pdf');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Certificate PDF generated successfully! Saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

test();
