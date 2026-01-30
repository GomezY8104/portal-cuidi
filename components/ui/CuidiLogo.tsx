
import React from 'react';

interface CuidiLogoProps {
  size?: number;
  className?: string;
  inverted?: boolean;
}

export const CuidiLogo: React.FC<CuidiLogoProps> = ({ size = 120, className = "", inverted = false }) => {
  const textColor = inverted ? "#FFFFFF" : "#1B4D89";
  const cloudFill = inverted ? "rgba(255,255,255,0.1)" : "#E1F5FE";
  const cloudStroke = inverted ? "#FFFFFF" : "#4A90E2";
  const greenHealth = "#34C759";

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size * 0.7} 
        viewBox="0 0 240 160" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cloud Base */}
        <path 
          d="M175 115C202.6 115 225 92.6 225 65C225 37.4 202.6 15 175 15C172.5 15 170 15.2 167.6 15.6C156.4 6 141.5 0 125 0C101 0 81 16 76.5 38C74.5 37.5 72.3 37.2 70 37.2C53.4 37.2 40 50.6 40 67.2C40 68.8 40.1 70.4 40.3 71.9C23.2 76.4 10 92.1 10 111C10 133 28 151 50 151H175C202.6 151 225 128.6 225 101" 
          fill={cloudFill} 
          stroke={cloudStroke} 
          strokeWidth="4"
        />
        
        {/* Health Cross */}
        <g transform="translate(115, 25)">
          <rect x="0" y="8" width="12" height="12" fill={inverted ? "#FFF" : "#1B4D89"} />
          <rect x="-14" y="8" width="12" height="12" fill={greenHealth} />
          <rect x="14" y="8" width="12" height="12" fill={greenHealth} />
          <rect x="0" y="-6" width="12" height="12" fill={greenHealth} />
          <rect x="0" y="22" width="12" height="12" fill={greenHealth} />
        </g>

        {/* Text CUiDi */}
        <text 
          x="118" 
          y="100" 
          textAnchor="middle" 
          fill={textColor} 
          style={{ font: 'bold 58px sans-serif', letterSpacing: '-3px' }}
        >
          CUiDi
        </text>

        {/* Circuity terminations */}
        <path d="M60 145C60 155 40 155 30 155" stroke={greenHealth} strokeWidth="3" />
        <circle cx="25" cy="155" r="4" fill="white" stroke={greenHealth} strokeWidth="2" />
        
        <path d="M100 145C100 160 80 160 70 160" stroke={inverted ? "#FFF" : "#1B4D89"} strokeWidth="3" />
        <circle cx="65" cy="160" r="4" fill="white" stroke={inverted ? "#FFF" : "#1B4D89"} strokeWidth="2" />
      </svg>
    </div>
  );
};
