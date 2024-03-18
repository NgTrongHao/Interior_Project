import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

function PdfViewer() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      setPdfFile(data);
      setPdfUrl('');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownload = () => {
    if (pdfFile) {
      const blob = new Blob([pdfFile], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <input
        type="text"
        value={pdfUrl}
        onChange={(event) => setPdfUrl(event.target.value)}
        placeholder="Enter PDF URL"
      />
      <button onClick={handleDownload}>Download PDF</button>
      {(pdfFile || pdfUrl) && (
        <div className="pdf-document">
          <Document
            file={pdfFile || pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document>
          <p className="page-info">Page {pageNumber} of {numPages}</p>
        </div>
      )}
    </div>
  );
}

export default PdfViewer;
