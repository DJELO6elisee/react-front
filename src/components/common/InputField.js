// src/components/common/InputField.js
import React from 'react';
import './InputField.css'; // Créez ce fichier CSS

const InputField = ({ id, label, type = "text", placeholder, value, onChange, error, icon, required, ...props }) => {
  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      {label && <label htmlFor={id}>{label}{required && <span className="required-asterisk">*</span>}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`input-field ${icon ? 'has-icon' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
export default InputField;