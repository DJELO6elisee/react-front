import React, { useState } from 'react'; // Importer useState
import SidebarSection from './SidebarSection';
import { FiFileText, FiLink, FiDownload } from 'react-icons/fi';
import './SharedFilesList.css';

const SharedFilesList = ({ files, sectionTitle = "Fichiers Partagés" }) => {
  const [showAll, setShowAll] = useState(false); // État pour contrôler l'affichage

  if (!files || files.length === 0) {
    return (
      <SidebarSection title={sectionTitle}>
        <p className="empty-section-text">Aucun fichier partagé.</p>
      </SidebarSection>
    );
  }

  const getFileIcon = (fileType) => { // Renommer la prop pour plus de clarté
    if (!fileType) return <FiFileText />;
    if (fileType === 'link') return <FiLink />;
    if (fileType.startsWith('application/pdf')) return <FiFileText />;
    // Ajoutez d'autres types si besoin
    return <FiFileText />;
  };

  const handleToggleShowAll = () => {
    setShowAll(prevShowAll => !prevShowAll); // Basculer l'état
  };

  // Déterminer quels fichiers afficher
  const filesToDisplay = showAll ? files : files.slice(0, 4);

  return (
    <SidebarSection title={sectionTitle}>
      <ul className="shared-files-list">
        {filesToDisplay.map(file => (
          <li key={file.id} className="shared-file-item">
            <div className="file-icon">{getFileIcon(file.type)}</div>
            <div className="file-info">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-name" title={file.name}>
                {file.name}
              </a>
              {/* Afficher la source si elle existe */}
              {file.source && <span className="file-source">{file.source}</span>}
            </div>
            <a 
              href={file.url} 
              // L'attribut 'download' sans valeur suggère au navigateur de télécharger avec le nom original.
              // Si file.name existe, il peut être utilisé comme nom de fichier suggéré.
              download={file.type !== 'link' ? (file.name || true) : undefined} 
              className="file-action-btn" 
              title={file.type === 'link' ? "Ouvrir le lien" : "Télécharger"}
              target={file.type === 'link' ? "_blank" : "_self"} // Ouvrir les liens dans un nouvel onglet
              rel={file.type === 'link' ? "noopener noreferrer" : undefined}
            >
              {file.type === 'link' ? <FiLink size={16}/> : <FiDownload size={16} />}
            </a>
          </li>
        ))}
      </ul>
      {/* Afficher le bouton seulement s'il y a plus de 4 fichiers */}
      {files.length > 4 && (
        <button type="button" onClick={handleToggleShowAll} className="see-all-button">
          {showAll ? 'Voir moins' : `Voir tout (${files.length})`}
        </button>
      )}
    </SidebarSection>
  );
};

export default SharedFilesList;