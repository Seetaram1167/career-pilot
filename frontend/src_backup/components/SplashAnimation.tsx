import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { Rocket } from 'lucide-react';
import styles from './SplashAnimation.module.css';

// Context to allow triggering the splash from anywhere
interface SplashContextType {
  triggerSplash: () => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export const useSplash = () => {
  const context = useContext(SplashContext);
  if (!context) throw new Error('useSplash must be used within SplashProvider');
  return context;
};

// Main Component
interface SplashProviderProps {
  children: ReactNode;
}

export const SplashProvider = ({ children }: SplashProviderProps) => {
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState<'stars' | 'warp' | 'shockwave' | 'reveal' | 'fade'>('stars');

  const triggerSplash = () => {
    if (isActive) return;
    setIsActive(true);
    setPhase('stars');
  };

  useEffect(() => {
    if (isActive) {
      // Sequence timing for Hyper-Cinematic VFX Intro
      // 0.0s - 1.0s: Starfield static (stars)
      // 1.0s - 2.2s: Stars accelerate to warp speed (warp)
      // 2.2s - 2.8s: Rocket boosts in, shockwave explosion (shockwave)
      // 2.8s - 4.5s: Dust clears, text reveals with heavy lens flares (reveal)
      // 4.5s - 5.5s: Cross-fade to website (fade)
      
      const warpTimer = setTimeout(() => setPhase('warp'), 1000); 
      const shockwaveTimer = setTimeout(() => setPhase('shockwave'), 2200);
      const revealTimer = setTimeout(() => setPhase('reveal'), 2800);
      const fadeTimer = setTimeout(() => setPhase('fade'), 4500);   
      const endTimer = setTimeout(() => setIsActive(false), 5500);  

      return () => {
        clearTimeout(warpTimer);
        clearTimeout(shockwaveTimer);
        clearTimeout(revealTimer);
        clearTimeout(fadeTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isActive]);

  return (
    <SplashContext.Provider value={{ triggerSplash }}>
      {isActive && (
        <div className={`${styles.splashOverlay} ${phase === 'fade' ? styles.fadeOut : ''}`}>
          
          {/* Deep Space Background */}
          <div className={styles.spaceBackground}></div>

          {/* Starfield & Warp Speed Lines */}
          <div className={`${styles.starfield} ${phase === 'warp' || phase === 'shockwave' ? styles.warpSpeed : ''} ${phase === 'reveal' ? styles.fadeStars : ''}`}>
             <div className={styles.stars1}></div>
             <div className={styles.stars2}></div>
             <div className={styles.stars3}></div>
          </div>

          <div className={styles.animationContainer}>
            
            {/* The Rocket & Shockwave Sequence */}
            {(phase === 'warp' || phase === 'shockwave') && (
              <div className={`${styles.rocketContainer} ${phase === 'shockwave' ? styles.rocketImpact : ''}`}>
                 <div className={styles.rocketAura}></div>
                 <div className={styles.rocketBoostFire}></div>
                 {/* Extra engine sparks */}
                 <div className={`${styles.spark} ${styles.s1}`}></div>
                 <div className={`${styles.spark} ${styles.s2}`}></div>
                 <div className={`${styles.spark} ${styles.s3}`}></div>
                 <div className={`${styles.spark} ${styles.s4}`}></div>
                 <div className={`${styles.spark} ${styles.s5}`}></div>
                 <Rocket size={80} className={styles.rocketGraphic} fill="var(--vibrant-blue)" stroke="none" />
              </div>
            )}

            {phase === 'shockwave' && (
              <div className={styles.shockwaveContainer}>
                 <div className={styles.shockwaveRing1}></div>
                 <div className={styles.shockwaveRing2}></div>
                 <div className={styles.shockwaveFlash}></div>
              </div>
            )}

            {/* Cinematic Text Reveal */}
            <div className={`${styles.brandContainer} ${phase === 'reveal' ? styles.cinematicReveal : ''}`}>
              <div className={styles.textGlowBox}>
                 <h1 className={styles.brandTitle}>
                   <span className={styles.careerText}>Career</span>
                   <span className={styles.pilotText}>Pilot</span>
                 </h1>
                 <div className={styles.lensFlare}></div>
                 <div className={styles.glitchOverlay}></div>
              </div>
              <p className={styles.subtitleTeaser}>Navigating Your Future</p>
            </div>

            {/* Ambient Nebula / Graphic Blobs */}
            <div className={`${styles.nebula1} ${phase === 'reveal' ? styles.showNebula : ''}`}></div>
            <div className={`${styles.nebula2} ${phase === 'reveal' ? styles.showNebula : ''}`}></div>

          </div>
        </div>
      )}
      <div className={isActive && phase !== 'fade' ? 'hidden-overflow' : ''}>
        {children}
      </div>
    </SplashContext.Provider>
  );
};
