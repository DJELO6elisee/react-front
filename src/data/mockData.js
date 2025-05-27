// src/data/mockData.js
export const usersData = {
  'user1': { id: 'user1', name: 'Alice Wonderland', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
  'user2': { id: 'user2', name: 'Bob The Builder', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
  'user3': { id: 'user3', name: 'Charlie Chaplin', avatarUrl: 'https://i.pravatar.cc/150?u=charlie' },
  'user4': { id: 'user4', name: 'Diana Prince', avatarUrl: 'https://i.pravatar.cc/150?u=diana' },
  'user5': { id: 'user5', name: 'Edward Scissorhands', avatarUrl: 'https://i.pravatar.cc/150?u=edward' },
  'currentUser': { id: 'currentUser', name: 'Vous (Moi)', avatarUrl: 'https://i.pravatar.cc/150?u=me' },
};

export const roomsData = [
  {
    id: 'room1',
    name: 'Général',
    unread: 2,
    icon: 'FaHashtag', // Assurez-vous que cette icône est gérée dans RoomList.js
    description: 'Discussions générales, annonces importantes et liens utiles pour toute l\'équipe.',
    participants: ['currentUser', 'user1', 'user2', 'user4', 'user5'], // IDs des utilisateurs
    media: [
      { id: 'media1', type: 'image', url: 'https://source.unsplash.com/random/400x300?office,workspace', name: 'Nouveau Bureau Q3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
      { id: 'media2', type: 'image', url: 'https://source.unsplash.com/random/400x300?team,meeting', name: 'Photo Équipe Retraite', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() },
      { id: 'media3', type: 'image', url: 'https://source.unsplash.com/random/400x300?infographic,chart', name: 'Infographie Performance', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
      { id: 'media7', type: 'image', url: 'https://source.unsplash.com/random/400x300?coffee,break', name: 'Pause Café', timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString() },

    ],
    attachments: [ // "Mentioned Documents" et "Attachments" peuvent être ici
      { id: 'attach1', type: 'document', name: 'Rapport Trimestriel Q3.pdf', source: 'Google Drive', url: '#', size: '2.5MB', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: 'attach2', type: 'link', name: 'Article Inspirant sur le Design Thinking', source: 'medium.com', url: 'https://medium.com', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      { id: 'attach4', type: 'document', name: 'Présentation Client.pptx', source: 'OneDrive', url: '#', size: '5.1MB', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    ]
  },
  {
    id: 'room2',
    name: 'Design Team',
    unread: 0,
    icon: 'FaPaintBrush',
    description: 'Espace de collaboration pour l\'équipe design. Partage de maquettes, feedbacks et inspiration.',
    participants: ['currentUser', 'user3', 'user1'],
    media: [
      { id: 'media4', type: 'image', url: 'https://source.unsplash.com/random/400x300?design,mockup', name: 'Mockup App Mobile', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() },
      { id: 'media5', type: 'image', url: 'https://source.unsplash.com/random/400x300?palette,color', name: 'Palette Couleurs Projet', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
      { id: 'media6', type: 'image', url: 'https://source.unsplash.com/random/400x300?ui,ux', name: 'Wireframes v1', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    ],
    attachments: [
      { id: 'attach3', type: 'document', name: 'Guide de Style v2.1.fig', source: 'Figma', url: '#', size: '12MB', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { id: 'attach5', type: 'link', name: 'Collection Dribbble UI Kits', source: 'dribbble.com', url: 'https://dribbble.com', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() },
    ]
  },
  {
    id: 'room3',
    name: 'Projet Alpha',
    unread: 5,
    icon: 'FaRocket',
    description: 'Suivi de l\'avancement, blocages et prochaines étapes pour le Projet Alpha.',
    participants: ['currentUser', 'user1', 'user2', 'user3', 'user5'],
    media: [],
    attachments: [
      { id: 'attach6', type: 'document', name: 'Spécifications Techniques v1.3.docx', source: 'SharePoint', url: '#', size: '850KB', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString() },
    ]
  },
  {
    id: 'room4',
    name: 'Pause Café ☕',
    unread: 0,
    icon: 'FaCoffee',
    description: 'Pour les discussions informelles, les mèmes et tout ce qui n\'est pas lié au travail.',
    participants: ['currentUser', 'user1', 'user2', 'user3', 'user4', 'user5'],
    media: [
        { id: 'media8', type: 'image', url: 'https://source.unsplash.com/random/400x300?funny,cat', name: 'Chat Drôle', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    ],
    attachments: []
  },
];

export const contactsData = [
  usersData['user1'],
  usersData['user2'],
  usersData['user3'],
  usersData['user4'],
  usersData['user5'],
];

// messagesData reste tel quel, mais vous pourriez à terme vouloir que les messages
// contiennent des références aux médias ou pièces jointes pour les lier
export const messagesData = {
  'room1': [
    { id: 'msg1', roomId: 'room1', senderId: 'user1', text: 'Salut tout le monde ! 👋 Comment ça va aujourd\'hui ?', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
    { id: 'msg2', roomId: 'room1', senderId: 'currentUser', text: 'Hello Alice ! Bien et toi ? J\'ai regardé le Rapport Trimestriel Q3, c\'est du bon boulot !', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: 'msg3', roomId: 'room1', senderId: 'user2', text: 'Hey ! Prêts pour la réunion de 14h concernant la présentation client ?', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: 'msg4', roomId: 'room1', senderId: 'user1', text: 'Oui, presque ! Juste un dernier slide à peaufiner. Tu as vu la photo du nouveau bureau ? C\'est top !', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  ],
  'room2': [
    { id: 'msg5', roomId: 'room2', senderId: 'user3', text: 'Quelqu\'un a vu la dernière version du mockup pour l\'app mobile ? J\'ai besoin de vos retours.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'msg6', roomId: 'room2', senderId: 'currentUser', text: 'Oui, Charlie, je l\'ai vue. Super boulot sur les ombres et la palette de couleurs ! 👍 J\'ai mis quelques commentaires sur Figma.', timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString() },
  ],
  'room3': [
    { id: 'msg8', roomId: 'room3', senderId: 'user5', text: 'Les spécifications techniques v1.3 sont disponibles sur SharePoint.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  ],
  'room4': [
    { id: 'msg7', roomId: 'room4', senderId: 'user2', text: 'Café quelqu\'un ? ☕ Je vais en faire un grand thermos.', timestamp: new Date().toISOString() },
    { id: 'msg9', roomId: 'room4', senderId: 'user4', text: 'Regardez ce chat trop mignon !', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), mediaUrl: 'https://source.unsplash.com/random/400x300?funny,cat' }, // Exemple de message avec média
  ],
};