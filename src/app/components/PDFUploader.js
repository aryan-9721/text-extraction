'use client';

import { useState } from 'react';
import { convertPDFToBase64 } from '../../utils/extractPDFText';
import { extractFieldsWithGemini } from '../../utils/geminiExtractor';
import styles from './PDFUploader.module.css';

export default function PDFUploader({ onDataExtracted, setIsLoading, setError }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [apiKey, setApiKey] = useState('AIzaSyC3VH2C5PbqQwT81QSznSUxjmQzQZPlqZc');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    if (!apiKey) {
      setError('Please enter your Gemini API key.');
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Extract text from PDF
      const pdfText = await convertPDFToBase64 (selectedFile);
      
      // Use Gemini to extract structured data
      const extractedData = await extractFieldsWithGemini(pdfText, apiKey);
      
      onDataExtracted(extractedData);
    } catch (error) {
      console.error('Extraction error:', error);
      setError(error.message || 'An error occurred while processing the file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.uploaderContainer}>
      <form onSubmit={handleSubmit}>
        
        <div className={styles.formGroup}>
          <label htmlFor="pdfUpload" className={styles.label}>
            Select PDF Document
          </label>
          <input
            type="file"
            id="pdfUpload"
            accept="application/pdf"
            onChange={handleFileChange}
            className={styles.fileInput}
            required
          />
          <p className={styles.helperText}>
            Only PDF files are accepted.
          </p>
        </div>
        
        <button type="submit" className={styles.submitButton}>
          Extract Information
        </button>
      </form>
    </div>
  );
}