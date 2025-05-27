// src/components/SidebarRight/SharedFilesList.js
import React from 'react';
import SidebarSection from './SidebarSection';
import { FiFileText, FiLink, FiDownload } from 'react-icons/fi';
import './SharedFilesList.css';

const SharedFilesList = ({ files, sectionTitle = "Fichiers Partagés" }) => {
  if (!files || files.length === 0) {
    return (
      <SidebarSection title={sectionTitle}>
        <p className="empty-section-text">Aucun fichier partagé.</p>
      </SidebarSection>
    );
  }

  const getFileIcon = (type) => {
    if (type === 'document') return <FiFileText />;
    if (type === 'link') return <FiLink />;
    return <FiFileText />;
  };

  const handleSeeAllFiles = () => {
    // Logique pour afficher tous les fichiers
    console.log("Afficher tous les fichiers pour ce salon.");
  };

  return (
    <SidebarSection title={sectionTitle}>
      <ul className="shared-files-list">
        {files.slice(0, 4).map(file => (
          <li key={file.id} className="shared-file-item">
            <div className="file-icon">{getFileIcon(file.type)}</div>
            <div className="file-info">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-name" title={file.name}>
                {file.name}
              </a>
              <span className="file-source">{file.source}</span>
            </div>
            <a href={file.url} download={file.type !== 'link'} className="file-action-btn" title={file.type === 'link' ? "Ouvrir le lien" : "Télécharger"}>
              {file.type === 'link' ? <FiLink size={16}/> : <FiDownload size={16} />}
            </a>
          </li>
        ))}
      </ul>
      {files.length > 4 && (
        <button type="button" onClick={handleSeeAllFiles} className="see-all-button">
          Voir tout ({files.length})
        </button>
      )}
    </SidebarSection>
  );
};

export default SharedFilesList;