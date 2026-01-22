'use client';

// TechHub.bg - Logo Component
// Supports separate images for dark/light themes

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  width?: number;
  isDark?: boolean;
  className?: string;
}

// Main Logo Component - Uses images from public folder
export const Logo: React.FC<LogoProps> = ({ width = 170, isDark = true, className }) => {
  const [imageError, setImageError] = useState(false);
  
  // Logo paths - place your logo files in public/images/
  const darkThemeLogo = '/images/logo-white.png';  // White logo for dark theme
  const lightThemeLogo = '/images/logo-dark.png';  // Dark logo for light theme
  
  const logoSrc = isDark ? darkThemeLogo : lightThemeLogo;
  const height = Math.round(width * 0.22);

  if (imageError) {
    return <LogoFallback width={width} isDark={isDark} className={className} />;
  }

  return (
    <Link href="/" className={className}>
      <Image
        src={logoSrc}
        alt="TechHub.bg"
        width={width}
        height={height}
        priority
        onError={() => setImageError(true)}
        style={{ objectFit: 'contain' }}
      />
    </Link>
  );
};

// Fallback SVG Logo (used if image fails to load)
export const LogoFallback: React.FC<LogoProps> = ({ width = 170, isDark = true, className }) => {
  const mainColor = isDark ? '#FFFFFF' : '#101720';
  const height = Math.round(width * 0.22);

  return (
    <Link href="/" className={className}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 180 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* TEC */}
        <text 
          x="0" 
          y="30" 
          fill={mainColor} 
          fontSize="28" 
          fontFamily="'Russo One', sans-serif" 
          fontWeight="400" 
          letterSpacing="-1"
        >
          TEC
        </text>
        
        {/* HH Symbol - The distinctive double-H geometric mark */}
        <g transform="translate(62, 6)">
          {/* First H with arrow */}
          <path 
            d="M0 0L8 0L8 10L12 10L12 0L20 0L20 28L12 28L12 18L8 18L8 28L0 28L0 0Z" 
            fill={mainColor}
          />
          {/* Arrow pointing right in first H */}
          <path 
            d="M8 10L12 14L8 18L8 10Z" 
            fill={isDark ? '#101720' : '#FFFFFF'}
          />
          
          {/* Second H with arrow */}
          <path 
            d="M24 0L32 0L32 10L36 10L36 0L44 0L44 28L36 28L36 18L32 18L32 28L24 28L24 0Z" 
            fill={mainColor}
          />
          {/* Arrow pointing right in second H */}
          <path 
            d="M32 10L36 14L32 18L32 10Z" 
            fill={isDark ? '#101720' : '#FFFFFF'}
          />
        </g>
        
        {/* UB */}
        <text 
          x="110" 
          y="30" 
          fill={mainColor} 
          fontSize="28" 
          fontFamily="'Russo One', sans-serif" 
          fontWeight="400" 
          letterSpacing="-1"
        >
          UB
        </text>
        
        {/* .BG */}
        <text 
          x="152" 
          y="18" 
          fill={mainColor} 
          fontSize="12" 
          fontFamily="'Russo One', sans-serif" 
          fontWeight="400"
        >
          .BG
        </text>
      </svg>
    </Link>
  );
};

export default Logo;
