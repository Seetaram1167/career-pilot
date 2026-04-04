import React from "react";
import { motion } from "framer-motion";

const SchoolBoyAnimation = ({ isPulling, pullProgress }) => {
  return (
    <div className="school-boy-studio" style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 20,
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)'
    }}>
      {/* REFLECTIVE FLOOR */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '42%',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(15px)',
        borderTop: '2px solid rgba(255,255,255,0.4)',
        boxShadow: 'inset 0 10px 30px -10px rgba(0,0,0,0.1)'
      }} />

      {/* BRAIDED ROPE (High Fidelity) */}
      <motion.svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <linearGradient id="ropeTube" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="30%" stopColor="#92400E" />
            <stop offset="70%" stopColor="#451A03" />
            <stop offset="100%" stopColor="#2D1102" />
          </linearGradient>
          <pattern id="ropeBraid" x="0" y="0" width="40" height="24" patternUnits="userSpaceOnUse">
             <path d="M0 12 C10 0, 30 0, 40 12 M0 12 C10 24, 30 24, 40 12" stroke="rgba(0,0,0,0.4)" strokeWidth="4" fill="none" />
             <path d="M0 6 C20 -6, 20 18, 40 6" stroke="rgba(255,255,255,0.15)" strokeWidth="2" fill="none" />
          </pattern>
        </defs>
        <motion.rect
          x={`${30 + pullProgress * 5}%`}
          y="56%"
          width="150%"
          height="18"
          fill="url(#ropeTube)"
          rx="9"
          animate={{ x: isPulling ? [0, -4, 0] : 0 }}
        />
        <motion.rect
           x={`${30 + pullProgress * 5}%`}
           y="56%"
           width="150%"
           height="18"
           fill="url(#ropeBraid)"
           rx="9"
        />
      </motion.svg>

      {/* THE BOY (Premium 3D character) */}
      <motion.div
        style={{ position: 'absolute', bottom: '15%', left: '15%', width: '260px', height: '340px' }}
        animate={{ x: isPulling ? [-5, 5, -5] : 0, scale: isPulling ? 1.01 : 1 }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, height: '100%', transform: 'scaleY(-0.5) translateY(40px)', opacity: 0.1, filter: 'blur(8px)', transformOrigin: 'top' }}>
           <PremiumBoy isPulling={isPulling} />
        </div>
        <PremiumBoy isPulling={isPulling} />
      </motion.div>
    </div>
  );
};

const PremiumBoy = ({ isPulling }) => (
  <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
    <defs>
      <radialGradient id="faceGrad" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </radialGradient>
      <filter id="softShadow"><feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" /></filter>
    </defs>

    {/* Feet/Shadow */}
    <ellipse cx="100" cy="290" rx="60" ry="12" fill="rgba(0,0,0,0.15)" filter="blur(6px)" />

    {/* Hair */}
    <path d="M50 50 C50 0, 150 0, 150 50 L160 80 Q100 65 40 80 Z" fill="#1A1A1A" filter="url(#softShadow)" />

    {/* Head */}
    <path d="M60 60 C60 40, 140 40, 140 60 C150 110, 100 145, 60 110 Z" fill="url(#faceGrad)" />
    
    {/* Concentrated Eyes */}
    <g transform="translate(0, 5)">
      <ellipse cx="85" cy="85" rx="7" ry="9" fill="white" />
      <circle cx="87" cy="87" r="4" fill="#0F172A" />
      <ellipse cx="115" cy="85" rx="7" ry="9" fill="white" />
      <circle cx="113" cy="87" r="4" fill="#0F172A" />
    </g>

    {/* Body / Shirt */}
    <motion.g animate={{ rotate: isPulling ? -8 : 0, x: isPulling ? -5 : 0 }}>
       <path d="M55 130 H145 L155 210 H45 Z" fill="#FFFFFF" filter="url(#softShadow)" />
       <path d="M92 130 H108 L112 155 L100 190 L88 155 Z" fill="#DC2626" /> {/* Tie */}
       <path d="M92 130 H108 L110 140 H90 Z" fill="#991B1B" />
    </motion.g>

    {/* Hands (Tightly gripping rope) */}
    <motion.g animate={{ x: isPulling ? [0, 4, 0] : 0 }}>
       <circle cx="160" cy="170" r="14" fill="url(#faceGrad)" filter="url(#softShadow)" />
       <circle cx="180" cy="170" r="14" fill="url(#faceGrad)" filter="url(#softShadow)" />
    </motion.g>

    {/* Shorts (Navy) */}
    <path d="M45 210 H155 L160 255 L105 255 L100 240 L95 255 L40 255 Z" fill="#1E3A8A" />

    {/* Legs */}
    <path d="M70 255 L60 290" stroke="url(#faceGrad)" strokeWidth="16" strokeLinecap="round" />
    <path d="M130 255 L140 290" stroke="url(#faceGrad)" strokeWidth="16" strokeLinecap="round" />

    {/* Shoes */}
    <path d="M40 290 H70 V300 H35 Q35 290 40 290" fill="#1E40AF" stroke="white" strokeWidth="2" />
    <path d="M130 290 H160 V300 H165 Q165 290 160 290" fill="#1E40AF" stroke="white" strokeWidth="2" />
  </svg>
);

export default SchoolBoyAnimation;
