import React from "react";
import { Trophy, Award, Star, Zap, Shield, Target, BookOpen, Brain, Users, HelpCircle } from "lucide-react";

const BADGE_CONFIG = {
  career: { label: "Pathfinder", icon: <Target size={24} />, color: "#3b82f6", desc: "First roadmap generated" },
  coding: { label: "Syntax Sage", icon: <Zap size={24} />, color: "#8b5cf6", desc: "Completed coding module" },
  aptitude: { label: "Logic Master", icon: <Brain size={24} />, color: "#f59e0b", desc: "Aptitude mastery unlocked" },
  practice: { label: "Daily Ritualist", icon: <Shield size={24} />, color: "#10b981", desc: "Built professional habits" },
  softskills: { label: "Team Leader", icon: <Users size={24} />, color: "#64748b", desc: "Soft skills profiler done" },
  english: { label: "Global Speaker", icon: <Award size={24} />, color: "#f43f5e", desc: "English fluency badge" },
  logic: { label: "Riddle Solver", icon: <HelpCircle size={24} />, color: "#06b6d4", desc: "Critical thinking ace" }
};

const TrophyRoom = ({ earnedBadges = [] }) => {
  const trophyStyles = `
    .trophy-scroll-container {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      padding: 4px 0 16px 4px;
      scrollbar-width: thin;
      scrollbar-color: var(--vibrant-blue) transparent;
    }
    .trophy-scroll-container::-webkit-scrollbar { height: 6px; }
    .trophy-scroll-container::-webkit-scrollbar-thumb { background: var(--vibrant-blue); border-radius: 10px; }
    
    .badge-card {
      min-width: 140px;
      padding: 16px;
      background: var(--white);
      border-radius: 20px;
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: default;
    }
    .badge-card.earned { border-color: var(--vibrant-blue); box-shadow: 0 10px 20px rgba(59, 130, 246, 0.1); }
    .badge-card.earned:hover { transform: translateY(-8px) scale(1.05) rotate(2deg); box-shadow: 0 15px 30px rgba(59, 130, 246, 0.2); }
    .badge-card.locked { opacity: 0.4; filter: grayscale(0.8); background: rgba(0,0,0,0.02); }
    
    .badge-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      color: #fff;
      transition: transform 0.3s ease;
    }
    .badge-card.earned:hover .badge-icon { transform: scale(1.1) rotate(-5deg); }
    .badge-label { font-size: 0.85rem; font-weight: 800; color: var(--deep-navy); margin-bottom: 4px; }
    .badge-desc { font-size: 0.65rem; color: var(--text-secondary); line-height: 1.3; }

    .trophy-progress-bar { height: 8px; background: var(--soft-grey); border-radius: 10px; margin-top: 12px; overflow: hidden; }
    .trophy-progress-fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #fbbf24); border-radius: 10px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
  `;

  const totalBadges = Object.keys(BADGE_CONFIG).length;
  const progressPct = (earnedBadges.length / totalBadges) * 100;

  return (
    <div className="card" style={{ padding: 24, marginTop: 24, background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <style>{trophyStyles}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Trophy size={24} color="#f59e0b" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--deep-navy)' }}>Your Trophy Room</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>{earnedBadges.length}/{totalBadges} BADGES</span>
          <div className="trophy-progress-bar" style={{ width: 120 }}>
            <div className="trophy-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>
      
      <div className="trophy-scroll-container">
        {Object.entries(BADGE_CONFIG).map(([key, config]) => {
          const isEarned = earnedBadges.includes(key);
          return (
            <div key={key} className={`badge-card ${isEarned ? 'earned' : 'locked'}`}>
              <div className="badge-icon" style={{ backgroundColor: config.color, boxShadow: isEarned ? `0 8px 16px ${config.color}33` : 'none' }}>
                {config.icon}
              </div>
              <span className="badge-label">{config.label}</span>
              <span className="badge-desc">{isEarned ? config.desc : "Complete test to unlock"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrophyRoom;
