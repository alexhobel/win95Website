import './PDFViewer.css';

const PDFViewer = ({ pdfPath }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'Site Information.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.open(pdfPath, '_blank');
  };

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-viewer-toolbar">
        <div className="pdf-viewer-toolbar-left">
          <button className="pdf-toolbar-button" title="Previous Page">
            ←
          </button>
          <button className="pdf-toolbar-button" title="Next Page">
            →
          </button>
          <div className="pdf-toolbar-separator"></div>
          <span className="pdf-toolbar-text">Page 1 of 1</span>
        </div>
        <div className="pdf-viewer-toolbar-right">
          <button className="pdf-toolbar-button" title="Print" onClick={handlePrint}>🖨️</button>
          <button className="pdf-toolbar-button" title="Download" onClick={handleDownload}>💾</button>
        </div>
      </div>
      <div className="pdf-viewer-content">
        <iframe
          src={pdfPath}
          className="pdf-iframe"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default PDFViewer;

