// src/components/SidebarRight/SidebarRight.js
import React from 'react';
import ChatAboutPanel from './ChatAboutPanel';
import MediaGrid from './MediaGrid';
import SharedFilesList from './SharedFilesList';
import './SidebarRight.css';

const SidebarRight = ({ activeRoom }) => {
  if (!activeRoom) {
    // Optionnel: afficher un placeholder ou rien si aucun salon n'est actif
    return <aside className="sidebar-right placeholder">Sélectionnez un salon pour voir les détails.</aside>;
  }

  // Pour l'image, "Mentioned Documents" et "Attachments" sont des listes de fichiers/liens.
  // On peut les regrouper ou les séparer. Pour l'exemple, je sépare "Media" (images)
  // des "Attachments" (qui peuvent être des documents ou des liens).

  return (
    <aside className="sidebar-right">
      <ChatAboutPanel room={activeRoom} />
      <MediaGrid mediaItems={activeRoom.media || []} />
      <SharedFilesList files={activeRoom.attachments || []} sectionTitle="Pièces Jointes & Liens" />
      {/* Vous pourriez ajouter une autre section pour "Documents Mentionnés" si la logique est différente */}
    </aside>
  );
};

export default SidebarRight;