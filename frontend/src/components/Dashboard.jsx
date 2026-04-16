import {
  CheckCircle,
  Circle,
  Trophy,
  BookOpen,
  Target,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  Edit,
  Camera,
  Calendar,
  Lock,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ManageBookingsModal from "./ManageBookingsModal";
import ProfileSetupModal from "./ProfileSetupModal";
import ProgressTracker from "./ProgressTracker";
import TrophyRoom from "./TrophyRoom";
import { syncUserProfile } from "../utils/authUtils";

const ARTICLE_IMAGES = {
  1: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Data Analyst
  2: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=2070&auto=format&fit=crop", // Doctor (Updated URL)
  3: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop", // AI Training
  4: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2070&auto=format&fit=crop", // SWE 2026
  5: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", // Cybersecurity
  6: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2048&auto=format&fit=crop", // Networking
};

const Dashboard = () => {
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [isBoosterModalOpen, setIsBoosterModalOpen] = useState(false);

  const TIPS = [
    { title: "Mastering Small Talk", text: "Listen 70% of the time, talk 30%. It’s the secret to great networking.", action: "Point acknowledged! Listening is a superpower." },
    { title: "The 2-Minute Rule", text: "If a task takes less than 2 minutes, do it now. Don't add it to your list.", action: "Efficiency boost! You just cleared some mental clutter." },
    { title: "Professional Emailing", text: "Always double-check the recipient's name and your attachments.", action: "Detail oriented! First impressions matter." },
    { title: "The Power of Focus", text: "Silence your phone for 25 minutes of 'Deep Work'—it doubles output.", action: "Focus mode ON! Productivity just improved." }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      if (!parsedUser.interests || parsedUser.interests.length === 0) {
        setIsProfileModalOpen(true);
      }

      fetchBookings(parsedUser.token);
      syncUserProfile(); // Sync in background
    }
  }, []);

  const fetchBookings = async (token) => {
    try {
      const response = await fetch("/api/mentors/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
        localStorage.removeItem("user");
        alert("Your session has expired or your account no longer exists. Please sign up again.");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const completedSessions = bookings.filter(b => 
    b.paymentStatus === "completed" && new Date(b.sessionId?.schedule) <= now
  ).length;
  const totalPoints = (completedSessions * 100) + (user?.results?.topCareerPath ? 500 : 0);
  
  const upcomingBookings = bookings
    .filter(b => new Date(b.sessionId?.schedule) > now)
    .sort((a, b) => new Date(a.sessionId?.schedule) - new Date(b.sessionId?.schedule));

  const hasResults = !!user?.results?.topCareerPath;
  const hasBookings = bookings.length > 0;

  const displayRoadmap = [
    { 
      id: 1, 
      title: "Complete Career Assessment", 
      description: "Answer 8 questions to discover your ideal career path.", 
      status: hasResults ? "completed" : "active" 
    },
    { 
      id: 2, 
      title: "Review Your Career Match", 
      description: "Study your matched career path and understand the roadmap ahead.", 
      status: hasResults ? (hasBookings ? "completed" : "active") : "locked" 
    },
    { 
      id: 3, 
      title: "Book First Mentor Session", 
      description: "Connect with a mentor in your target career field.", 
      status: hasBookings ? "completed" : (hasResults ? "active" : "locked") 
    },
    { 
      id: 4, 
      title: "Build Core Skills", 
      description: "Follow the guided learning path for your career.", 
      status: hasBookings ? "active" : "locked" 
    },
  ];

  const completedRoadmapSteps = displayRoadmap.filter(s => s.status === "completed").length;
  const progressPct = displayRoadmap.length > 0 ? Math.round((completedRoadmapSteps / displayRoadmap.length) * 100) : 0;

  const dashboardStyles = `
    .dashboard-layout {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-xl);
      align-items: flex-start;
      margin-top: var(--spacing-md);
    }
    
    .dashboard-sidebar {
      flex: 1 1 320px;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      max-width: 400px;
    }
    
    .dashboard-mainContent {
      flex: 3 1 600px;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
      min-width: 0; /* Prevents flex children from overflowing */
    }

    @media (max-width: 1024px) {
      .dashboard-sidebar {
        max-width: 100%;
        flex: 1 1 100%;
      }
      .dashboard-mainContent {
        flex: 1 1 100%;
      }
    }

    .dashboard-profileCard {
      padding: var(--spacing-xl);
      background: linear-gradient(145deg, #1e293b, #0f172a);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: #fff;
    }

    .dashboard-headerRow {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
    }

    .dashboard-avatar-container {
      position: relative;
      width: 100px;
      height: 100px;
      cursor: pointer;
      margin-bottom: var(--spacing-sm);
    }

    .dashboard-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #3b82f6;
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
      transition: all 0.3s ease;
    }

    .avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(2px);
    }

    .dashboard-avatar-container:hover .avatar-overlay { opacity: 1; }
    .dashboard-avatar-container:hover .dashboard-avatar { transform: scale(1.05); }
    .overlay-text { color: #fff; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; margin-top: 4px; }
    .dashboard-userName { font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; color: #fff; }
    .dashboard-gradeText { color: #60a5fa; font-weight: 600; font-size: 0.9375rem; letter-spacing: 0.5px; }
    
    .dashboard-interests {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      margin-top: 12px;
    }
    .interest-tag {
      font-size: 0.7rem;
      padding: 4px 8px;
      background: rgba(59, 130, 246, 0.1);
      color: #60a5fa;
      border-radius: 6px;
      font-weight: 700;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .dashboard-statsRow {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border-color);
    }

    .dashboard-statBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: var(--soft-grey);
      padding: var(--spacing-sm);
      border-radius: var(--radius-md);
    }

    .dashboard-statValue { font-size: 1.25rem; font-weight: 700; color: var(--deep-navy); margin-top: 4px; }
    .dashboard-statLabel { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
    .dashboard-iconBlue { color: var(--vibrant-blue); }
    .dashboard-iconOrange { color: var(--warning-orange); }
    .dashboard-iconGreen { color: var(--success-green); }
    
    .dashboard-welcomeSection { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      flex-wrap: wrap; 
      gap: var(--spacing-md); 
    }
    .dashboard-welcomeText h1 { 
      font-size: clamp(1.8rem, 5vw, 2.5rem); 
      margin-bottom: var(--spacing-xs); 
      font-weight: 800; 
      color: var(--deep-navy); 
    }
    
    .dashboard-roadmapCard {
      padding: clamp(var(--spacing-md), 4vw, var(--spacing-xl));
    }
    .dashboard-roadmapHeader { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: var(--spacing-xl); 
      flex-wrap: wrap; 
      gap: var(--spacing-lg); 
    }
    .dashboard-progressTracker { 
      display: flex; 
      flex-direction: column; 
      gap: var(--spacing-xs); 
      min-width: 200px; 
      flex: 1;
      max-width: 300px;
    }
    .dashboard-progressTracker span { font-size: 0.875rem; font-weight: 700; color: var(--vibrant-blue); text-align: right; }
    .dashboard-progressBar { height: 10px; background-color: var(--soft-grey); border-radius: var(--radius-full); overflow: hidden; border: 1px solid var(--border-color); }
    .dashboard-progressFill { height: 100%; background: linear-gradient(90deg, var(--vibrant-blue), #60a5fa); border-radius: var(--radius-full); }
    
    .roadmap-steps {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .roadmap-step {
      display: flex;
      gap: 20px;
    }
    .step-line-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .step-line {
      width: 2px;
      flex: 1;
      background-color: var(--border-color);
      margin: 4px 0;
    }

    /* Articles Grid Refactor */
    .dashboard-insightsSection { 
      margin-top: var(--spacing-xl); 
    }
    .dashboard-articlesGrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-xl);
    }
    @media (max-width: 640px) {
      .dashboard-articlesGrid {
        grid-template-columns: 1fr;
      }
    }

    .dashboard-articleCard {
      position: relative;
      height: 380px;
      border-radius: 20px;
      overflow: hidden;
      text-decoration: none;
      background-size: cover;
      background-position: center;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .dashboard-articleCard:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      border-color: var(--vibrant-blue);
    }
    .dashboard-articleCard::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(to bottom, transparent 20%, rgba(15, 23, 42, 0.95) 100%);
      z-index: 1;
    }
    .dashboard-articleGlass {
      position: relative;
      z-index: 2;
      padding: 24px;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(4px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .dashboard-articleBadge {
      align-self: flex-start;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 6px 12px;
      background: var(--vibrant-blue);
      color: var(--soft-grey);
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .dashboard-articleCard h4 {
      font-size: 1.4rem;
      color: #FFFFFF;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .dashboard-articleCard p {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 24px;
    }
    .dashboard-readBtn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
      padding: 12px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Upcoming Sessions Card */
    .sessions-card {
      padding: 24px;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .session-item {
      display: flex;
      gap: 14px;
      margin-bottom: 20px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
    }
    .session-date-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--white);
      padding: 8px 12px;
      border-radius: 8px;
      min-width: 50px;
    }

    .edit-profile-btn {
      margin-top: var(--spacing-lg);
      width: 100%;
      padding: 0.85rem;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      color: #fff;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 12px;
      font-weight: 700;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .edit-profile-btn:hover {
      background: #3b82f6;
      border-color: #3b82f6;
      transform: translateY(-2px);
    }

    .booster-card {
      background: linear-gradient(135deg, #1e293b, #0f172a);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 24px;
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
      overflow: hidden;
      margin-top: 24px;
      box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);
    }
    .booster-card::after {
      content: '⚡';
      position: absolute;
      top: -10px; right: -10px;
      font-size: 80px; opacity: 0.05;
    }
    .booster-label {
      background: var(--vibrant-blue);
      color: #fff;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      align-self: flex-start;
    }

    .custom-modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .booster-popup {
      background: linear-gradient(145deg, #1e293b, #0f172a);
      border: 1px solid rgba(250, 204, 21, 0.3);
      max-width: 450px;
      width: 100%;
      border-radius: 32px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      animation: popupSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes popupSlideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  const articles = [
    { id: 1, type: "Trend", title: "Why Data Analyst is a Top Career Pick?", desc: "Explore the explosive growth of analytics roles across industries." },
    { id: 2, type: "Guide", title: "Is Becoming A Doctor Worth It?", desc: "A sober look at this tough but highly rewarding medical profession." },
    { id: 3, type: "Advice", title: "From Boring To Memorable: AI Training", desc: "How the workforce is adapting to artificial intelligence integration." },
    { id: 4, type: "Trend", title: "SWE in 2026: What's Changing?", desc: "Discover the radical transformation of the software engineering field." },
    { id: 5, type: "Guide", title: "Mastering the Art of Cybersecurity", desc: "Explore the essential steps to build a successful career in security." },
    { id: 6, type: "Advice", title: "Networking: The Key to Career Growth", desc: "Why building genuine connections is your most powerful tool." },
  ];

  return (
    <>
      <style>{dashboardStyles}</style>
      <div className={`page-container dashboard-layout`}>
        {/* Sidebar Section */}
        <aside className="dashboard-sidebar">
          <div className={`card dashboard-profileCard`}>
            <div className="dashboard-headerRow">
              <div className="dashboard-avatar-container" onClick={() => setIsProfileModalOpen(true)}>
                <img
                  src={user?.profilePic || "https://i.pravatar.cc/150?img=11"}
                  alt="Profile"
                  className="dashboard-avatar"
                />
                <div className="avatar-overlay">
                  <Camera size={24} color="#fff" />
                  <span className="overlay-text">Update</span>
                </div>
              </div>
              <div>
                <h3 className="dashboard-userName">{user?.name || "Alex Johnson"}</h3>
                <p className="dashboard-gradeText">{user?.education || (user?.results?.topCareerPath || "Career Explorer")}</p>
                {user?.interests && (
                  <div className="dashboard-interests">
                    {user.interests.slice(0, 3).map(i => <span key={i} className="interest-tag">{i}</span>)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="dashboard-statsRow">
              <div className="dashboard-statBox">
                <BookOpen size={18} className="dashboard-iconBlue" />
                <span className="dashboard-statValue">{completedSessions}</span>
                <span className="dashboard-statLabel">Sessions</span>
              </div>
              <div className="dashboard-statBox">
                <Trophy size={18} className="dashboard-iconOrange" />
                <span className="dashboard-statValue">{totalPoints}</span>
                <span className="dashboard-statLabel">Points</span>
              </div>
            </div>
            
            <button className="edit-profile-btn" onClick={() => setIsProfileModalOpen(true)}>
              <Edit size={16} /> Edit Profile
            </button>
          </div>

          <div className="card sessions-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Calendar size={20} color="var(--vibrant-blue)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--deep-navy)', margin: 0 }}>Upcoming Sessions</h4>
            </div>
            
            {loading ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Loading schedule...</p>
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.slice(0, 1).map(booking => {
                const date = new Date(booking.sessionId?.schedule);
                return (
                  <div key={booking._id} className="session-item">
                    <div className="session-date-box">
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--deep-navy)' }}>{date.getDate()}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--vibrant-blue)', fontWeight: 800, textTransform: 'uppercase' }}>{date.toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--deep-navy)', marginBottom: 2 }}>{booking.sessionId?.mentorId?.name || "Expert Mentor"}</h5>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(41, 121, 255, 0.12)', color: 'var(--vibrant-blue)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>No upcoming sessions found.</p>
            )}
            
            <button
              className="btn btn-secondary"
              style={{ width: '100%', borderRadius: 10, fontSize: '0.85rem', padding: '10px' }}
              onClick={() => setIsManageModalOpen(true)}
            >
              Manage Bookings
            </button>
          </div>

          <ProgressTracker user={user} bookings={bookings} />

          <div className="card booster-card">
            <div className="booster-label">Skill of the Day</div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#fff' }}>{TIPS[currentTip].title}</h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>
              {TIPS[currentTip].text}
            </p>
            <button 
              className="btn btn-primary" 
              style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: 8, background: '#fff', color: '#000', border: 'none' }}
              onClick={() => {
                setIsBoosterModalOpen(true);
              }}
            >
              Try This Tip
            </button>
          </div>

        </aside>

        {/* Modal for Manage Bookings */}
        {isManageModalOpen && (
          <ManageBookingsModal 
            bookings={bookings}
            onClose={() => setIsManageModalOpen(false)} 
            onRefresh={() => fetchBookings(user.token)}
          />
        )}

        {/* Main Content Section */}
        <div className="dashboard-mainContent">
          <div className="dashboard-welcomeSection">
            <div className="dashboard-welcomeText">
              <h1>Welcome, {user?.name ? user.name.split(' ')[0] : "Explorer"}!</h1>
              <p>{user?.bio || "You're making great progress. Ready for the next leap?"}</p>
            </div>
            <Link to="/assessments" className={`btn btn-primary`} style={{ borderRadius: 12 }}>
              Retake Assessment
            </Link>
          </div>

          <div className="card dashboard-roadmapCard">
            <div className="dashboard-roadmapHeader">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Target size={32} className="dashboard-iconBlue" />
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Career Roadmap</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.results?.topCareerPath || "Discover your path"}</p>
                </div>
              </div>
              <div className="dashboard-progressTracker">
                <span>{progressPct}% COMPLETED</span>
                <div className="dashboard-progressBar">
                  <div className="dashboard-progressFill" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>

            <div className="roadmap-steps">
              {displayRoadmap.slice(0, 5).map((item, index) => (
                <div key={item.id} className="roadmap-step">
                  <div className="step-line-container">
                    {item.status === "completed" ? <CheckCircle size={22} color="var(--success-green)" /> : <Circle size={22} color="var(--border-color)" />}
                    {index < 4 && <div className="step-line" />}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1rem', color: item.status === "locked" ? "var(--text-secondary)" : "var(--deep-navy)" }}>{item.title}</h4>
                    {item.description && <p style={{ fontSize: '0.85rem' }}>{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <TrophyRoom earnedBadges={user?.badges || (user?.results ? ['career'] : [])} />

          <div className="dashboard-insightsSection">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <TrendingUp size={28} className="dashboard-iconBlue" />
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Premium Career Insights</h2>
            </div>

            <div className="dashboard-articlesGrid">
              {articles.map((art) => (
                <Link 
                  key={art.id} 
                  to={`/article/${art.id}`} 
                  className="dashboard-articleCard"
                  style={{ backgroundImage: `url(${ARTICLE_IMAGES[art.id]})` }}
                >
                  <div className="dashboard-articleGlass">
                    <div className="dashboard-articleBadge">{art.type}</div>
                    <h4>{art.title}</h4>
                    <p>{art.desc}</p>
                    <div className="dashboard-readBtn">
                      <span>Read Full Insight</span>
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>


        {isProfileModalOpen && user && (
          <ProfileSetupModal 
            user={user} 
            onClose={() => setIsProfileModalOpen(false)} 
            onSuccess={(updatedUser, shouldClose = true) => {
              setUser(updatedUser);
              if (shouldClose) setIsProfileModalOpen(false);
            }} 
          />
        )}
        
        {isBoosterModalOpen && (
          <div className="custom-modal-overlay" onClick={() => setIsBoosterModalOpen(false)}>
            <div className="booster-popup" onClick={e => e.stopPropagation()}>
              <div style={{ padding: 20, background: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Zap size={40} color="#facc15" />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>Skill Unlocked!</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 32 }}>
                {TIPS[currentTip].action}
              </p>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px 24px', borderRadius: 16, marginBottom: 32 }}>
                <span style={{ fontSize: '0.9rem', color: '#facc15', fontWeight: 800 }}>REWARD EARNED</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>+50 Explorer Points</div>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '16px', borderRadius: 16, background: '#facc15', color: '#000', border: 'none', fontWeight: 800 }}
                onClick={() => {
                  setIsBoosterModalOpen(false);
                  setCurrentTip((currentTip + 1) % TIPS.length);
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
