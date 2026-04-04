import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const RocketPromo = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("idle"); // idle, countdown, launch, reveal
  const rocketRef = useRef(null);
  const flameRef = useRef(null);
  const containerRef = useRef(null);
  const launchAudioRef = useRef(null);
  const revealAudioRef = useRef(null);

  const handleLaunch = () => {
    if (!rocketRef.current || !containerRef.current) {
      // Re-try in a bit if refs aren't ready
      setTimeout(handleLaunch, 50);
      return;
    }

    setPhase("launch");

    // Play launch sound
    if (launchAudioRef.current) {
      launchAudioRef.current.currentTime = 0;
      launchAudioRef.current.play().catch(() => {});
    }

    const tl = gsap.timeline();

    tl.to(flameRef.current, {
      scaleY: 10,
      opacity: 1,
      duration: 0.15,
      ease: "power2.out"
    });

    // 2. GROUND BLAST (EXTENDING SIDEWAYS)
    tl.to(".v17-ground-cloud", {
      scale: 3,
      opacity: 0.5,
      stagger: 0.02,
      duration: 1.2,
      ease: "power2.out"
    }, "+=0.1");

    tl.to(rocketRef.current, {
      y: -4200,
      scale: 0.45,
      duration: 3.5,
      ease: "power3.in",
    }, "-=0.1");

    // TRAILING PLUME (SYNCED)
    tl.to(".v17-plume-trail", {
       height: 1800,
       opacity: 0.5,
       duration: 2.5, 
       ease: "power3.in"
    }, "<");

    // 4. FINAL REVEAL (Steady Camera)
    tl.add(() => {
       gsap.killTweensOf(containerRef.current); // STOP SHAKING FOR NAME REVEAL
       gsap.to(containerRef.current, { x: 0, y: 0, duration: 0.2 }); // Reset to center
       setPhase("reveal");
       // Play reveal sound
       if (revealAudioRef.current) {
         revealAudioRef.current.currentTime = 0;
         revealAudioRef.current.play().catch(() => {});
       }
    }, "-=1.5");

    // Calmer Cinematic Shake
    gsap.to(containerRef.current, {
      x: "random(-2, 2)",
      y: "random(-2, 2)",
      duration: 0.08,
      repeat: 120,
      yoyo: true,
      ease: "power1.inOut"
    });

    setTimeout(() => {
      navigate("/home");
    }, 7000);
  };

  // Auto-launch enabled as per user request
  useEffect(() => {
    // 1. Skip if already authenticated
    const authenticated = localStorage.getItem("user");
    // 2. Skip if already seen in this session
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");

    if (authenticated || hasSeenIntro) {
      navigate("/home", { replace: true });
      return;
    }

    // Mark as seen for this session
    sessionStorage.setItem("hasSeenIntro", "true");

    // Small delay to ensure refs are attached and GSAP can see them
    const timer = setTimeout(handleLaunch, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="ultimate-visibility-v17" ref={containerRef}>
      <div className="v17-cosmos">
         <div className={`v17-stars ${phase === 'launch' ? 'active' : ''}`}></div>
         <div className="v17-horizon-glow"></div>
      </div>

      <div className="v17-launch-zone">
        {/* GROUND BLAST SMOKE (SLIGHTLY GRAY FOR CONTRAST) */}
        <div className="v17-ground-blast">
          {[...Array(18)].map((_, i) => (
            <div 
              key={i} 
              className="v17-ground-cloud" 
              style={{ 
                left: `${(i * 6) - 5}%`,
                bottom: "-60px",
                width: `${200 + (i % 5 * 30)}px`,
                height: `${200 + (i % 5 * 30)}px`,
              }}
            ></div>
          ))}
        </div>

        {/* MULTI-TONE SILVER & BLUE ROCKET (VISIBILITY KING) */}
        <div className="v17-rocket-group" ref={rocketRef}>
          {/* TRANSLUCENT TRAILING PLUME */}
          <div className="v17-plume-trail"></div>
          
          <div className="v17-ship">
            {/* POWERFUL ROARING FIRE - NOW BEHIND ROCKET */}
            <div className="v17-fire" ref={flameRef} style={{ zIndex: 1 }}>
              <div className="v17-fire-core"></div>
              <div className="v17-fire-glow-main"></div>
            </div>

            <svg width="120" height="300" viewBox="0 0 120 300" fill="none" style={{ position: 'relative', zIndex: 2 }}>
               <defs>
                  <linearGradient id="rocketBodyGray" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="50%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1E293B" />
                  </linearGradient>
                  <linearGradient id="rocketBodyBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0369A1" />
                    <stop offset="50%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#0369A1" />
                  </linearGradient>
                  <linearGradient id="finGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0891B2" />
                    <stop offset="50%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#0891B2" />
                  </linearGradient>
                  <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#E0F2FE" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </radialGradient>
                  <linearGradient id="metalBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
               </defs>

               {/* REAR FINS (LEFT & RIGHT) */}
               <path d="M15 180 L0 260 L30 260 Z" fill="url(#finGradient)" stroke="#0F172A" strokeWidth="1" />
               <path d="M105 180 L120 260 L90 260 Z" fill="url(#finGradient)" stroke="#0F172A" strokeWidth="1" />

               {/* MAIN BODY - LOWER (BLUE) */}
               <path d="M30 140 L90 140 L90 250 L30 250 Z" fill="url(#rocketBodyBlue)" />
               
               {/* MAIN BODY - UPPER (GRAY/CHARCOAL) */}
               <path d="M30 140 L90 140 L90 50 Q60 0 30 50 Z" fill="url(#rocketBodyGray)" />

               {/* FRONT CENTER FIN */}
               <path d="M60 160 L45 270 L60 285 L75 270 Z" fill="url(#finGradient)" stroke="#0F172A" strokeWidth="1" />

               {/* CABIN WINDOW */}
               <circle cx="60" cy="95" r="18" fill="url(#metalBorder)" />
               <circle cx="60" cy="95" r="14" fill="url(#windowGlow)" stroke="#1E293B" strokeWidth="1"/>
               <path d="M52 87 Q60 80 68 87" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>

               {/* ENGINE EXHAUST PORT */}
               <path d="M40 250 H80 L75 265 H45 Z" fill="#020617" />
            </svg>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {phase === "reveal" && (
          <motion.div 
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="v17-reveal-wrap"
          >
            <div className="v17-logo-box">
              <h1 className="v17-brand-new">CareerPilot</h1>
              <p className="v17-subtitle">NAVIGATING YOUR FUTURE</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={launchAudioRef} src="https://www.orangefreesounds.com/wp-content/uploads/2021/06/Rocket-launching-sound-effect.mp3" preload="auto" />
      <audio ref={revealAudioRef} src="https://cdn.pixabay.com/audio/2022/03/15/audio_731478147d.mp3" preload="auto" />

      <style>{`
        .ultimate-visibility-v17 {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          z-index: 130000;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .v17-cosmos {
          position: absolute;
          inset: 0;
          background: #020617;
        }

        .v17-stars {
          position: absolute;
          inset: 0;
          background: url('https://www.transparenttextures.com/patterns/stardust.png');
          opacity: 0.4;
        }
        .v17-stars.active { animation: v17warp 0.1s linear infinite; }
        @keyframes v17warp { from { transform: translateY(0); } to { transform: translateY(100px); } }

        .v17-horizon-glow {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 30vh;
          background: linear-gradient(to top, rgba(59, 130, 246, 0.2), transparent);
        }

        .v17-launch-zone {
          position: absolute;
          bottom: 10vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          z-index: 100;
        }

        .v17-ground-blast {
          position: absolute;
          bottom: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          pointer-events: none;
          z-index: 50;
        }

        .v17-ground-cloud {
          position: absolute;
          background: #f1f5f9; /* SMOKE Pops Silver Rocket */
          border-radius: 50%;
          opacity: 0;
          filter: blur(60px);
          transform: scale(0);
        }

        .v17-rocket-group { position: relative; z-index: 150; }

        .v17-plume-trail {
           position: absolute;
           top: 220px;
           left: 50%;
           transform: translateX(-50%);
           width: 140px;
           height: 0;
           background: linear-gradient(to bottom, #f1f5f9, rgba(241, 245, 249, 0.4), transparent);
           filter: blur(50px);
           opacity: 0;
           pointer-events: none;
           z-index: -1;
        }

        .v17-blink { animation: v17pulse 0.5s infinite; }
        @keyframes v17pulse { from { opacity: 0.4; } to { opacity: 1; } }

        .v17-fire {
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%) scaleY(0);
          transform-origin: top;
          opacity: 0;
          display: flex;
          justify-content: center;
        }

        .v17-fire-core {
           width: 25px;
           height: 110px;
           background: #fff;
           border-radius: 0 0 50px 50px;
           filter: blur(2px);
           z-index: 2;
           box-shadow: 0 0 30px #fff, 0 0 60px #facc15;
        }

        .v17-fire-glow-main {
          position: absolute;
          top: 0;
          width: 80px;
          height: 180px;
          background: linear-gradient(to bottom, #facc15, #f97316, transparent);
          border-radius: 0 0 80px 80px;
          filter: blur(25px);
          opacity: 0.9;
          animation: v17flicker 0.05s infinite;
        }

        @keyframes v17flicker { 0% { transform: scaleX(0.8) translateY(0); } 100% { transform: scaleX(1.1) translateY(-5px); } }

        .v17-reveal-wrap {
          position: absolute;
          inset: 0;
          background: #fff;
          z-index: 2000;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .v17-logo-box { text-align: center; }
        .v17-brand-new {
          font-size: clamp(3rem, 14vw, 18rem);
          font-weight: 950;
          background: linear-gradient(to bottom, #1e3a8a, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          letter-spacing: -8px;
          text-transform: uppercase;
        }
        .v17-subtitle {
           color: #3b82f6;
           letter-spacing: 20px;
           font-weight: 800;
           margin-top: 2rem;
        }
      `}</style>
    </div>
  );
};

export default RocketPromo;
