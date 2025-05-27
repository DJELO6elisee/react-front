// src/components/Sidebar/ContactList.js
import React from 'react';
import Avatar from '../common/Avatar';
import './ContactList.css';

const ContactList = ({ contacts }) => {
  return (
    <div className="contact-list-container">
      <h3 className="list-title">Contacts</h3>
      <ul className="contact-list">
        {contacts.map(contact => (
          <li key={contact.id} className="contact-item">
            <Avatar src={contact.avatarUrl} alt={contact.name} size={32} online={Math.random() > 0.5} /> {/* Statut online aléatoire pour l'exemple */}
            <span className="contact-name">{contact.name}</span>
          </li>
        ))}
      </ul>
      <button className="add-contact-btn">+ Ajouter un contact</button>
    </div>
  );
};

export default ContactList;