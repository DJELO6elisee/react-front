import React from 'react'; 
import './SidebarSection.css';


const SidebarSection = ({ title, children }) => {
  

  return (
    <div className="sidebar-section">
      {title && <h4 className="section-title">{title}</h4>}
      <div className="section-content">
        {children}
      </div>
    </div>
  );
};

export default SidebarSection;