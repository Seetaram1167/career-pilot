import { CheckCircle, Circle, Lock, Sparkles } from "lucide-react";

const ProgressTracker = ({ user, bookings = [] }) => {
  const now = new Date();

  const milestones = [
    {
      id: "profile",
      label: "Complete Your Profile",
      description: "Add your bio, education, and date of birth.",
      done: !!(user?.bio && user?.education && user?.dob),
      icon: "👤",
    },
    {
      id: "interests",
      label: "Set Career Interests",
      description: "Choose your areas of interest.",
      done: !!(user?.interests && user?.interests.length > 0),
      icon: "🎯",
    },
    {
      id: "quiz",
      label: "Complete Career Assessment",
      description: "Answer all 10 assessment questions.",
      done: !!(user?.results?.topCareerPath),
      icon: "📋",
    },
    {
      id: "booking",
      label: "Book First Mentor Session",
      description: "Schedule a session with a mentor.",
      done: bookings.length > 0,
      icon: "📅",
    },
    {
      id: "session",
      label: "Complete a Mentor Session",
      description: "Attend and finish a booked session.",
      done: bookings.some(
        (b) => b.paymentStatus === "completed" && new Date(b.sessionId?.schedule) <= now
      ),
      icon: "🎓",
    },
  ];

  const completedCount = milestones.filter((m) => m.done).length;
  const totalCount = milestones.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const styles = `
    .progress-card {
      padding: var(--spacing-xl);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }
    .progress-card::after {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }
    .progress-header h4 {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--deep-navy);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .progress-header span {
      font-size: 0.8rem;
      color: var(--vibrant-blue);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .progress-ring-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: var(--spacing-xl);
      position: relative;
    }
    .progress-ring-svg { transform: rotate(-90deg); filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.2)); }
    .progress-ring-bg {
      fill: none;
      stroke: rgba(255, 255, 255, 0.05);
      stroke-width: 10;
    }
    .progress-ring-fill {
      fill: none;
      stroke: url(#progressGradient);
      stroke-width: 10;
      stroke-linecap: round;
      stroke-dasharray: ${circumference};
      stroke-dashoffset: ${offset};
      transition: stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .progress-ring-text {
      position: absolute;
      text-align: center;
    }
    .progress-ring-pct {
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--deep-navy);
      display: block;
      line-height: 1;
      background: linear-gradient(135deg, #FFF, #94A3B8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .progress-ring-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .progress-milestones {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .progress-milestone {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 14px;
      border-radius: 14px;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid transparent;
    }
    .progress-milestone:hover {
      transform: translateX(8px);
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }
    .progress-milestone.done { 
      background: rgba(16, 185, 129, 0.08); 
      border-color: rgba(16, 185, 129, 0.15);
    }
    .progress-milestone.pending { 
      background: rgba(255, 255, 255, 0.02); 
      opacity: 0.7; 
      border-color: rgba(255, 255, 255, 0.05);
    }
    .progress-milestone-icon {
      font-size: 1.2rem;
      width: 36px; height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }
    .progress-milestone.done .progress-milestone-icon { 
      background: var(--success-green); 
      color: #FFF;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .progress-milestone.pending .progress-milestone-icon { 
      background: rgba(255, 255, 255, 0.05); 
    }
    .progress-milestone-info { flex: 1; min-width: 0; }
    .progress-milestone-label {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--deep-navy);
      margin-bottom: 2px;
    }
    .progress-milestone.pending .progress-milestone-label { color: var(--text-secondary); }
    .progress-milestone-desc {
      font-size: 0.75rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="card progress-card">
        <div className="progress-header">
          <h4><Sparkles size={20} color="var(--vibrant-blue)" /> Mastery Progress</h4>
          <span>{completedCount} / {totalCount}</span>
        </div>

        <div className="progress-ring-wrapper">
          <svg className="progress-ring-svg" width="115" height="115" viewBox="0 0 115 115">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2979ff" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>
            </defs>
            <circle className="progress-ring-bg" cx="57.5" cy="57.5" r={radius} />
            <circle className="progress-ring-fill" cx="57.5" cy="57.5" r={radius} />
          </svg>
          <div className="progress-ring-text">
            <span className="progress-ring-pct">{percentage}%</span>
            <span className="progress-ring-label">READY</span>
          </div>
        </div>

        <div className="progress-milestones">
          {milestones.map((m) => (
            <div key={m.id} className={`progress-milestone ${m.done ? "done" : "pending"}`}>
              <div className="progress-milestone-icon">{m.icon}</div>
              <div className="progress-milestone-info">
                <div className="progress-milestone-label">{m.label}</div>
                <div className="progress-milestone-desc">{m.description}</div>
              </div>
              {m.done ? (
                <CheckCircle className="progress-check" size={20} color="var(--success-green)" />
              ) : (
                <Circle className="progress-pending-icon" size={20} color="rgba(255,255,255,0.2)" />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProgressTracker;
