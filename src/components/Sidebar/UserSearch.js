import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Avatar from '../common/Avatar';
import InputField from '../common/InputField'; // Si vous avez un composant InputField
import { FiSearch, FiX } from 'react-icons/fi';
import './UserSearch.css'; // À créer

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const UserSearch = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setError('');
      return;
    }

    clearTimeout(debounceTimeoutRef.current);
    setIsLoading(true);
    setError('');

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(`${API_URL}/users/search/all`, {
          params: { query: searchTerm.trim() }
        });
        setSearchResults(response.data.users || []);
        if ((response.data.users || []).length === 0) {
            setError('Aucun utilisateur trouvé.');
        }
      } catch (err) {
        console.error("Erreur recherche utilisateurs:", err);
        setError('Erreur lors de la recherche.');
        setSearchResults([]);
      }
      setIsLoading(false);
    }, 500); // Délai de debounce de 500ms

    return () => clearTimeout(debounceTimeoutRef.current);
  }, [searchTerm]);

  const handleSelect = (user) => {
    onSelectUser(user); // Appelle la fonction de ChatPage pour initier la conversation
    setSearchTerm('');    // Vider le champ de recherche
    setSearchResults([]); // Vider les résultats
  };

  return (
    <div className="user-search-container">
      <h3 className="list-title">Rechercher un utilisateur</h3>
      <div className="search-input-wrapper">
        {/* Utilisez votre InputField ou un input standard */}
        <InputField
          id="user-search-input"
          type="text"
          placeholder="Nom d'utilisateur, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<FiSearch />}
          // Optionnel: un bouton pour vider le champ
          // onClear={() => setSearchTerm('')} 
        />
        {searchTerm && (
            <button onClick={() => { setSearchTerm(''); setSearchResults([]); setError(''); }} className="clear-search-btn" title="Effacer">
                <FiX />
            </button>
        )}
      </div>

      {isLoading && <div className="loading-search-results">Recherche...</div>}
      {error && !isLoading && <p className="search-error-message">{error}</p>}
      
      {!isLoading && searchResults.length > 0 && (
        <ul className="user-search-results-list">
          {searchResults.map(user => (
            <li 
              key={user.id} 
              className="user-search-result-item" 
              onClick={() => handleSelect(user)}
              title={`Démarrer une conversation avec ${user.username}`}
            >
              <Avatar src={user.avatar_url} alt={user.username} size={32} isOnline={user.isOnline} />
              <span className="user-result-name">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;