import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatArea from '../components/ChatArea/ChatArea';
import SidebarRight from '../components/SidebarRight/SidebarRight';
import CreateRoomModal from '../components/Sidebar/CreateRoomModal';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import io from 'socket.io-client';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Navigate } from 'react-router-dom';
import { isURL } from '../utils/url'; 
import '../App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function ChatPage() {
  const { currentUser, token } = useAuth();

  const [groupRooms, setGroupRooms] = useState([]);
  const [directMessageRooms, setDirectMessageRooms] = useState([]);
  
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [activeRoomId, setActiveRoomId] = useState(null); 
  const [activeRoomDetails, setActiveRoomDetails] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});

  const [loadingGroupRooms, setLoadingGroupRooms] = useState(true);
  const [loadingDirectMessages, setLoadingDirectMessages] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingRoomDetails, setLoadingRoomDetails] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileView, setMobileView] = useState('sidebar'); 
  const [isDesktopSidebarRightVisible, setIsDesktopSidebarRightVisible] = useState(window.innerWidth > 1024);

  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const socketRef = useRef(null);
  const activeRoomIdRef = useRef(activeRoomId);
  const allRoomsRef = useRef([]); 

  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);

  useEffect(() => {
    const safeGroupRooms = Array.isArray(groupRooms) ? groupRooms : [];
    const safeDirectMessageRooms = Array.isArray(directMessageRooms) ? directMessageRooms : [];
    allRoomsRef.current = [...safeGroupRooms, ...safeDirectMessageRooms];
  }, [groupRooms, directMessageRooms]);

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth <= 768;
      const desktopSidebarCheck = window.innerWidth > 1024;
      setIsMobile(mobileCheck);
      setIsDesktopSidebarRightVisible(desktopSidebarCheck);
      if (!mobileCheck && mobileView === 'details' && !desktopSidebarCheck) {
          setMobileView('chat'); 
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileView]); 

  useEffect(() => {
    if (currentUser && token) {
      console.log('FRONTEND (Effect Socket.IO): Initialisation...');
      socketRef.current = io(SOCKET_URL, { auth: { token } });

      socketRef.current.on('connect', () => {
        console.log('FRONTEND (Socket "connect"): ID:', socketRef.current.id);
        if (activeRoomIdRef.current) {
          socketRef.current.emit('joinRoom', { roomId: activeRoomIdRef.current });
        }
        if (currentUser?.id) { 
            socketRef.current.emit('userOnlineStatus', { userId: currentUser.id, isOnline: true });
        }
      });

      socketRef.current.on('disconnect', (reason) => console.warn('FRONTEND (Socket "disconnect"):', reason));
      socketRef.current.on('connect_error', (err) => console.error('FRONTEND (Socket "connect_error"):', err.message, err.data || ''));
      socketRef.current.on('socketError', (err) => console.error('FRONTEND (Socket "socketError"):', err.message, err.data || ''));

      socketRef.current.on('message', (newMessage) => {
        console.log('FRONTEND (Socket "message"): Reçu:', newMessage);
        if (newMessage && newMessage.room_id) {
          setMessagesByRoom(prev => {
            const roomMsgs = Array.isArray(prev[newMessage.room_id]) ? prev[newMessage.room_id] : [];
            if (roomMsgs.find(msg => msg.id === newMessage.id)) return prev;
            return { ...prev, [newMessage.room_id]: [...roomMsgs, newMessage] };
          });

          const roomData = allRoomsRef.current.find(r => r.id === newMessage.room_id);
          
          const updateRoomListWithNewMessage = (prevList) => {
            const currentList = Array.isArray(prevList) ? prevList : [];
            const updatedList = currentList.map(r => {
              if (r.id === newMessage.room_id) {
                return { 
                  ...r, 
                  unread_count: (newMessage.room_id !== activeRoomIdRef.current) ? (parseInt(r.unread_count, 10) || 0) + 1 : 0,
                  last_message: { 
                    text: newMessage.text, 
                    media_url: newMessage.media_url, 
                    created_at: newMessage.created_at, 
                    sender_username: newMessage.sender_username 
                  },
                  updated_at: newMessage.created_at
                };
              }
              return r;
            });
            return updatedList.sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
          };

          if (roomData) {
            if (roomData.isDirect || roomData.room_type === 'direct') {
                setDirectMessageRooms(updateRoomListWithNewMessage);
            } else {
                setGroupRooms(updateRoomListWithNewMessage);
            }
          } else {
             console.warn(`FRONTEND (Socket "message"): Salon ${newMessage.room_id} non trouvé dans allRoomsRef. Tentative de récupération.`);
             const fetchNewRoomDetailsAndAddToList = async () => {
                 try {
                     const res = await axios.get(`${API_URL}/chat/rooms/${newMessage.room_id}`);
                     if (res.data && res.data.room) {
                         const newRoomDataFromApi = res.data.room;
                         const updatedNewRoomData = {
                             ...newRoomDataFromApi,
                             unread_count: (newMessage.room_id !== activeRoomIdRef.current) ? 1 : 0,
                             last_message: { 
                                text: newMessage.text, 
                                media_url: newMessage.media_url, 
                                created_at: newMessage.created_at, 
                                sender_username: newMessage.sender_username 
                             },
                             updated_at: newMessage.created_at
                         };

                         if(updatedNewRoomData.room_type === 'direct') {
                             const partner = updatedNewRoomData.other_participant || (Array.isArray(updatedNewRoomData.participants) ? updatedNewRoomData.participants.find(p => p.id !== currentUser?.id) : null);
                             const formattedDM = { 
                                 ...updatedNewRoomData, 
                                 name: partner?.username || partner?.name || "Conversation", 
                                 isDirect: true, 
                                 other_participant: partner 
                             };
                             setDirectMessageRooms(prevDMs => {
                                 const currentDMs = Array.isArray(prevDMs) ? prevDMs : [];
                                 return [formattedDM, ...currentDMs.filter(dm => dm.id !== formattedDM.id)].sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
                             });
                         } else { 
                             const formattedGroup = {...updatedNewRoomData, isDirect: false, room_type: 'group'};
                             setGroupRooms(prevGroups => {
                                 const currentGroups = Array.isArray(prevGroups) ? prevGroups : [];
                                 return [formattedGroup, ...currentGroups.filter(g => g.id !== formattedGroup.id)].sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
                             });
                         }
                     }
                 } catch (err) { console.error("FRONTEND ERREUR: Fetch détails nouveau salon inconnu:", err); }
             };
             if (!allRoomsRef.current.find(r => r.id === newMessage.room_id)) { fetchNewRoomDetailsAndAddToList(); }
          }
        }
      });
      
      socketRef.current.on('userJoined', (data) => { 
        console.log('FRONTEND (Socket "userJoined"):', data);
        if (data.roomId === activeRoomIdRef.current) {
          setActiveRoomDetails(prevD => {
            if (!prevD || !Array.isArray(prevD.participants)) {
                const baseRoomInfo = allRoomsRef.current.find(r => r.id === data.roomId) || { id: data.roomId, participants: [] };
                return {...baseRoomInfo, participants: [...(baseRoomInfo.participants || []), { id: data.userId, username: data.username, avatar_url: data.avatarUrl || '' }] };
            }
            if (prevD.participants.find(p => p.id === data.userId)) return prevD;
            return { ...prevD, participants: [...prevD.participants, { id: data.userId, username: data.username, avatar_url: data.avatarUrl || '' }] };
          });
        }
        const updateListForUserJoined = (prevList) => {
            const currentList = Array.isArray(prevList) ? prevList : [];
            return currentList.map(r => {
                if (r.id === data.roomId) {
                    const currentParticipants = Array.isArray(r.participants) ? r.participants : [];
                    const participantExists = currentParticipants.find(p => p.id === data.userId);
                    const newParticipantsArray = participantExists 
                        ? currentParticipants 
                        : [...currentParticipants, { id: data.userId, username: data.username, avatar_url: data.avatarUrl || '' }];
                    return { ...r, participants: newParticipantsArray, member_count: newParticipantsArray.length };
                }
                return r;
            });
        }
        const roomToUpdate = allRoomsRef.current.find(r => r.id === data.roomId);
        if (roomToUpdate) {
            if (roomToUpdate.isDirect || roomToUpdate.room_type === 'direct') {
                setDirectMessageRooms(updateListForUserJoined);
            } else {
                setGroupRooms(updateListForUserJoined);
            }
        }
      });

      socketRef.current.on('userLeft', (data) => {
        console.log('FRONTEND (Socket "userLeft"):', data);
        if (data.roomId === activeRoomIdRef.current) {
          setActiveRoomDetails(prevD => {
            if (!prevD || !Array.isArray(prevD.participants)) return prevD;
            return { ...prevD, participants: prevD.participants.filter(p => p.id !== data.userId) };
          });
        }
        const updateListForUserLeft = (prevList) => {
            const currentList = Array.isArray(prevList) ? prevList : [];
            return currentList.map(r => {
                if (r.id === data.roomId) {
                    const newParticipantsArray = Array.isArray(r.participants) ? r.participants.filter(p => p.id !== data.userId) : [];
                    return { ...r, participants: newParticipantsArray, member_count: newParticipantsArray.length };
                }
                return r;
            });
        };
        const roomToUpdate = allRoomsRef.current.find(r => r.id === data.roomId);
        if (roomToUpdate) {
            if (roomToUpdate.isDirect || roomToUpdate.room_type === 'direct') {
                setDirectMessageRooms(updateListForUserLeft);
            } else {
                setGroupRooms(updateListForUserLeft);
            }
        }
      });

      socketRef.current.on('roomUsers', (data) => {
        console.log('FRONTEND (Socket "roomUsers"): Reçu liste pour salon', data.roomId, 'Nombre:', data.users?.length || 0);
        if (data.roomId === activeRoomIdRef.current) {
          setActiveRoomDetails(prevD => {
            const baseDetails = prevD || allRoomsRef.current.find(r => r.id === data.roomId) || { id: data.roomId };
            return { ...baseDetails, participants: data.users || [] };
          });
        }
         const roomToUpdate = allRoomsRef.current.find(r => r.id === data.roomId);
        if (roomToUpdate) {
            const updatedRoomData = { ...roomToUpdate, participants: data.users || [], member_count: data.users?.length || 0 };
            const listUpdater = (prevList) => {
                const currentList = Array.isArray(prevList) ? prevList : [];
                return currentList.map(item => item.id === data.roomId ? updatedRoomData : item);
            };
            if (roomToUpdate.isDirect || roomToUpdate.room_type === 'direct') {
                setDirectMessageRooms(listUpdater);
            } else {
                setGroupRooms(listUpdater);
            }
        }
      });
      
      socketRef.current.on('userTyping', ({ username, roomId, isTyping }) => {
        if (currentUser && username === currentUser.username) return;
        setTypingUsers(prev => {
          const roomTypers = { ...(prev[roomId] || {}) };
          if (isTyping) { 
            roomTypers[username] = true; 
          } else { 
            delete roomTypers[username];
          }
          return { ...prev, [roomId]: roomTypers };
        });
      });
      socketRef.current.on('contactStatusUpdate', ({ userId, isOnline, lastSeen }) => {
        console.log(`FRONTEND (Socket "contactStatusUpdate"): User ${userId} isOnline: ${isOnline} lastSeen: ${lastSeen}`);
        setDirectMessageRooms(prevDMs => {
            const currentDMs = Array.isArray(prevDMs) ? prevDMs : [];
            return currentDMs.map(dm => 
                dm.other_participant && dm.other_participant.id === userId 
                ? { ...dm, other_participant: { ...(dm.other_participant || {}), isOnline, last_seen: lastSeen } } 
                : dm
            );
        });
        if (activeRoomDetails && activeRoomDetails.room_type === 'direct' && activeRoomDetails.other_participant?.id === userId) {
            setActiveRoomDetails(prev => ({
                ...prev,
                other_participant: { ...(prev.other_participant || {}), isOnline, last_seen: lastSeen }
            }));
        }
      });

      return () => { 
        if (socketRef.current) {
          console.log('FRONTEND (ChatPage Cleanup): Déconnexion Socket.IO...');
          if (currentUser?.id) {
            socketRef.current.emit('userOnlineStatus', { userId: currentUser.id, isOnline: false, lastSeen: new Date().toISOString() });
          }
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    } else { 
      if (socketRef.current) { 
        console.log('FRONTEND (ChatPage Effect): currentUser/token perdu, déconnexion socket.');
        socketRef.current.disconnect(); 
        socketRef.current = null; 
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, token]); 


  useEffect(() => {
    if (currentUser && token) {
      console.log('FRONTEND (Effect Rooms): Chargement des salons...');
      setLoadingGroupRooms(true); setLoadingDirectMessages(true);
      axios.get(`${API_URL}/chat/rooms`)
        .then(response => {
          const fetchedRooms = response.data.rooms || [];
          console.log('FRONTEND (Effect Rooms): Total salons bruts récupérés:', fetchedRooms.length);
          const groups = []; const dms = [];
          fetchedRooms.forEach(room => {
            if (room.room_type === 'direct') {
              const partner = room.other_participant;
              if (partner && partner.id) {
                dms.push({ ...room, name: partner.username || partner.name || "Conversation", isDirect: true, other_participant: partner });
              } else { 
                console.warn("FRONTEND (Effect Rooms): DM reçu sans other_participant valide:", room); 
              }
            } else { 
                groups.push({...room, isDirect: false, room_type: 'group'}); 
            }
          });
          setGroupRooms(groups.sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)));
          setDirectMessageRooms(dms.sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)));
          console.log(`FRONTEND (Effect Rooms): Groupes: ${groups.length}, DMs: ${dms.length}`);

          if (fetchedRooms.length === 0) { 
            setActiveRoomId(null); setActiveRoomDetails(null); setMessagesByRoom({});
          }
        })
        .catch(err => { 
            console.error("FRONTEND ERREUR (Effect Rooms):", err.response?.data?.message || err.message); 
            setGroupRooms([]); setDirectMessageRooms([]);
        })
        .finally(() => { 
            setLoadingGroupRooms(false); setLoadingDirectMessages(false); 
            console.log('FRONTEND (Effect Rooms): Chargement des salons terminé.');
        });
    } else { 
      setGroupRooms([]); setLoadingGroupRooms(false); 
      setDirectMessageRooms([]); setLoadingDirectMessages(false);
      setActiveRoomId(null); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, token]);


  useEffect(() => {
    if (activeRoomId && currentUser && token) {
      console.log(`FRONTEND (Effect ActiveRoom): Changement vers salon ${activeRoomId}. Chargement des données...`);
      if (socketRef.current?.connected) { 
        socketRef.current.emit('joinRoom', { roomId: activeRoomId }); 
      }
      setLoadingMessages(true); setLoadingRoomDetails(true);
      Promise.all([
        axios.get(`${API_URL}/chat/rooms/${activeRoomId}/messages`),
        axios.get(`${API_URL}/chat/rooms/${activeRoomId}`)
      ]).then(([msgRes,roomRes])=>{
        console.log(`FRONTEND (Effect ActiveRoom): Messages pour ${activeRoomId}:`, msgRes.data.messages?.length || 0);
        setMessagesByRoom(p=>({...p,[activeRoomId]:msgRes.data.messages||[]}));
        
        const roomData = roomRes.data.room;
        if (roomData) {
            console.log(`FRONTEND (Effect ActiveRoom): Détails du salon ${activeRoomId} (type: ${roomData.room_type}, participants: ${roomData.participants?.length})`);
            if (roomData.room_type === 'direct' && !roomData.other_participant && Array.isArray(roomData.participants)) {
                roomData.other_participant = roomData.participants.find(p => p.id !== currentUser?.id);
                if (roomData.other_participant) {
                    roomData.name = roomData.other_participant.username || roomData.other_participant.name || "Conversation";
                }
                 console.log(`FRONTEND (Effect ActiveRoom): other_participant pour DM ${activeRoomId} mis à jour:`, roomData.other_participant?.username);
            }
            setActiveRoomDetails(roomData); 
        } else {
            setActiveRoomDetails(null);
        }
      })
      .catch(err=>{ 
        console.error(`FRONTEND ERREUR (Effect ActiveRoom) pour ${activeRoomId}:`, err.response?.data?.message || err.message);
        setMessagesByRoom(p=>({...p,[activeRoomId]:[]})); setActiveRoomDetails(null);
      })
      .finally(()=>{ setLoadingMessages(false); setLoadingRoomDetails(false); });

      const roomToUpdate = allRoomsRef.current.find(r => r.id === activeRoomId);
      if (roomToUpdate) {
          const listUpdater = (prevList) => {
            const currentList = Array.isArray(prevList) ? prevList : [];
            return currentList.map(item => item.id === activeRoomId ? {...item, unread_count: 0} : item);
          };
          if (roomToUpdate.isDirect || roomToUpdate.room_type === 'direct') {
              setDirectMessageRooms(listUpdater);
          } else {
              setGroupRooms(listUpdater);
          }
      }
    } else if(!activeRoomId) {
      console.log('FRONTEND (Effect ActiveRoom): Aucun salon actif, activeRoomDetails mis à null.');
      setActiveRoomDetails(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId]);


  const handleSelectRoom = useCallback((roomId) => {
    console.log(`FRONTEND (handleSelectRoom): Sélection du salon ${roomId}. Vue mobile actuelle: ${mobileView}`);
    if (roomId !== activeRoomIdRef.current) { 
        setActiveRoomId(roomId); 
    }
    if (isMobile) { 
        setMobileView('chat'); 
    }
  }, [isMobile, setMobileView, mobileView]); // Correction des dépendances
  
  const handleShowSidebarList = () => { 
      if (isMobile) { 
          console.log('FRONTEND (handleShowSidebarList): Passage à la vue sidebar en mobile.');
          setMobileView('sidebar'); 
      }
  };
  const handleToggleRoomDetails = () => { 
      console.log(`FRONTEND (handleToggleRoomDetails): Bascule des détails. Vue actuelle: ${mobileView}`);
      setMobileView(prev => {
          const newView = prev === 'details' ? 'chat' : 'details';
          console.log(`FRONTEND (handleToggleRoomDetails): Nouvelle vue: ${newView}`);
          return newView;
      }); 
  };

  const handleSendMessage = async (messageData) => {
    console.log('FRONTEND (handleSendMessage): Tentative. Données:', JSON.stringify(messageData, null, 2));
    const currentRoomId = activeRoomIdRef.current;
    if (!currentRoomId || !currentUser || (!messageData.text && !messageData.mediaUrl)) {
      console.warn("FRONTEND (handleSendMessage): Conditions non remplies ou message vide.");
      alert("Impossible d'envoyer le message."); return;
    }
    let { text: finalText, mediaUrl: finalMediaUrl, fileName: finalFileName, fileType: finalFileType } = messageData;

    if (!finalMediaUrl && finalText && isURL(finalText.trim())) {
      const urlText = finalText.trim(); 
      finalMediaUrl = urlText; 
      finalFileType = 'link';
      try { finalFileName = new URL(urlText).hostname; } 
      catch { finalFileName = urlText.length > 50 ? urlText.substring(0, 47) + "..." : urlText; }
      console.log('FRONTEND (handleSendMessage): URL traitée comme média de type lien.');
    }

    const payloadToApi = { text: finalText, mediaUrl: finalMediaUrl, fileName: finalFileName, fileType: finalFileType };
    console.log('FRONTEND (handleSendMessage): Payload pour API:', JSON.stringify(payloadToApi, null, 2));
    try {
      const response = await axios.post(`${API_URL}/chat/rooms/${currentRoomId}/messages`, payloadToApi);
      console.log('FRONTEND (handleSendMessage): Message posté via API. Réponse:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      const errText = error.response?.data?.message || (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : error.message) || "Erreur.";
      console.error("FRONTEND ERREUR (handleSendMessage):", errText, error.response);
      alert("Échec envoi: " + errText);
    }
  };
  
  const handleInitiateChatWithUser = async (targetUser) => {
    if(!currentUser || !targetUser || currentUser.id === targetUser.id) return;
    console.log(`FRONTEND (handleInitiateChat): Avec ${targetUser.username} (ID: ${targetUser.id})`);
    
    const existingDM = (Array.isArray(directMessageRooms) ? directMessageRooms : []).find(dm => dm.other_participant && dm.other_participant.id === targetUser.id);
    if(existingDM){ 
        console.log(`FRONTEND (handleInitiateChat): DM existant trouvé (ID: ${existingDM.id}), sélection.`);
        setActiveRoomId(existingDM.id); 
        if(isMobile) setMobileView('chat'); 
        return; 
    }
    console.log(`FRONTEND (handleInitiateChat): Pas de DM existant, création...`);
    try{
      const response = await axios.post(`${API_URL}/chat/conversations/direct`, { partnerId: targetUser.id });
      if(response.data && response.data.room){
        const newDmRoomData = response.data.room;
        console.log('FRONTEND (handleInitiateChat): Réponse création DM:', newDmRoomData);
        
        const partnerInfo = newDmRoomData.other_participant || 
                            (Array.isArray(newDmRoomData.participants) ? newDmRoomData.participants.find(p => p.id !== currentUser.id) : null) ||
                            targetUser; 

        if (!partnerInfo || !partnerInfo.id) {
            console.error("FRONTEND ERREUR (handleInitiateChat): Infos partenaire DM manquantes dans la réponse serveur.");
            throw new Error("Infos partenaire DM manquantes.");
        }

        const formattedDM = {
            id: newDmRoomData.id, 
            name: partnerInfo.username || partnerInfo.name || "Conversation",
            isDirect: true, 
            room_type: 'direct',
            participants: newDmRoomData.participants || [
                {id: currentUser.id, username: currentUser.username, avatar_url: currentUser.avatarUrl},
                {id: partnerInfo.id, username: partnerInfo.username, avatar_url: partnerInfo.avatar_url}
            ],
            other_participant: partnerInfo,
            updated_at: newDmRoomData.updated_at || new Date().toISOString(),
            unread_count: 0, 
            last_message: newDmRoomData.last_message || null
        };
        console.log('FRONTEND (handleInitiateChat): DM formaté pour ajout:', formattedDM);

        setDirectMessageRooms(prevDMs => {
            const currentDMs = Array.isArray(prevDMs) ? prevDMs : [];
            if (currentDMs.find(dm => dm.id === formattedDM.id)) {
                return currentDMs.map(dm => dm.id === formattedDM.id ? formattedDM : dm).sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
            }
            return [formattedDM, ...currentDMs].sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
        });
        setActiveRoomId(formattedDM.id);
        setMessagesByRoom(prev => ({...prev, [formattedDM.id]: newDmRoomData.messages || [] }));
        if(isMobile) setMobileView('chat');
      } else { throw new Error("Réponse serveur invalide pour création DM."); }
    }catch(error){
        const errText = error.response?.data?.message || error.message || "Erreur inconnue.";
        console.error("FRONTEND ERREUR (handleInitiateChat):", errText, error);
        alert("Impossible de démarrer la conversation directe: " + errText);
    }
  };

  const openCreateRoomModal = () => setIsCreateRoomModalOpen(true);
  const closeCreateRoomModal = () => setIsCreateRoomModalOpen(false);
  const handleCreateRoom = async (roomData) => {
    console.log('FRONTEND (handleCreateRoom): Tentative. Données:', roomData);
    if (!currentUser || !token) { console.error("Auth requise."); throw new Error("Auth requise."); }
    try {
      const response = await axios.post(`${API_URL}/chat/rooms`, roomData);
      if (response.data && response.data.room) {
        const newGroupRoom = {...response.data.room, isDirect: false, room_type: 'group', participants: [{id: currentUser.id, username: currentUser.username, avatar_url: currentUser.avatarUrl}] };
        console.log('FRONTEND (handleCreateRoom): Salon créé:', newGroupRoom);
        setGroupRooms(prevGroups => {
            const currentGroups = Array.isArray(prevGroups) ? prevGroups : [];
            return [newGroupRoom, ...currentGroups.filter(g => g.id !== newGroupRoom.id)].sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
        });
        setActiveRoomId(newGroupRoom.id);
        setMessagesByRoom(prev => ({...prev, [newGroupRoom.id]: [] }));
        if(isMobile) setMobileView('chat');
        closeCreateRoomModal();
      } else { throw new Error("Réponse serveur invalide."); }
    } catch (e) { 
        const errText = e.response?.data?.message || e.message || "Échec création.";
        console.error("FRONTEND ERREUR (handleCreateRoom):", errText, e);
        throw new Error(errText); 
    }
  };

  const currentActiveRoomForDisplay = activeRoomDetails || allRoomsRef.current.find(r => r.id === activeRoomId);
  const currentMessagesToDisplay = messagesByRoom[activeRoomId] || [];
  const activeRoomTypersArray = activeRoomId ? Object.keys(typingUsers[activeRoomId] || {}) : [];

  const isLoadingInitialData = (loadingGroupRooms || loadingDirectMessages) && allRoomsRef.current.length === 0;
  if (!currentUser && !token && !isLoadingInitialData) {
    return <Navigate to="/login" replace />;
  }
  if (isLoadingInitialData && !activeRoomIdRef.current) { // Affiche le spinner seulement si aucune room n'a jamais été active non plus
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'calc(100vh - var(--navbar-height, 60px))'}}><LoadingSpinner size="lg"/></div>;
  }

  let appLayoutClasses = "app-layout";
  if (isMobile) {
    if (mobileView === 'sidebar') appLayoutClasses += " show-sidebar";
    else if (mobileView === 'chat') appLayoutClasses += " show-chat-area";
    else if (mobileView === 'details') appLayoutClasses += " show-sidebar-right";
  } else {
    appLayoutClasses += " show-sidebar show-chat-area";
    if(isDesktopSidebarRightVisible) appLayoutClasses += " show-sidebar-right-desktop";
  }

  return (
    <div className={appLayoutClasses}> 
      <Sidebar
        currentUser={currentUser}
        groupRooms={groupRooms}
        directMessageRooms={directMessageRooms}
        loadingLists={isLoadingInitialData}
        activeRoomId={activeRoomId}
        onSelectRoom={handleSelectRoom}
        onOpenCreateRoomModal={openCreateRoomModal}
        onInitiateChat={handleInitiateChatWithUser}
        isMobile={isMobile}
      />
      <ChatArea
        activeRoom={currentActiveRoomForDisplay}
        messages={currentMessagesToDisplay}
        currentUserId={currentUser?.id}
        onSendMessage={handleSendMessage}
        loadingMessages={loadingMessages && !!activeRoomId && currentMessagesToDisplay.length === 0}
        socket={socketRef.current}
        typingUsernames={activeRoomTypersArray}
        isMobile={isMobile}
        onShowSidebarList={handleShowSidebarList}
        onShowDetails={handleToggleRoomDetails}
      />
      {((!isMobile && isDesktopSidebarRightVisible) || (isMobile && mobileView === 'details')) && currentActiveRoomForDisplay && (
        <>
          <SidebarRight 
              activeRoom={currentActiveRoomForDisplay}
              loadingRoomDetails={loadingRoomDetails && !!activeRoomId}
          />
          {isMobile && mobileView === 'details' && (
               <div className="sidebar-right-overlay" onClick={() => setMobileView('chat')}></div>
          )}
        </>
      )}
      <CreateRoomModal isOpen={isCreateRoomModalOpen} onClose={closeCreateRoomModal} onCreateRoom={handleCreateRoom} />
    </div>
  );
}
export default ChatPage;