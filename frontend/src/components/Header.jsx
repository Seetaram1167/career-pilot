import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, Calendar, Users, Home, LayoutGrid, Book, Menu, X, Sun, Moon, LogOut, User as UserIcon, Settings, Trophy, FileText, HelpCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationBell from "./NotificationBell";
import TransactionsModal from "./TransactionsModal";
import AchievementsModal from "./AchievementsModal";
import { syncUserProfile } from "../utils/authUtils";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      syncUserProfile(); // Sync on route change or mount
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/home");
  };

  const isActive = (path) => location.pathname === path;

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const headerStyles = `
    .header-main {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      padding: 0;
      transition: all 0.3s ease;
    }
    .headerContainer {
      width: 100%;
      padding: 0 var(--spacing-xl);
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      z-index: 1001;
      text-decoration: none;
      height: 100%;
    }
    .logo-icon-link {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logoIcon {
      color: #FACC15;
      filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.4));
      transition: transform 0.5s ease;
      flex-shrink: 0;
    }
    .logo:hover .logoIcon {
      transform: rotate(180deg);
    }
    .logoText {
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--deep-navy);
      letter-spacing: -0.05em;
      line-height: normal;
      display: flex;
      align-items: center;
      transform: translateY(-1px); /* Correction for font baseline */
    }

    .header-nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--spacing-xs);
      background: rgba(255, 255, 255, 0.03);
      padding: 6px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .header-navLink {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.9rem;
      padding: 10px 16px;
      border-radius: 12px;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    /* Icon Animations */
    .header-navLink i, .header-navLink svg {
      transition: all 0.4s ease;
    }

    .header-navLink:hover .nav-icon-home { animation: icon-pulse 1.5s infinite ease-in-out; color: var(--vibrant-blue); }
    .header-navLink:hover .nav-icon-explore { transform: rotate(90deg) scale(1.1); color: #8B5CF6; }
    .header-navLink:hover .nav-icon-users { animation: icon-float 2s infinite ease-in-out; color: #10B981; }
    .header-navLink:hover .nav-icon-calendar { animation: icon-heartbeat 1s infinite ease-in-out; color: #F43F5E; }
    .header-navLink:hover .nav-icon-compass { animation: icon-spin 3s infinite linear; color: #3B82F6; }
    .header-navLink:hover .nav-icon-book { transform: perspective(400px) rotateY(180deg); color: #F59E0B; }

    @keyframes icon-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
    @keyframes icon-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
    @keyframes icon-heartbeat { 0% { transform: scale(1); } 15% { transform: scale(1.15); } 30% { transform: scale(1); } 45% { transform: scale(1.15); } 100% { transform: scale(1); } }
    @keyframes icon-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .header-navLink:hover {
      color: var(--vibrant-blue);
      background: rgba(41, 121, 255, 0.08);
      transform: translateY(-2px);
    }

    .header-navLink.active {
      color: var(--vibrant-blue);
      background: rgba(41, 121, 255, 0.12);
    }
    .header-navLink.active::after {
      content: '';
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: var(--vibrant-blue);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--vibrant-blue);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      z-index: 1001;
    }
    
    .theme-toggle-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--deep-navy);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border-radius: 12px;
      transition: all 0.3s ease;
    }
    .theme-toggle-btn:hover {
      background: var(--soft-grey);
      transform: rotate(15deg) scale(1.1);
    }

    /* Round Profile Styles */
    .header-profileWrapper {
      position: relative;
    }
    .header-avatarBtn {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--vibrant-blue);
      border: 2px solid var(--white);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--soft-grey);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header-avatarBtn:hover {
      transform: scale(1.08) rotate(5deg);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }
    .header-avatarBtn img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .header-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 260px;
      background: var(--white);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transform-origin: top right;
      animation: dropdown-fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1002;
    }
    
    @keyframes dropdown-fade-in {
      from { opacity: 0; transform: scale(0.9) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
 
    .dropdown-header {
      padding: 12px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 8px;
    }
    .dropdown-userName {
      display: block;
      font-weight: 800;
      color: var(--deep-navy);
      font-size: 1.05rem;
      margin-bottom: 2px;
    }
    .dropdown-userEmail {
      display: block;
      font-size: 0.85rem;
      color: var(--text-secondary);
      opacity: 0.8;
    }
 
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      color: var(--text-primary);
      font-weight: 700;
      font-size: 0.95rem;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }
    .dropdown-item:hover {
      background: rgba(41, 121, 255, 0.1);
      color: var(--vibrant-blue);
      transform: translateX(4px);
    }
    .dropdown-item svg {
      transition: transform 0.3s ease;
    }
    .dropdown-item:hover svg {
      transform: scale(1.15);
    }
    .dropdown-item.logout {
      margin-top: 4px;
      color: #EF4444;
      border-top: 1px solid var(--border-color);
      border-radius: 0 0 12px 12px;
    }
    .dropdown-item.logout:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #EF4444;
    }

    @media (max-width: 1250px) {
      .header-nav {
        display: none;
      }
      .mobile-menu-btn {
        display: flex !important;
      }
    }

    /* Mobile Menu Drawer */
    .mobile-nav-overlay {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      height: 100vh;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(12px);
      z-index: 2000;
      padding: 80px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 16px;
      color: white;
      text-decoration: none;
      font-size: 1.2rem;
      font-weight: 700;
      padding: 16px;
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
    }

    .mobile-nav-link.active {
      background: var(--vibrant-blue);
      color: white;
    }

    .mobile-menu-btn {
      display: none;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--deep-navy);
      cursor: pointer;
      align-items: center;
      justify-content: center;
      padding: 10px;
      border-radius: 12px;
      transition: all 0.3s ease;
      margin-right: 8px;
      z-index: 2100; /* Ensure it's above the overlay */
    }
  `;

  if (location.pathname === "/") return null;

  return (
    <>
      <style>{headerStyles}</style>
      <header className="header-main">
        <div className="headerContainer">
          <div className="logo">
            <Link to="/" className="logo-icon-link" aria-label="Play Promo">
              <Compass className="logoIcon" size={32} />
            </Link>
            <Link to="/home" className="logoText" aria-label="Go to Home">
              CareerPilot
            </Link>
          </div>

          <nav className="header-nav">
            <Link to="/dashboard" className={`header-navLink ${isActive("/dashboard") ? "active" : ""}`}>
              <Home className="nav-icon-home" size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/explore" className={`header-navLink ${isActive("/explore") ? "active" : ""}`}>
              <LayoutGrid className="nav-icon-explore" size={20} />
              <span>Explore Paths</span>
            </Link>
            <Link to="/services" className={`header-navLink ${isActive("/services") ? "active" : ""}`}>
              <Users className="nav-icon-users" size={20} />
              <span>Counselling</span>
            </Link>
            <Link to="/exams" className={`header-navLink ${isActive("/exams") ? "active" : ""}`}>
              <Calendar className="nav-icon-calendar" size={20} />
              <span>Exams Hub</span>
            </Link>
            <Link to="/certifications" className={`header-navLink ${isActive("/certifications") ? "active" : ""}`}>
              <Compass className="nav-icon-compass" size={20} />
              <span>Pro Certs</span>
            </Link>
            <Link to="/assessments" className={`header-navLink ${isActive("/assessments") ? "active" : ""}`}>
              <Book className="nav-icon-book" size={20} />
              <span>Assessments</span>
            </Link>
            <Link to="/support" className={`header-navLink ${isActive("/support") ? "active" : ""}`}>
              <HelpCircle className="nav-icon-help" size={20} />
              <span>Support</span>
            </Link>
          </nav>

          <div className="header-actions">
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user && <NotificationBell user={user} />}

            {user ? (
              <div className="header-profileWrapper" ref={dropdownRef}>
                <button 
                  className="header-avatarBtn" 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.name} />
                  ) : (
                    <UserIcon size={22} />
                  )}
                </button>
                
                {isProfileOpen && (
                  <div className="header-dropdown">
                    <div className="dropdown-header">
                      <span className="dropdown-userName">{user.name}</span>
                      <span className="dropdown-userEmail">{user.email || "Explorer Mode"}</span>
                    </div>
                    <Link to="/dashboard" className="dropdown-item">
                      <UserIcon size={18} />
                      <span>My Profile</span>
                    </Link>
                    {user.role === "admin" && (
                      <Link to="/admin" className="dropdown-item">
                        <LayoutGrid size={18} />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button 
                      className="dropdown-item" 
                      onClick={() => {
                        setIsAchievementsOpen(true);
                        setIsProfileOpen(false);
                      }}
                    >
                      <Trophy size={18} />
                      <span>Achievements</span>
                    </button>
                    <button 
                      className="dropdown-item" 
                      onClick={() => {
                        setIsTransactionsOpen(true);
                        setIsProfileOpen(false);
                      }}
                    >
                      <FileText size={18} />
                      <span>Your Transactions</span>
                    </button>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <LogOut size={18} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <Link to="/login" className="btn btn-secondary" style={{ borderRadius: '10px' }}>Log In</Link>
                <Link to="/signup" className="btn btn-primary" style={{ borderRadius: '10px' }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="mobile-nav-overlay"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <button 
                className="mobile-close-btn"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  padding: '10px',
                  cursor: 'pointer'
                }}
              >
                <X size={24} />
              </button>
              <Link to="/dashboard" className={`mobile-nav-link ${isActive("/dashboard") ? "active" : ""}`}>
                <Home size={24} /> <span>Dashboard</span>
              </Link>
              <Link to="/explore" className={`mobile-nav-link ${isActive("/explore") ? "active" : ""}`}>
                <LayoutGrid size={24} /> <span>Explore Paths</span>
              </Link>
              <Link to="/services" className={`mobile-nav-link ${isActive("/services") ? "active" : ""}`}>
                <Users size={24} /> <span>Counselling</span>
              </Link>
              <Link to="/exams" className={`mobile-nav-link ${isActive("/exams") ? "active" : ""}`}>
                <Calendar size={24} /> <span>Exams Hub</span>
              </Link>
              <Link to="/certifications" className={`mobile-nav-link ${isActive("/certifications") ? "active" : ""}`}>
                <Compass size={24} /> <span>Pro Certs</span>
              </Link>
              <Link to="/assessments" className={`mobile-nav-link ${isActive("/assessments") ? "active" : ""}`}>
                <Book size={24} /> <span>Assessments</span>
              </Link>
              <Link to="/support" className={`mobile-nav-link ${isActive("/support") ? "active" : ""}`}>
                <HelpCircle size={24} /> <span>Support</span>
              </Link>

              <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                 {user ? (
                   <button onClick={handleLogout} className="mobile-nav-link logout" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#F43F5E', width: '100%', border: 'none', cursor: 'pointer' }}>
                     <LogOut size={24} /> <span>Sign Out</span>
                   </button>
                 ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <Link to="/login" className="btn btn-secondary" style={{ textAlign: 'center', padding: '16px' }}>Log In</Link>
                     <Link to="/signup" className="btn btn-primary" style={{ textAlign: 'center', padding: '16px' }}>Sign Up</Link>
                   </div>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <TransactionsModal 
        isOpen={isTransactionsOpen} 
        onClose={() => setIsTransactionsOpen(false)} 
        user={user} 
      />
      {isAchievementsOpen && (
        <AchievementsModal onClose={() => setIsAchievementsOpen(false)} />
      )}
    </>
  );
};

export default Header;
