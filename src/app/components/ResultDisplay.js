'use client';

import { useState } from 'react';
import styles from './ResultDisplay.module.css';

export default function ResultDisplay({ data }) {
  const [copySuccess, setCopySuccess] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Group data by categories for better display
  const patientInfo = {};
  const hospitalInfo = {};
  const claimInfo = {};
  const otherInfo = {};

  Object.keys(data).forEach(key => {
    if (key.toLowerCase().includes('patient')) {
      patientInfo[key] = data[key];
    } else if (key.toLowerCase().includes('hospital')) {
      hospitalInfo[key] = data[key];
    } else if (key.toLowerCase().includes('claim')) {
      claimInfo[key] = data[key];
    } else {
      otherInfo[key] = data[key];
    }
  });

  const renderSection = (title, sectionData) => {
    if (Object.keys(sectionData).length === 0) return null;
    
    return (
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <div className={styles.grid}>
          {Object.keys(sectionData).map(key => (
            <div key={key} className={styles.gridItem}>
              <span className={styles.fieldName}>{key}: </span>
              <span className={styles.fieldValue}>{sectionData[key] || 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.resultContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Extracted Information</h2>
        <button
          onClick={copyToClipboard}
          className={styles.copyButton}
        >
          {copySuccess ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>
      
      <div className={styles.resultCard}>
        <div className={styles.resultContent}>
          {renderSection('Patient Information', patientInfo)}
          {renderSection('Hospital Information', hospitalInfo)}
          {renderSection('Claim Information', claimInfo)}
          {renderSection('Other Information', otherInfo)}
        </div>
        
        <div className={styles.jsonContainer}>
          <h3 className={styles.jsonTitle}>Raw JSON Data:</h3>
          <pre className={styles.jsonDisplay}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}