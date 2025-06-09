// src/components/ChatArea/MessageInput.js
import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiPaperclip, FiSmile, FiX, FiFileText } from 'react-icons/fi';
import axios from 'axios';
import './MessageInput.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MessageInput = ({ onSendMessage, activeRoomId, socket }) => {
  const [messageText, setMessageText] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(file.name);
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null); setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const emitTyping = (isTypingStatus) => {
    if (socket && socket.connected && activeRoomId) {
      socket.emit('typing', { roomId: activeRoomId, isTyping: isTypingStatus });
    }
  };

  const handleTextChange = (e) => {
    setMessageText(e.target.value);
    if (e.target.value.trim() !== '' && !typingTimeoutRef.current) {
      emitTyping(true);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
      typingTimeoutRef.current = null;
    }, 2000);
  };
  
  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, [activeRoomId, socket]); // Dépendances pour le nettoyage


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !selectedFile) return;

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = null;
    emitTyping(false);

    let uploadedFileDetails = { mediaUrl: null, fileName: null, fileType: null };
    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const uploadResponse = await axios.post(`${API_URL}/chat/upload/file`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedFileDetails = { ...uploadResponse.data }; // Suppose que le backend renvoie { fileUrl, fileName, fileType }
      } catch (error) {
        alert("Échec de l'upload: " + (error.response?.data?.message || error.message));
        setIsUploading(false); return;
      }
    }
    onSendMessage({
      text: messageText.trim(),
      mediaUrl: uploadedFileDetails.fileUrl, // Assurez-vous que c'est bien fileUrl
      fileName: uploadedFileDetails.fileName,
      fileType: uploadedFileDetails.fileType,
    });
    setMessageText(''); removeSelectedFile(); setIsUploading(false);
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      {filePreview && (
        <div className="file-preview-container">
          {selectedFile?.type.startsWith('image/') ? (
            <img src={filePreview} alt="Aperçu" className="file-image-preview" />
          ) : (
            <span className="file-name-preview" title={typeof filePreview === 'string' ? filePreview : ''}>
              <FiFileText style={{ marginRight: '5px'}} /> 
              {typeof filePreview === 'string' ? filePreview : 'Fichier'}
            </span>
          )}
          <button type="button" onClick={removeSelectedFile} className="remove-file-btn" title="Retirer le fichier"><FiX /></button>
        </div>
      )}
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.mp4,.mov,.mp3,.wav" />
      <button type="button" className="input-action-btn" title="Joindre un fichier" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
        <FiPaperclip size={20} />
      </button>
      <input
        type="text"
        className="message-input-field"
        placeholder={isUploading ? "Envoi en cours..." : "Écrivez votre message..."}
        value={messageText}
        onChange={handleTextChange}
        disabled={isUploading}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e); }}
      />
      <button type="button" className="input-action-btn" title="Emojis" disabled={isUploading}><FiSmile size={20} /></button>
      <button type="submit" className="send-btn" title="Envoyer" disabled={isUploading || (!messageText.trim() && !selectedFile)}>
        {isUploading ? <div className="spinner-small"></div> : <FiSend size={20} />}
      </button>
    </form>
  );
};
export default MessageInput;