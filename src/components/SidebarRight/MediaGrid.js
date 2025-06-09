// src/components/SidebarRight/MediaGrid.js
import React from 'react';
import SidebarSection from './SidebarSection';
import './MediaGrid.css';

// Dans MediaGrid.js
const MediaGrid = ({ mediaItems }) => {
  console.log('FRONTEND (MediaGrid) - mediaItems reçus (count):', mediaItems?.length); // LOG 1
  if (mediaItems && mediaItems.length > 0) {
    console.log('FRONTEND (MediaGrid) - Premier mediaItem:', JSON.stringify(mediaItems[0], null, 2)); // LOG 1.1
  }

  if (!mediaItems || mediaItems.length === 0) { /* ... */ }

  return (
    <SidebarSection title="Média">
      <div className="media-grid">
        {mediaItems.slice(0, 6).map(item => {
          console.log('FRONTEND (MediaGrid) - Traitement item pour map:', JSON.stringify(item, null, 2)); // LOG 2
          const isImageType = item.type && item.type.startsWith('image/');
          console.log(`FRONTEND (MediaGrid) - Item ID: ${item.id}, Type: ${item.type}, IsImageType: ${isImageType}, URL: ${item.url}`); // LOG 2.1

          return (
            <div key={item.id} className="media-item" title={item.name}>
              {isImageType && item.url ? (
                <img 
                  src={item.url} 
                  alt={item.name} 
                  onError={(e) => {
                    console.error('FRONTEND ERREUR (MediaGrid img): Échec du chargement de l\'image.', 
                                  { src: item.url, alt: item.name, errorEvent: e });
                    e.target.style.display = 'none'; // Optionnel: cacher l'icône d'image cassée
                    // Vous pourriez afficher un placeholder d'erreur ici
                  }} 
                />
              ) : (
                <span style={{fontSize: '10px', color: 'red', padding: '5px'}}>
                  Média non image ou URL manquante (Type: {item.type || 'N/A'})
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* ... */}
    </SidebarSection>
  );
};

export default MediaGrid;