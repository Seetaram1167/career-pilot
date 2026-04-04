import { useState, useEffect, createContext, useContext } from "react";
import { Rocket } from "lucide-react";

const SplashContext = createContext(undefined);

export const useSplash = () => {
  const context = useContext(SplashContext);
  if (!context) throw new Error("useSplash must be used within SplashProvider");
  return context;
};

export const SplashProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(true);
  const [phase, setPhase] = useState("stars");

  const triggerSplash = () => {
    if (isActive) return;
    setIsActive(true);
    setPhase("stars");
  };

  useEffect(() => {
    if (isActive) {
      const warpTimer = setTimeout(() => setPhase("warp"), 1000);
      const shockwaveTimer = setTimeout(() => setPhase("shockwave"), 2200);
      const revealTimer = setTimeout(() => setPhase("reveal"), 2800);
      const fadeTimer = setTimeout(() => setPhase("fade"), 4500);
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

  const splashStyles = `
    .splash-splashOverlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      background-color: #020617;
    }
    .splash-fadeOut {
      opacity: 0;
      pointer-events: none;
      transition: opacity 1s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .splash-spaceBackground {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at bottom, #1E1B4B 0%, #020617 100%);
      z-index: 0;
    }
    .splash-animationContainer {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 10;
      animation: screenShake 4.5s ease-in-out forwards;
    }
    @keyframes screenShake {
      0%, 20% { transform: translate(0, 0); }
      25%, 35%, 45% { transform: translate(-2px, 2px); }
      30%, 40%, 50% { transform: translate(2px, -2px); }
      55% { transform: translate(-4px, 4px); }
      60% { transform: translate(4px, -4px); }
      65% { transform: translate(-6px, 6px); }
      70% { transform: translate(6px, -6px); }
      75% { transform: translate(-2px, 2px); }
      80%, 100% { transform: translate(0, 0); }
    }
    .splash-starfield {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      transition: opacity 1s;
    }
    .splash-fadeStars {
      opacity: 0.2;
    }
    .splash-stars1, .splash-stars2, .splash-stars3 {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 50%;
      background: transparent;
    }
    .splash-stars1 {
      width: 2px;
      height: 2px;
      box-shadow: 10vw 20vh #fff, 40vw 10vh #fff, 80vw 30vh #fff, 20vw 80vh #fff, 60vw 60vh #fff, 90vw 90vh #fff, 10vw 90vh #fff, 50vw 40vh #fff;
      animation: moveStars 100s linear infinite;
    }
    .splash-stars2 {
      width: 3px;
      height: 3px;
      box-shadow: 15vw 70vh #fff, 45vw 20vh #fff, 75vw 80vh #fff, 25vw 30vh #fff, 65vw 10vh #fff, 85vw 50vh #fff, 5vw 50vh #fff;
      animation: moveStars 75s linear infinite;
    }
    .splash-stars3 {
      width: 4px;
      height: 4px;
      box-shadow: 30vw 40vh #fff, 70vw 70vh #fff, 10vw 10vh #fff, 90vw 20vh #fff, 50vw 90vh #fff;
      animation: moveStars 50s linear infinite;
    }
    @keyframes moveStars {
      from { transform: translateY(0); }
      to { transform: translateY(-2000px); }
    }
    .splash-rocketContainer {
      position: absolute;
      bottom: -20%;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: rocketLaunch 1.2s cubic-bezier(0.5, 0, 0.7, 1) forwards;
    }
    .splash-rocketImpact {
      display: none;
    }
    @keyframes rocketLaunch {
      0% { bottom: -20%; transform: translateX(-50%) scale(0.5); }
      100% { bottom: 50%; transform: translateX(-50%) scale(2); }
    }
    .splash-rocketGraphic {
      filter: drop-shadow(0 0 25px rgba(250, 204, 21, 1));
      z-index: 2;
    }
    .splash-rocketAura {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(250, 204, 21, 0.35) 0%, transparent 65%);
      border-radius: 50%;
      animation: pulseAura 0.1s infinite alternate;
      z-index: 1;
    }
    @keyframes pulseAura {
      0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
      100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
    }
    .splash-rocketBoostFire {
      width: 40px;
      height: 200px;
      background: linear-gradient(to bottom, #FFFFFF, #FACC15, #EF4444, transparent);
      border-radius: 0 0 50px 50px;
      position: absolute;
      top: 70px;
      z-index: 1;
      filter: blur(4px);
      animation: flicker 0.05s infinite alternate;
    }
    @keyframes flicker {
      0% { opacity: 0.8; height: 180px; transform: scaleX(0.9); }
      100% { opacity: 1; height: 220px; transform: scaleX(1.1); }
    }
    .splash-spark {
      position: absolute;
      width: 4px;
      height: 15px;
      background: white;
      border-radius: 50%;
      z-index: 0;
      top: 80px;
      opacity: 0;
    }
    .splash-s1 { animation: sparkEject 0.3s infinite 0.1s; left: 35px; }
    .splash-s2 { animation: sparkEject 0.4s infinite 0.2s; left: 45px; background: #FACC15; width: 3px; }
    .splash-s3 { animation: sparkEject 0.25s infinite 0.3s; left: 40px; background: #EF4444; }
    .splash-s4 { animation: sparkEject 0.35s infinite 0.15s; left: 30px; background: #FFFFFF; width: 5px; }
    .splash-s5 { animation: sparkEject 0.28s infinite 0.05s; left: 50px; background: #FACC15; }
    @keyframes sparkEject {
      0% { transform: translateY(0) scale(1); opacity: 1; }
      100% { transform: translateY(150px) scale(0); opacity: 0; }
    }
    .splash-shockwaveContainer {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1px;
      height: 1px;
      z-index: 5;
    }
    .splash-shockwaveFlash {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200vw;
      height: 200vh;
      background: white;
      animation: flashBang 0.6s ease-out forwards;
    }
    @keyframes flashBang {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }
    .splash-shockwaveRing1, .splash-shockwaveRing2 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 10px solid #FACC15;
      box-shadow: 0 0 50px #FACC15, inset 0 0 50px #FACC15;
      opacity: 0;
    }
    .splash-shockwaveRing1 {
      animation: explodeRing 1s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
    }
    .splash-shockwaveRing2 {
      border-color: white;
      animation: explodeRing 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards 0.1s;
    }
    @keyframes explodeRing {
      0% { width: 10px; height: 10px; opacity: 1; border-width: 20px; }
      100% { width: 150vw; height: 150vw; opacity: 0; border-width: 1px; }
    }
    .splash-brandContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0;
      transform: scale(0.8) translateY(20px);
      z-index: 10;
    }
    .splash-cinematicReveal {
      animation: heroTextReveal 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes heroTextReveal {
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .splash-textGlowBox {
      position: relative;
      display: inline-block;
    }
    .splash-brandTitle {
      font-size: 6rem;
      letter-spacing: -2px;
      margin: 0;
      display: flex;
      text-transform: uppercase;
    }
    .splash-careerText {
      color: #FFFFFF;
      font-weight: 300;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    .splash-pilotText {
      color: #FACC15;
      font-weight: 900;
      text-shadow: 0 0 20px rgba(250, 204, 21, 0.6);
    }
    .splash-lensFlare {
      position: absolute;
      top: 50%;
      left: -50%;
      width: 200%;
      height: 4px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), rgba(250, 204, 21, 1), rgba(255, 255, 255, 0.9), transparent);
      transform: translateY(-50%) scaleX(0);
      filter: blur(3px) drop-shadow(0 0 15px white);
      animation: lensSweep 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards 0.5s;
    }
    @keyframes lensSweep {
      0% { transform: translateY(-50%) scaleX(0); opacity: 0;}
      50% { transform: translateY(-50%) scaleX(1); opacity: 1;}
      100% { transform: translateY(-50%) scaleX(0); opacity: 0;}
    }
    .splash-glitchOverlay {
      position: absolute;
      inset: 0;
      background: white;
      mix-blend-mode: overlay;
      opacity: 0;
      animation: glitchFlash 2s infinite 1s;
    }
    @keyframes glitchFlash {
      0%, 95%, 100% { opacity: 0; transform: translateX(0); }
      96% { opacity: 0.8; transform: translateX(-5px); }
      97% { opacity: 0.3; transform: translateX(5px); }
      98% { opacity: 0.9; transform: translateX(-2px); }
      99% { opacity: 0; transform: translateX(2px); }
    }
    .splash-subtitleTeaser {
      color: #94A3B8;
      font-size: 1.5rem;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-top: 1rem;
      opacity: 0;
      animation: fadeInSubtitle 1s forwards 1s;
    }
    @keyframes fadeInSubtitle {
      to { opacity: 1; }
    }
    .splash-nebula1, .splash-nebula2 {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0;
      z-index: 1;
      transition: opacity 2s ease-in;
    }
    .splash-nebula1 {
      width: 60vw;
      height: 60vh;
      background: rgba(46, 16, 101, 0.6);
      top: -10%;
      left: -10%;
    }
    .splash-nebula2 {
      width: 50vw;
      height: 50vh;
      background: rgba(250, 204, 21, 0.15);
      bottom: -10%;
      right: -10%;
    }
    .splash-showNebula {
      opacity: 1;
    }
  `;

  return (
    <SplashContext.Provider value={{ triggerSplash, splashActive: isActive }}>
      <style>{splashStyles}</style>
      {isActive && (
        <div
          className={`splash-splashOverlay ${phase === "fade" ? "splash-fadeOut" : ""}`}
        >
          <div className="splash-spaceBackground"></div>
          <div
            className={`splash-starfield ${phase === "reveal" ? "splash-fadeStars" : ""}`}
          >
            <div className="splash-stars1"></div>
            <div className="splash-stars2"></div>
            <div className="splash-stars3"></div>
          </div>

          <div className="splash-animationContainer">
            {(phase === "warp" || phase === "shockwave") && (
              <div
                className={`splash-rocketContainer ${phase === "shockwave" ? "splash-rocketImpact" : ""}`}
              >
                <div className="splash-rocketAura"></div>
                <div className="splash-rocketBoostFire"></div>
                <div className={`splash-spark splash-s1`}></div>
                <div className={`splash-spark splash-s2`}></div>
                <div className={`splash-spark splash-s3`}></div>
                <div className={`splash-spark splash-s4`}></div>
                <div className={`splash-spark splash-s5`}></div>
                <Rocket
                  size={80}
                  className="splash-rocketGraphic"
                  fill="#FACC15"
                  stroke="none"
                />
              </div>
            )}

            {phase === "shockwave" && (
              <div className="splash-shockwaveContainer">
                <div className="splash-shockwaveRing1"></div>
                <div className="splash-shockwaveRing2"></div>
                <div className="splash-shockwaveFlash"></div>
              </div>
            )}

            <div
              className={`splash-brandContainer ${phase === "reveal" ? "splash-cinematicReveal" : ""}`}
            >
              <div className="splash-textGlowBox">
                <h1 className="splash-brandTitle">
                  <span className="splash-careerText">Career</span>
                  <span className="splash-pilotText">Pilot</span>
                </h1>
                <div className="splash-lensFlare"></div>
                <div className="splash-glitchOverlay"></div>
              </div>
              <p className="splash-subtitleTeaser">Navigating Your Future</p>
            </div>

            <div
              className={`splash-nebula1 ${phase === "reveal" ? "splash-showNebula" : ""}`}
            ></div>
            <div
              className={`splash-nebula2 ${phase === "reveal" ? "splash-showNebula" : ""}`}
            ></div>
          </div>
        </div>
      )}
      <div className={isActive && phase !== "fade" ? "splash-hidden-overflow" : ""}>
        {children}
      </div>
    </SplashContext.Provider>
  );
};
