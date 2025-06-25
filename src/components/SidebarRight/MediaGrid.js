// src/components/SidebarRight/MediaGrid.js
import React, { useState } from 'react'; // Importer useState
import SidebarSection from './SidebarSection';
// Importer les icônes pour les boutons "Voir tout/moins"
import { FiFilm, FiFile, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import './MediaGrid.css';

const INITIAL_DISPLAY_COUNT = 6; // Nombre d'items à afficher initialement

const MediaGrid = ({ mediaItems }) => {
  const [showAll, setShowAll] = useState(false); // État pour gérer l'affichage

  // console.log('FRONTEND (MediaGrid) - mediaItems reçus (count):', mediaItems?.length);
  // if (mediaItems && mediaItems.length > 0) {
  //   console.log('FRONTEND (MediaGrid) - Premier mediaItem:', JSON.stringify(mediaItems[0], null, 2));
  // }

  if (!mediaItems || mediaItems.length === 0) {
    return (
      <SidebarSection title="Média (Images & Vidéos)">
        <p className="empty-section-text">Aucun média partagé.</p>
      </SidebarSection>
    );
  }

  const toggleShowAll = () => {
    setShowAll(prevShowAll => !prevShowAll);
  };

  // Déterminer les items à afficher en fonction de l'état showAll
  const itemsToDisplay = showAll ? mediaItems : mediaItems.slice(0, INITIAL_DISPLAY_COUNT);

  const renderMediaPreview = (item) => {
    if (!item || !item.type || !item.url) {
      return <div className="media-placeholder"><FiFile size={24} title="Média invalide ou incomplet"/></div>;
    }

    if (item.type.startsWith('image/')) {
      return (
        <img 
          src={item.url} 
          alt={item.name || 'Média image'} 
          onError={(e) => {
            console.error('FRONTEND ERREUR (MediaGrid img): Échec chargement image.', { src: item.url, name: item.name });
            const parent = e.target.parentNode;
            if (parent) {
                e.target.remove(); 
                const errorPlaceholder = document.createElement('div');
                errorPlaceholder.className = 'media-placeholder error';
                // Utilisation d'une icône simple pour l'erreur, car FiImage n'est plus importée globalement
                errorPlaceholder.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>';
                parent.appendChild(errorPlaceholder);
            }
          }} 
        />
      );
    }

    if (item.type.startsWith('video/')) {
      return (
        <div className="video-preview-wrapper">
          <FiFilm size={32} className="video-icon-overlay" />
          {/* 
          Option pour afficher la balise vidéo (peut être lourd) :
          <video preload="metadata" className="grid-video-preview" muted>
            <source src={item.url + '#t=0.5'} type={item.type} /> 
          </video>
          */
          }
        </div>
      );
    }
    // Fallback pour les types non gérés explicitement mais qui sont dans mediaItems
    return <div className="media-placeholder"><FiFile size={24} title={item.name || 'Média inconnu'}/></div>;
  };

  return (
    <SidebarSection title="Média (Images & Vidéos)">
      <div className="media-grid">
        {itemsToDisplay.map(item => {
          // console.log(`FRONTEND (MediaGrid) - Traitement item pour map: ID: ${item.id}, Type: ${item.type}, URL: ${item.url}`);
          return (
            <div 
              key={item.id} 
              className="media-item" 
              title={item.name || 'Média'}
              onClick={() => window.open(item.url, '_blank')}
            >
              {renderMediaPreview(item)}
            </div>
          );
        })}
      </div>

      {/* Afficher le bouton "Voir tout" / "Voir moins" seulement si plus d'items que INITIAL_DISPLAY_COUNT */}
      {mediaItems.length > INITIAL_DISPLAY_COUNT && (
        <button type="button" onClick={toggleShowAll} className="see-all-button">
          {showAll ? (
            <>
              Voir moins <FiChevronUp style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
            </>
          ) : (
            <>
              Voir tout ({mediaItems.length}) <FiChevronDown style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
            </>
          )}
        </button>
      )}
    </SidebarSection>
  );
};

export default MediaGrid;