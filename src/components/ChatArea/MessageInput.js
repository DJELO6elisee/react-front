// src/components/ChatArea/MessageInput.js
import React, { useState, useRef, useEffect } from 'react';
// FiVolume2 est maintenant importé
import { FiSend, FiPaperclip, FiSmile, FiX, FiFileText, FiMic, FiFilm, FiSquare, FiPlay, FiTrash2, FiVolume2 } from 'react-icons/fi';
import axios from 'axios';
import './MessageInput.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MessageInput = ({ onSendMessage, activeRoomId, socket, isDirectMessageRoom }) => {
  const [messageText, setMessageText] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const mediaRecorderRef = useRef(null);

  const audioChunksRef = useRef([]);
  const audioTimerRef = useRef(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioError, setAudioError] = useState('');
  
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const resetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cleanupAudioState = () => {
    if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
    }
    setAudioBlob(null);
    setAudioPreviewUrl(null);
    setPreviewType(prev => prev === 'audio_note' ? null : prev);
    setIsRecording(false);
    clearInterval(audioTimerRef.current);
    setRecordingTime(0);
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    mediaRecorderRef.current = null;
  };

  const handleFileChange = (event) => {
    if (isRecording || audioBlob) {
        alert("Veuillez d'abord annuler ou envoyer votre note vocale actuelle avant de joindre un fichier.");
        resetFileInput();
        return;
    }
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
        reader.readAsDataURL(file);
        setPreviewType('image');
      } else if (file.type.startsWith('video/')) {
        setFilePreview(file.name);
        setPreviewType('video');
      } else if (file.type.startsWith('audio/')) {
        setFilePreview(file.name);
        setPreviewType('audio_file'); // Pour les fichiers audio uploadés
      } else {
        setFilePreview(file.name);
        setPreviewType('file');
      }
    }
  };

  const removeSelectedFileOrRecording = () => {
    if (selectedFile) {
        setSelectedFile(null); 
        setFilePreview(null);
        setPreviewType(null);
        resetFileInput();
    }
    if (isRecording || audioBlob) {
        cleanupAudioState();
    }
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
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      // cleanupAudioState(); // Nettoie si on change de salon pendant un enregistrement/preview
                           // Peut être trop agressif si on veut garder un preview en changeant de salon puis revenant.
                           // Pour l'instant, on ne nettoie que le timeout de 'typing'.
                           // Le nettoyage audio se fait via removeSelectedFileOrRecording ou handleSubmit.
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId, socket]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("MessageInput (handleSubmit): Début de la soumission.");

    // Vérifier s'il y a quelque chose à envoyer
    if (!messageText.trim() && !selectedFile && !audioBlob) {
        console.warn("MessageInput (handleSubmit): Rien à envoyer (pas de texte, fichier, ou note vocale).");
        return;
    }

    // Gérer l'indicateur "typing"
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = null;
    emitTyping(false); // Indiquer qu'on ne tape plus

    let uploadedFileDetails = { fileUrl: null, fileName: null, fileType: null };
    let finalMessageType = 'standard'; // Type de message par défaut
    let finalIsEphemeral = false;  // Éphémère par défaut à false
    let fileToUpload = selectedFile; // Fichier à uploader (soit selectedFile, soit audioBlob transformé)

    // Traitement si une note vocale a été enregistrée
    if (audioBlob) {
        console.log("MessageInput (handleSubmit): Traitement d'une note vocale enregistrée.");
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Format de timestamp pour nom de fichier
        const audioFileName = `voicenote-${timestamp}.${audioBlob.type.split('/')[1] || 'webm'}`; // ex: voicenote-2023-10-27T10-30-00-000Z.webm
        
        fileToUpload = new File([audioBlob], audioFileName, { type: audioBlob.type });
        finalMessageType = 'voice_note'; // Marquer comme note vocale

        if (isDirectMessageRoom) { // La prop isDirectMessageRoom doit être passée à ce composant
            finalIsEphemeral = true;
            console.log("MessageInput (handleSubmit): Note vocale dans un DM, marquée comme éphémère.");
        } else {
            console.log("MessageInput (handleSubmit): Note vocale dans un salon de groupe, non éphémère.");
        }
        // 'selectedFile' doit être null si on envoie une note vocale (priorité à la note vocale)
        // setSelectedFile(null); // Fait par removeSelectedFileOrRecording à la fin
    }
    
    // Si un fichier (note vocale ou fichier sélectionné) doit être uploadé
    if (fileToUpload) {
        console.log("MessageInput (handleSubmit): Fichier à uploader détecté:", fileToUpload.name);
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', fileToUpload); 
        try {
            console.log("MessageInput (handleSubmit): Début de l'upload du fichier...");
            const uploadResponse = await axios.post(`${API_URL}/chat/upload/file`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Le backend doit renvoyer { fileUrl, fileName, fileType }
            uploadedFileDetails = { 
                fileUrl: uploadResponse.data.fileUrl, 
                fileName: uploadResponse.data.fileName, // Nom de fichier renvoyé par le backend (peut être différent de l'original)
                fileType: uploadResponse.data.fileType  // Type MIME renvoyé par le backend
            };
            console.log("MessageInput (handleSubmit): Upload réussi. Détails:", uploadedFileDetails);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Erreur inconnue d'upload.";
            console.error("MessageInput (handleSubmit) ERREUR D'UPLOAD:", errorMessage, error.response || error);
            alert("Échec de l'upload du fichier: " + errorMessage);
            setIsUploading(false); 
            return; // Arrêter ici si l'upload échoue
        }
    }

    // Préparer le payload pour onSendMessage
    const messagePayload = {
        text: messageText.trim() || null, // Envoyer null si le texte est vide après trim
        mediaUrl: uploadedFileDetails.fileUrl, 
        fileName: uploadedFileDetails.fileName, // Nom du fichier (peut être celui de la note vocale)
        fileType: uploadedFileDetails.fileType, // Type du fichier (peut être celui de la note vocale)
        isEphemeral: finalIsEphemeral,
        messageType: finalMessageType
    };

    console.log("MessageInput (handleSubmit): Appel de onSendMessage avec payload:", JSON.stringify(messagePayload, null, 2));
    onSendMessage(messagePayload);
    
    // Réinitialiser les états après l'envoi
    setMessageText(''); 
    removeSelectedFileOrRecording(); // Ceci nettoie selectedFile, filePreview, audioBlob, audioPreviewUrl, etc.
    setIsUploading(false);
    console.log("MessageInput (handleSubmit): États réinitialisés après envoi.");
};

  const startRecording = async () => {
    if (selectedFile || audioBlob) removeSelectedFileOrRecording();
    setAudioError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setAudioError("L'API MediaDevices n'est pas supportée par votre navigateur.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm;codecs=opus' }; 
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          // console.warn(`${options.mimeType} non supporté, fallback.`);
          delete options.mimeType;
      }
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const completeAudioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
        setAudioBlob(completeAudioBlob);
        const url = URL.createObjectURL(completeAudioBlob);
        setAudioPreviewUrl(url);
        setPreviewType('audio_note');
        stream.getTracks().forEach(track => track.stop());
        // console.log("MessageInput: Enregistrement arrêté. Blob:", completeAudioBlob, "URL Aperçu:", url);
      };
      
      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder Error:", event.error);
        setAudioError(`Erreur MediaRecorder: ${event.error.name}`);
        setIsRecording(false);
        clearInterval(audioTimerRef.current);
        setRecordingTime(0);
      };
      console.log("Stream tracks:", stream.getTracks());
      stream.getTracks().forEach(track => {
          console.log(`Track settings: kind=${track.kind}, label=${track.label}, enabled=${track.enabled}, muted=${track.muted}, readyState=${track.readyState}`);
      });
      console.log("MediaRecorder state before start:", mediaRecorderRef.current.state);
      console.log("MediaRecorder mimeType:", mediaRecorderRef.current.mimeType);
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioError(''); // Clear previous errors
      setRecordingTime(0);
      audioTimerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);

    } catch (err) {
      console.error("Erreur accès microphone:", err.name, err.message);
      let userMessage = "Impossible d'accéder au microphone.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userMessage = "Permission d'accès au microphone refusée.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        userMessage = "Aucun microphone trouvé.";
      }
      setAudioError(userMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    clearInterval(audioTimerRef.current);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const renderFilePreview = () => {
    if(isRecording) {
        return <span className="recording-indicator"><FiMic style={{ marginRight: '5px', color: 'red' }}/>Enregistrement... {formatTime(recordingTime)}</span>;
    }
    if (audioPreviewUrl && previewType === 'audio_note') {
        return (
            <div className="audio-note-preview">
                <FiPlay aria-label="Écouter l'aperçu" style={{ marginRight: '8px', cursor: 'pointer' }} onClick={() => {
                    const player = document.getElementById('audio-preview-player');
                    if (player) player.play().catch(e => console.error("Erreur lecture aperçu:", e));
                }}/>
                Note Vocale ({formatTime(recordingTime)})
                {/* Lecteur audio caché pour l'aperçu, contrôlé par le bouton FiPlay */}
                <audio id="audio-preview-player" src={audioPreviewUrl} preload="metadata" style={{ display: 'none' }}/> 
            </div>
        );
    }
    if (!selectedFile && !filePreview) return null; // Modifié pour vérifier selectedFile aussi
    
    let icon = <FiFileText style={{ marginRight: '5px'}} />;
    if (previewType === 'image' && typeof filePreview === 'string') { // typeof string car c'est une dataURL pour les images
        return <img src={filePreview} alt="Aperçu du fichier" className="file-image-preview" />;
    }
    if (previewType === 'video') icon = <FiFilm style={{ marginRight: '5px'}} />;
    if (previewType === 'audio_file') icon = <FiVolume2 style={{ marginRight: '5px'}} />; // FiVolume2 est utilisé ici

    return (
        <span className="file-name-preview" title={selectedFile?.name || ''}>
            {icon} 
            {selectedFile?.name || 'Fichier'}
        </span>
    );
  };
  
  const canSubmit = !isUploading && !isRecording && (messageText.trim() !== '' || selectedFile || audioBlob);
  const showMicButton = !messageText.trim() && !selectedFile && !audioBlob && !isRecording;

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      {audioError && <p className="form-error-message preview-error-message">{audioError}</p>}
      {(filePreview || audioPreviewUrl || isRecording) && (
        <div className="file-preview-container">
          {renderFilePreview()}
          <button type="button" onClick={removeSelectedFileOrRecording} className="remove-file-btn" title={isRecording ? "Annuler l'enregistrement" : "Retirer le fichier"}>
            {isRecording ? <FiTrash2 /> : <FiX />} 
          </button>
        </div>
      )}
      <input 
        type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} 
        accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" 
      />
      <button 
        type="button" className="input-action-btn" title="Joindre un fichier" 
        onClick={() => { if(!isRecording && !audioBlob) fileInputRef.current?.click(); }}
        disabled={isUploading || isRecording || !!audioBlob}
      >
        <FiPaperclip size={20} />
      </button>
      <input
        type="text" className="message-input-field"
        placeholder={isUploading ? "Envoi en cours..." : (isRecording ? "Enregistrement en cours..." : (audioBlob ? "Note vocale prête. Ajoutez un texte ou envoyez." : "Écrivez votre message..."))}
        value={messageText} onChange={handleTextChange}
        disabled={isUploading || isRecording} // On ne désactive plus si audioBlob est prêt pour permettre d'ajouter du texte
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !isRecording) handleSubmit(e); }}
      />
      
      {showMicButton ? (
        <button type="button" className="input-action-btn record-btn" title="Enregistrer une note vocale" onClick={startRecording} disabled={isUploading}>
          <FiMic size={20} />
        </button>
      ) : isRecording ? (
        <button type="button" className="input-action-btn stop-record-btn recording" title="Arrêter l'enregistrement" onClick={stopRecording} disabled={isUploading}>
          <FiSquare size={20} />
        </button>
      ) : ( // Si texte, OU fichier sélectionné, OU note vocale prête
        <>
          <button type="button" className="input-action-btn" title="Emojis" disabled={isUploading || isRecording}><FiSmile size={20} /></button>
          <button type="submit" className="send-btn" title="Envoyer" disabled={!canSubmit}>
            {isUploading ? <div className="spinner-small"></div> : <FiSend size={20} />}
          </button>
        </>
      )}
    </form>
  );
};
export default MessageInput;