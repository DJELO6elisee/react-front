// src/components/common/SelectField.js
import React from 'react';
// Utilisez les mêmes styles que InputField.css ou créez SelectField.css
import './InputField.css'; 

const SelectField = ({ id, label, value, onChange, error, options = [], placeholder, required, ...props }) => {
  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      {label && <label htmlFor={id}>{label}{required && <span className="required-asterisk">*</span>}</label>}
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="input-field" // Réutilise la classe pour un style de base
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};
export default SelectField;