import React, { useState } from 'react';
import './styles.css';

const InfoTooltip = ({ content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="tooltip-container">
      <button 
        className="info-button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        i
      </button>
      {isVisible && (
        <div className="tooltip-content">
          {content}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
