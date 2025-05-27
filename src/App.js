// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/ChatArea/ChatArea';
import SidebarRight from './components/SidebarRight/SidebarRight'; // NOUVEL IMPORT
import { usersData, roomsData as initialRoomsData, contactsData, messagesData as initialMessagesData } from './data/mockData';

function App() {
  const [currentUser] = useState(usersData['currentUser']);
  const [rooms, setRooms] = useState(initialRoomsData);
  const [contacts] = useState(contactsData);
  const [messages, setMessages] = useState(initialMessagesData);
  const [activeRoomId, setActiveRoomId] = useState(initialRoomsData[0]?.id || null);
  const [isSidebarRightVisible, setIsSidebarRightVisible] = useState(true); // Pour la responsivité

  const activeRoom = rooms.find(room => room.id === activeRoomId);
  const currentRoomMessages = messages[activeRoomId] || [];

  const handleSelectRoom = (roomId) => {
    setActiveRoomId(roomId);
    setRooms(prevRooms =>
      prevRooms.map(r => (r.id === roomId ? { ...r, unread: 0 } : r))
    );
  };

  const handleSendMessage = (text) => {
    if (!activeRoomId) return;
    const newMessage = {
      id: `msg${Date.now()}`,
      roomId: activeRoomId,
      senderId: currentUser.id,
      text: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => ({
      ...prevMessages,
      [activeRoomId]: [...(prevMessages[activeRoomId] || []), newMessage],
    }));
  };

  useEffect(() => {
    if (activeRoom) {
      document.title = `Chat - ${activeRoom.name}`;
    } else {
      document.title = 'Chat App';
    }
  }, [activeRoom]);

  // Simple gestion de la visibilité pour les petits écrans (à améliorer)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // Seuil pour cacher la sidebar droite
        setIsSidebarRightVisible(false);
      } else {
        setIsSidebarRightVisible(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Appel initial
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="app-layout">
      <Sidebar
        currentUser={currentUser}
        rooms={rooms}
        contacts={contacts}
        activeRoomId={activeRoomId}
        onSelectRoom={handleSelectRoom}
      />
      <ChatArea
        activeRoom={activeRoom}
        messages={currentRoomMessages}
        currentUserId={currentUser.id}
        onSendMessage={handleSendMessage}
      />
      {isSidebarRightVisible && <SidebarRight activeRoom={activeRoom} />} {/* AJOUTÉ ICI */}
    </div>
  );
}

export default App;