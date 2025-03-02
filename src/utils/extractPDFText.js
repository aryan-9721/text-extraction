// import { pdfjs } from 'react-pdf';

// Initialize PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Function to convert PDF file to Base64
export function convertPDFToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]); // Extract Base64 content
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Function to send Base64 PDF to Gemini for text extraction
// async function extractTextFromGemini(base64PDF) {
//   const apiKey = 'AIzaSyC3VH2C5PbqQwT81QSznSUxjmQzQZPlqZc'; // Replace with your actual API key
//   const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       contents: [{ parts: [{ inlineData: { mimeType: 'application/pdf', data: base64PDF } }] }]
//     }),
//   });

//   const data = await response.json();
//   return data?.candidates?.[0]?.content || 'No text extracted';
// }

// // Main function to handle file upload and text extraction
// export async function extractTextFromPDF(file) {
//   try {
//     const base64PDF = await convertPDFToBase64(file);
//     // console.log('base 64 pdf: ',base64PDF);
    
//     // const extractedText = await extractTextFromGemini(base64PDF);
//     return base64PDF;
//   } catch (error) {
//     console.error('Error extracting text:', error);
//     throw new Error('Failed to extract text from PDF: ' + error.message);
//   }
// }
