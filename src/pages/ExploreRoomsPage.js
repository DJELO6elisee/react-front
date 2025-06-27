// src/pages/ExploreRoomsPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiSearch, FiMessageSquare, FiUsers, FiLogIn } from 'react-icons/fi';
import './ExploreRoomsPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'chatgather.p6-groupeb.com/api';

const ExploreRoomsPage = () => {
  const [allRooms, setAllRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(null);
  const [error, setError] = useState('');
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${API_URL}/chat/rooms/all`, {
          params: { searchTerm: searchTerm || undefined }
        });
        setAllRooms(response.data.rooms || []);
      } catch (err) {
        console.error("Erreur chargement des salons:", err);
        setError("Impossible de charger la liste des salons.");
        setAllRooms([]);
      }
      setLoading(false);
    };

    
    const timerId = setTimeout(() => {
        fetchRooms();
    }, 500); // Petit délai avant de lancer la recherche après la dernière frappe

    return () => clearTimeout(timerId); // Nettoyage du timer
  }, [searchTerm]);

  const handleJoinRoom = async (roomId) => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/explore-rooms?roomId=${roomId}` } });
      return;
    }
    setJoinLoading(roomId);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/chat/rooms/${roomId}/join`);
      // alert(response.data.message || "Salon rejoint !"); // Peut-être utiliser un toast/snackbar plus tard

      // Mettre à jour l'état local pour refléter que l'utilisateur est maintenant membre
      setAllRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? { ...room, is_member: true, member_count: (room.member_count || 0) + 1 } : room
          // Augmenter member_count est optionnel ici, le backend le fera de toute façon.
          // L'important est is_member: true
        )
      );
      
      // Optionnel: léger délai avant de naviguer pour que l'utilisateur voie le changement de bouton
      setTimeout(() => {
          navigate(`/chat?roomId=${roomId}`); // Naviguer vers le chat, et potentiellement vers le salon rejoint
      }, 300); // 300ms de délai

    } catch (err) {
      console.error("Erreur pour rejoindre le salon:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Impossible de rejoindre le salon.");
    }
    setJoinLoading(null);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="explore-rooms-page">
      <h1><FiMessageSquare /> Explorer les Salons</h1>
      <div className="search-bar-container">
        <InputField
          id="room-search"
          type="text"
          placeholder="Rechercher un salon..."
          value={searchTerm}
          onChange={handleSearchChange}
          icon={<FiSearch />}
        />
      </div>

      {error && <p className="form-error-message" style={{textAlign: 'center'}}>{error}</p>}

      {loading ? (
        <div style={{display: 'flex', justifyContent: 'center', padding: '50px'}}><LoadingSpinner size="lg" /></div>
      ) : allRooms.length === 0 ? (
        <p className="empty-state">Aucun salon trouvé {searchTerm && `pour "${searchTerm}"`}.</p>
      ) : (
        <ul className="explore-room-list">
          {allRooms.map(room => (
            <li key={room.id} className="explore-room-item">
              <div className="room-item-icon">
                {React.createElement(require('react-icons/fa')[room.icon_name || 'FaHashtag'] || FiMessageSquare)}
              </div>
              <div className="room-item-info">
                <h3>{room.name}</h3>
                <p>{room.description || 'Pas de description.'}</p>
              </div>
              <div className="room-item-meta">
                <span><FiUsers /> {room.member_count || 0} membres</span>
                {/* Afficher un bouton différent si l'utilisateur est déjà membre */}
                {room.is_member ? (
                    <Button variant="success" size="sm" disabled>Déjà Membre</Button>
                ) : (
                    <Button 
                      onClick={() => handleJoinRoom(room.id)} 
                      variant="outline" 
                      size="sm"
                      isLoading={joinLoading === room.id}
                      disabled={joinLoading === room.id}
                    >
                      {currentUser ? 'Rejoindre' : <><FiLogIn style={{marginRight: '4px'}}/> Rejoindre</>}
                    </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ExploreRoomsPage;