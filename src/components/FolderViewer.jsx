import { useState } from 'react';
import './FolderViewer.css';

const FolderViewer = ({ files = [], onFileOpen }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileClick = (file) => {
    setSelectedFile(file.id);
    if (onFileOpen) {
      onFileOpen(file);
    }
  };

  const handleFileDoubleClick = (file) => {
    if (onFileOpen) {
      onFileOpen(file);
    }
  };

  return (
    <div className="folder-viewer-container">
      <div className="folder-toolbar">
        <div className="folder-address-bar">
          <span className="folder-label">Adresse:</span>
          <span className="folder-path">C:\Documents</span>
        </div>
      </div>
      <div className="folder-content">
        <div className="folder-items">
          {files.map((file) => (
            <div
              key={file.id}
              className={`folder-item ${selectedFile === file.id ? 'selected' : ''}`}
              onClick={() => handleFileClick(file)}
              onDoubleClick={() => handleFileDoubleClick(file)}
            >
              <div className="folder-item-icon">
                {file.icon || '📄'}
              </div>
              <div className="folder-item-label">{file.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="folder-status-bar">
        <span>{files.length} Objekt(e)</span>
      </div>
    </div>
  );
};

export default FolderViewer;

