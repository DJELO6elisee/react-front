// src/components/Sidebar/CreateRoomModal.js
import React, { useState } from 'react';
import InputField from '../common/InputField';
import Button from '../common/Button';
import { FiX, FiPlusCircle, FiType, FiInfo, FiHash } from 'react-icons/fi'; // Ajout FiType, FiInfo, FiHash
import './CreateRoomModal.css'; // Créez ce fichier CSS

const CreateRoomModal = ({ isOpen, onClose, onCreateRoom }) => {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('FaHashtag'); // Icône par défaut
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setError("Le nom du salon est requis.");
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onCreateRoom({ name: roomName, description, iconName });
      // Le parent (ChatPage) gérera la mise à jour de la liste et la fermeture du modal
      // onClose(); // Fermer le modal depuis ici ou laisser le parent le faire
      // setRoomName(''); setDescription(''); setIconName('FaHashtag'); // Réinitialiser
    } catch (apiError) {
      setError(apiError.message || "Erreur lors de la création du salon.");
    }
    setIsSubmitting(false);
  };

  if (!isOpen) {
    return null;
  }

  // Liste d'icônes disponibles (simplifiée, vous pourriez avoir un vrai sélecteur d'icônes)
  const availableIcons = [
    { name: 'Général', value: 'FaHashtag' },
    { name: 'Design', value: 'FaPaintBrush' },
    { name: 'Projet', value: 'FaRocket' },
    { name: 'Détente', value: 'FaCoffee' },
    { name: 'Discussion', value: 'FaComments' },
    { name: 'Privé', value: 'FaLock' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content create-room-modal">
        <button onClick={onClose} className="modal-close-btn"><FiX /></button>
        <h2><FiPlusCircle /> Créer un nouveau salon</h2>
        {error && <p className="form-error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <InputField
            id="new-room-name"
            label="Nom du salon"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            icon={<FiType />}
            placeholder="Ex: Marketing Q4"
            required
          />
          <InputField
            id="new-room-description"
            label="Description (optionnel)"
            type="textarea" // Utilisez un textarea pour la description
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            icon={<FiInfo />}
            placeholder="Objectif ou sujet du salon"
          />
           <div className="form-group"> {/* Wrapper pour le select d'icône */}
            <label htmlFor="new-room-icon">Icône du salon</label>
            <div className="input-wrapper">
                <span className="input-icon"><FiHash /></span>
                <select 
                    id="new-room-icon" 
                    value={iconName} 
                    onChange={(e) => setIconName(e.target.value)}
                    className="input-field has-icon" // Réutiliser les styles
                >
                {availableIcons.map(icon => (
                    <option key={icon.value} value={icon.value}>{icon.name}</option>
                ))}
                </select>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
            Créer le salon
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;