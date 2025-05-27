// src/pages/ChatPage.js
import React, { useState, useEffect } from 'react';
// Importez les composants Sidebar, ChatArea comme avant
import Sidebar from '../components/Sidebar/Sidebar';
import ChatArea from '../components/ChatArea/ChatArea';
import SidebarRight from '../components/SidebarRight/SidebarRight';
import { useAuth } from '../hooks/useAuth'; // Pour obtenir currentUser
import { roomsData as initialRoomsData, contactsData, messagesData as initialMessagesData } from '../data/mockData';
// App.css sera utilisé pour le layout général
// import '../App.css'; // Assurez-vous que les styles de layout sont globaux ou ici

function ChatPage() {
  const { currentUser } = useAuth(); // Obtenir l'utilisateur du contexte
  const [rooms, setRooms] = useState(initialRoomsData);
  const [contacts] = useState(contactsData);
  const [messages, setMessages] = useState(initialMessagesData);
  const [activeRoomId, setActiveRoomId] = useState(initialRoomsData[0]?.id || null);
  const [isSidebarRightVisible] = useState(true);

  const activeRoom = rooms.find(room => room.id === activeRoomId);
  const currentRoomMessages = messages[activeRoomId] || [];

  const handleSelectRoom = (roomId) => {
    setActiveRoomId(roomId);
    setRooms(prevRooms =>
      prevRooms.map(r => (r.id === roomId ? { ...r, unread: 0 } : r))
    );
  };

  const handleSendMessage = (text) => {
    if (!activeRoomId || !currentUser) return;
    const newMessage = {
      id: `msg${Date.now()}`, roomId: activeRoomId, senderId: currentUser.id,
      text: text, timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => ({
      ...prevMessages,
      [activeRoomId]: [...(prevMessages[activeRoomId] || []), newMessage],
    }));
  };

  useEffect(() => { /* ... (gestion du titre de la page) ... */ }, [activeRoom]);
  useEffect(() => { /* ... (gestion de la visibilité de la sidebar droite) ... */ }, []);

  if (!currentUser) return <p>Chargement...</p>; // Ou une redirection si ProtectedRoute n'est pas utilisé

  return (
    // Le .app-layout est défini dans App.css (global)
    <>
      <Sidebar
        currentUser={currentUser} rooms={rooms} contacts={contacts}
        activeRoomId={activeRoomId} onSelectRoom={handleSelectRoom}
      />
      <ChatArea
        activeRoom={activeRoom} messages={currentRoomMessages}
        currentUserId={currentUser.id} onSendMessage={handleSendMessage}
      />
      {isSidebarRightVisible && <SidebarRight activeRoom={activeRoom} />}
    </>
  );
}
export default ChatPage;