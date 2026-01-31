
import React from 'react';

interface CuidiLogoProps {
  size?: number;
  className?: string;
  inverted?: boolean;
}

export const CuidiLogo: React.FC<CuidiLogoProps> = ({ size = 120, className = "", inverted = false }) => {
  const [error, setError] = React.useState(false);
  return error ? (
    <div style={{ width: size, height: size * 0.7, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontWeight: 'bold' }} className={className}>
      Logo
    </div>
  ) : (
    <img
      src="/cuidi-logo.png"
      alt="CUIDI Logo"
      width={size}
      height={size * 0.7}
      className={`object-contain ${className}`}
      style={inverted ? { filter: 'brightness(0) invert(1)' } : {}}
      onError={() => setError(true)}
    />
  );
};
