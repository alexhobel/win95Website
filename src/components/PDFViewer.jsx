import './PDFViewer.css';

const PDFViewer = ({ pdfPath }) => {


  return (
    <div className="pdf-viewer-container">

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

