// src/pages/ChatPage.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatArea from '../components/ChatArea/ChatArea';
import SidebarRight from '../components/SidebarRight/SidebarRight';
// import { useAuth } from '../hooks/useAuth'; // SUPPRIMÉ
import { roomsData as initialRoomsData, contactsData, messagesData as initialMessagesData, usersData } from '../data/mockData';
// import '../App.css';

const STATIC_USER_FOR_DISPLAY = {
    id: 'staticUser123',
    name: 'Vous (Statique)',
    avatarUrl: 'https://i.pravatar.cc/150?u=staticUser',
    email: 'static@example.com'
};

function ChatPage() {
  // const { currentUser } = useAuth(); // SUPPRIMÉ

  const [rooms] = useState(initialRoomsData);
  // Utiliser un contact factice pour la liste de contacts si contactsData dépendait de usersData non chargés
  const staticContacts = contactsData.length > 0 ? contactsData : [usersData['user1'] || STATIC_USER_FOR_DISPLAY];
  const [contacts] = useState(staticContacts);

  const [messages, setMessages] = useState(initialMessagesData);
  const [activeRoomId, setActiveRoomId] = useState(initialRoomsData[0]?.id || null);
  const [isSidebarRightVisible, setIsSidebarRightVisible] = useState(true);

  const activeRoom = rooms.find(room => room.id === activeRoomId);
  const currentRoomMessages = messages[activeRoomId] || [];

  const handleSelectRoom = (roomId) => {
    setActiveRoomId(roomId);
    // La logique de "unread" n'est plus liée à un utilisateur spécifique
    // setRooms(prevRooms => /* ... */); // Peut-être plus pertinent
  };

  const handleSendMessage = (text) => {
    if (!activeRoomId) return;
    const newMessage = {
      id: `msg${Date.now()}`,
      roomId: activeRoomId,
      senderId: STATIC_USER_FOR_DISPLAY.id, // ID de l'utilisateur statique
      text: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prevMessages => ({
      ...prevMessages,
      [activeRoomId]: [...(prevMessages[activeRoomId] || []), newMessage],
    }));
  };

  useEffect(() => {
    if (activeRoom) document.title = `Chat - ${activeRoom.name}`;
    else document.title = 'Chat App';
  }, [activeRoom]);

  useEffect(() => {
    const handleResize = () => setIsSidebarRightVisible(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <> {/* Le parent est maintenant .app-layout dans MainChatLayout */}
      <Sidebar
        currentUser={STATIC_USER_FOR_DISPLAY} // Toujours l'utilisateur statique
        rooms={rooms}
        contacts={contacts}
        activeRoomId={activeRoomId}
        onSelectRoom={handleSelectRoom}
      />
      <ChatArea
        activeRoom={activeRoom}
        messages={currentRoomMessages}
        currentUserId={STATIC_USER_FOR_DISPLAY.id} // Toujours l'ID statique
        onSendMessage={handleSendMessage}
      />
      {isSidebarRightVisible && <SidebarRight activeRoom={activeRoom} />}
    </>
  );
}
export default ChatPage;