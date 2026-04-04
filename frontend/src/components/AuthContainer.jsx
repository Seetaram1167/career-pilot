import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import SchoolBoyAnimation from "./SchoolBoyAnimation";

const AuthContainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFlipped, setIsFlipped] = useState(location.pathname === "/signup");
  const [pullProgress, setPullProgress] = useState(0);
  const [isSequenceDone, setIsSequenceDone] = useState(false);
  const [isTugging, setIsTugging] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Cinematic weighted entrance - v3.1 Pulse Physics
    let progress = 0;
    const animate = () => {
      const time = Date.now() / 1000;
      // Intense pull pulse every 1.5 seconds
      const tugStrength = Math.max(0, Math.sin(time * 5.5)); 
      
      setIsTugging(tugStrength > 0.5);

      if (progress < 1) {
        // Friction-based momentum: more progress during heavy tugs
        progress += (0.0015 + tugStrength * 0.007);
        setPullProgress(Math.min(progress, 1));
        timerRef.current = requestAnimationFrame(animate);
      } else {
        setPullProgress(1);
        setIsTugging(false);
        setTimeout(() => setIsSequenceDone(true), 1200);
      }
    };

    timerRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(timerRef.current);
  }, []);

  return (
    <div className="auth-master-wrap" style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#0d1117',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* ANIMATION LAYER */}
      {!isSequenceDone && (
        <SchoolBoyAnimation isPulling={isTugging} pullProgress={pullProgress} />
      )}

      {/* 3D CARD LAYER */}
      <motion.div
        className="auth-perspective-mount"
        style={{
          perspective: '2000px',
          width: '100%',
          maxWidth: '500px',
          zIndex: 10,
          position: 'relative',
          // Horizontal drag synced with pullProgress
          x: isSequenceDone ? 0 : (1 - pullProgress) * 1200,
          y: isSequenceDone ? 0 : 30 // Matches the rope height (60%)
        }}
        animate={{
          // Sub-pulse movement for realism
          x: isSequenceDone ? 0 : (1 - pullProgress) * 1200 + (isTugging ? -5 : 0)
        }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          style={{
            width: '100%',
            transformStyle: 'preserve-3d',
            position: 'relative'
          }}
        >
          {/* FRONT: LOGIN */}
          <div style={{
            backfaceVisibility: 'hidden',
            width: '100%',
            filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))'
          }}>
            <Login isSubComponent={true} onSwitch={() => setIsFlipped(true)} />
          </div>

          {/* BACK: SIGNUP */}
          <div style={{
            backfaceVisibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            transform: 'rotateY(180deg)',
            filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))'
          }}>
            <SignUp isSubComponent={true} onSwitch={() => setIsFlipped(false)} />
          </div>
        </motion.div>
      </motion.div>

      {/* FOOTER LABEL */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        width: '100%',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.8rem',
        letterSpacing: 1,
        textTransform: 'uppercase'
      }}>
        CareerPilot Secure Access
      </div>
    </div>
  );
};

export default AuthContainer;
