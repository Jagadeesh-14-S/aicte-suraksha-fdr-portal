import React from 'react';

/**
 * High-fidelity vector representations of the State Emblem of India (Lion Capital)
 * and the Official Seal of the All India Council for Technical Education (AICTE).
 */

export const IndiaEmblem: React.FC<{ className?: string }> = ({ className = "w-10 h-12" }) => (
  <svg 
    viewBox="0 0 120 150" 
    fill="currentColor" 
    className={className} 
    aria-label="State Emblem of India"
  >
    {/* Ashoka Lion Capital Vector Silhouette */}
    <g fill="#8B5A2B">
      {/* Central Lion */}
      <path d="M60 12 C55 12 50 15 48 20 C46 16 40 18 38 23 C35 21 30 25 32 30 C28 32 28 38 32 42 C30 46 33 52 38 54 C42 62 50 68 60 70 C70 68 78 62 82 54 C87 52 90 46 88 42 C92 38 92 32 88 30 C90 25 85 21 82 23 C80 18 74 16 72 20 C70 15 65 12 60 12 Z" />
      {/* Left Profile Lion */}
      <path d="M35 28 C30 28 24 33 24 39 C20 42 19 48 23 53 C20 57 22 63 27 66 C32 72 40 76 48 78 C44 72 40 65 38 56 C34 54 32 48 35 44 C32 40 33 34 37 32 Z" />
      {/* Right Profile Lion */}
      <path d="M85 28 C90 28 96 33 96 39 C100 42 101 48 97 53 C100 57 98 63 93 66 C88 72 80 76 72 78 C76 72 80 65 82 56 C86 54 88 48 85 44 C88 40 87 34 83 32 Z" />
      {/* Abacus / Base Platform */}
      <rect x="20" y="80" width="80" height="12" rx="2" fill="#704214" />
      {/* Ashoka Chakra in Central Abacus */}
      <circle cx="60" cy="86" r="5" fill="#1E293B" stroke="#FFFFFF" strokeWidth="1" />
      {/* Stele Pedestal */}
      <path d="M26 92 L94 92 L88 108 L32 108 Z" fill="#8B5A2B" />
      <rect x="22" y="108" width="76" height="6" rx="1" fill="#5C3317" />
    </g>
    {/* Motto: Satyameva Jayate (सत्यमेव जयते) */}
    <text 
      x="60" 
      y="126" 
      textAnchor="middle" 
      fontSize="11" 
      fontFamily="'Noto Sans Devanagari', 'Mangal', serif" 
      fontWeight="bold" 
      fill="#4A2810"
    >
      सत्यमेव जयते
    </text>
  </svg>
);

export const AicteEmblem: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg 
    viewBox="0 0 140 140" 
    fill="none" 
    className={className} 
    aria-label="AICTE Official Seal"
  >
    {/* Outer Gear / Sunburst */}
    <circle cx="70" cy="70" r="66" stroke="#D97706" strokeWidth="3" fill="#FFFBEB" />
    <circle cx="70" cy="70" r="58" stroke="#1E3A8A" strokeWidth="2" strokeDasharray="3 2" />
    <circle cx="70" cy="70" r="54" fill="#1E3A8A" />

    {/* Inner White Field */}
    <circle cx="70" cy="70" r="44" fill="#FFFFFF" />

    {/* Radiant Deepam / Lamp of Learning */}
    <path 
      d="M70 38 C66 45 62 50 62 56 C62 61 65.5 64 70 64 C74.5 64 78 61 78 56 C78 50 74 45 70 38 Z" 
      fill="#DC2626" 
    />
    <path 
      d="M70 42 C68 46 66 49 66 53 C66 56 68 58 70 58 C72 58 74 56 74 53 C74 49 72 46 70 42 Z" 
      fill="#F59E0B" 
    />

    {/* Hansa / Sacred Swan Silhouette */}
    <path 
      d="M48 76 C52 70 60 68 68 70 C74 72 78 78 86 78 C92 78 96 74 96 72 C96 76 90 82 82 82 C72 82 66 75 58 76 C52 76 48 80 44 84 C46 80 46 78 48 76 Z" 
      fill="#1E3A8A" 
    />
    
    {/* Open Book of Knowledge */}
    <path 
      d="M44 88 C54 84 64 85 70 88 C76 85 86 84 96 88 L94 98 C86 94 76 95 70 98 C64 95 54 94 46 98 Z" 
      fill="#D97706" 
    />

    {/* Circular AICTE Devanagari Inscription */}
    <path id="curve" d="M 26 70 A 44 44 0 0 1 114 70" fill="none" />
    <text fontSize="7" fill="#FFFFFF" fontWeight="bold">
      <textPath href="#curve" startOffset="50%" textAnchor="middle">
        योगः कर्मसु कौशलम्
      </textPath>
    </text>
  </svg>
);

