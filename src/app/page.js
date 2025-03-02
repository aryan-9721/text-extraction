'use client';

import { useState } from 'react';
import PDFUploader from './components/PDFUploader';
import ResultDisplay from './components/ResultDisplay';
import styles from './page.module.css';

export default function Home() {
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExtractedData = (data) => {
    setExtractedData(data);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Medical Document Information Extractor</h1>
        <p className={styles.description}>Upload a PDF document to extract patient and hospital information using Gemini AI.</p>
        
        <PDFUploader 
          onDataExtracted={handleExtractedData}
          setIsLoading={setIsLoading}
          setError={setError}
        />
        
        {isLoading && (
          <div className={styles.loadingMessage}>
            <p>Processing PDF with Gemini AI... This may take a moment.</p>
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
          </div>
        )}
        
        {extractedData && !isLoading && (
          <ResultDisplay data={extractedData} />
        )}
      </div>
    </main>
  );
}