// src/components/SidebarRight/MediaGrid.js
import React from 'react';
import SidebarSection from './SidebarSection';
import './MediaGrid.css';

const MediaGrid = ({ mediaItems }) => {
  if (!mediaItems || mediaItems.length === 0) {
    return (
      <SidebarSection title="Média">
        <p className="empty-section-text">Aucun média partagé.</p>
      </SidebarSection>
    );
  }

  const handleSeeAllMedia = () => {
    // Logique pour afficher tous les médias (par ex. ouvrir un modal, naviguer vers une autre page)
    console.log("Afficher tous les médias pour ce salon.");
  };

  return (
    <SidebarSection title="Média">
      <div className="media-grid">
        {mediaItems.slice(0, 6).map(item => (
          <div key={item.id} className="media-item" title={item.name}>
            {item.type === 'image' && <img src={item.url} alt={item.name} />}
          </div>
        ))}
      </div>
      {mediaItems.length > 6 && (
        <button type="button" onClick={handleSeeAllMedia} className="see-all-button">
          Voir tout ({mediaItems.length})
        </button>
      )}
    </SidebarSection>
  );
};

export default MediaGrid;