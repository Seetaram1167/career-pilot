import { useState, useEffect, useRef } from "react";
import { Bell, X, Sparkles, CheckCheck } from "lucide-react";
import { API_BASE_URL } from "../apiConfig";

const NotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Notif fetch error:", e);
    }
  };
  
  const fetchBookings = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/mentors/bookings/my`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Bookings fetch error:", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchBookings();
    const interval = setInterval(() => {
      fetchNotifications();
      fetchBookings();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeSession = (bookings || [])
    .map(b => ({ ...b, scheduleDate: b.sessionId?.schedule ? new Date(b.sessionId.schedule) : null }))
    .filter(b => {
      if (!b.scheduleDate) return false;
      const diff = b.scheduleDate.getTime() - currentTime.getTime();
      const SESSION_DURATION = 90 * 60 * 1000; // 90 minutes
      // Show sessions from 1 hour before till 90 minutes after start
      return diff < 3600000 && diff > -SESSION_DURATION;
    })
    .sort((a, b) => a.scheduleDate - b.scheduleDate)[0];

  const unreadCount = (notifications || []).filter(n => !n.read).length;
  const activeSessionFinishTime = activeSession ? activeSession.scheduleDate.getTime() + (90 * 60 * 1000) : 0;
  const isSessionActive = activeSession && currentTime.getTime() < activeSessionFinishTime;
  const hasUpdates = unreadCount > 0 || isSessionActive;

  const dotStyles = `
    @keyframes pulse-red {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .notif-dot {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 10px;
      height: 10px;
      background-color: #EF4444;
      border-radius: 50%;
      border: 2px solid #1E293B;
      animation: pulse-red 2s infinite;
    }
  `;

  return (
    <div className="notif-wrapper" ref={dropdownRef} style={{ position: "relative" }}>
      <style>{dotStyles}</style>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "10px",
          cursor: "pointer",
          color: "white",
          display: "flex",
          position: "relative"
        }}
      >
        <Bell size={20} />
        {hasUpdates && <div className="notif-dot" />}
      </button>

      {isOpen && (
        <div style={{
          position: "absolute", top: "50px", right: 0,
          width: "350px", background: "#1E293B",
          borderRadius: "16px", border: "1px solid #334155",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          zIndex: 9999, overflow: "hidden", color: "white"
        }}>
          {selectedSession ? (
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", height: "100%", minHeight: "380px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Sparkles size={18} style={{ color: "#FACC15" }} />
                  <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", letterSpacing: "-0.02em" }}>Session Details</h4>
                </div>
                <button 
                  onClick={() => setSelectedSession(null)} 
                  style={{ background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", color: "white", padding: "8px", borderRadius: "50%", display: "flex" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "0.7rem", color: "#FACC15", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Topic</div>
                  <div style={{ fontSize: "1.15rem", fontWeight: "900", color: "#FFFFFF", lineHeight: "1.3" }}>{selectedSession.topic || "Career Consultation"}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "0.7rem", color: "#FACC15", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Mentor</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#FFFFFF" }}>{selectedSession.sessionId?.mentorId?.name || "Expert Mentor"}</div>
                  <div style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: "600" }}>{selectedSession.sessionId?.mentorId?.specialization || "Professional Guidance"}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "0.7rem", color: "#FACC15", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Time</div>
                  <div style={{ fontSize: "1rem", fontWeight: "700", color: "#FFFFFF" }}>
                    {selectedSession.sessionId?.schedule ? new Date(selectedSession.sessionId.schedule).toLocaleString([], { 
                      dateStyle: 'medium', 
                      timeStyle: 'short' 
                    }) : "Scheduled"}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "0.7rem", color: "#FACC15", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Mentor Contact</div>
                  <div style={{ 
                    display: "flex", alignItems: "center", gap: "10px", 
                    background: "rgba(250, 204, 21, 0.1)", padding: "12px 16px", 
                    borderRadius: "14px", border: "1px solid rgba(250, 204, 21, 0.2)",
                    color: "#FACC15", fontWeight: "900", fontSize: "1.1rem"
                  }}>
                    <Sparkles size={16} /> 
                    {selectedSession.sessionId?.mentorId?.phone || "+91 70123 45678"}
                  </div>
                </div>

                <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                  {(() => {
                    const sched = new Date(selectedSession.sessionId?.schedule);
                    const finishTime = sched.getTime() + (90 * 60 * 1000); // 90 min duration
                    const isFinished = currentTime.getTime() > finishTime;
                    
                    if (isFinished) {
                      return (
                        <div style={{ 
                          background: "rgba(239, 68, 68, 0.1)", 
                          color: "#EF4444", 
                          padding: "16px", 
                          borderRadius: "14px", 
                          textAlign: "center", 
                          fontWeight: "900", 
                          border: "1px solid rgba(239, 68, 68, 0.2)" 
                        }}>
                          SESSION CLOSED / FINISHED
                        </div>
                      );
                    }
                    
                    if (currentTime < sched) {
                      return (
                        <div style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", 
                          gap: "15px", background: "rgba(255,255,255,0.03)", 
                          padding: "20px", borderRadius: "16px", 
                          border: "1px solid rgba(255,255,255,0.08)" 
                        }}>
                           <span style={{ fontSize: "0.9rem", color: "#94A3B8", fontWeight: "700" }}>Starting in:</span>
                           <span style={{ fontFamily: "monospace", fontSize: "1.4rem", fontWeight: "900", color: "#FACC15" }}>
                             {(() => {
                                const diff = sched.getTime() - currentTime.getTime();
                                if (diff <= 0) return "00:00";
                                const mins = Math.floor(diff / 60000);
                                const secs = Math.floor((diff % 60000) / 1000);
                                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                             })()}
                           </span>
                        </div>
                      );
                    }
                    
                    return (
                      <a 
                        href={selectedSession.sessionId?.locationLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                          background: "#FACC15", color: "#0F172A", 
                          padding: "16px", borderRadius: "14px", 
                          textAlign: "center", fontWeight: "900", 
                          textDecoration: "none", display: "block",
                          fontSize: "1.05rem", transition: "all 0.3s ease",
                          boxShadow: "0 8px 25px rgba(250, 204, 21, 0.3)"
                        }}
                      >
                        Join Meeting Now
                      </a>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ padding: "15px 20px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold" }}>Notifications</span>
                <X size={18} onClick={() => setIsOpen(false)} style={{ cursor: "pointer", opacity: 0.5 }} />
              </div>
              <div style={{ maxHeight: "400px", overflowY: "auto", padding: "10px" }}>
                {activeSession && (
                  <div 
                    onClick={(e) => { e.stopPropagation(); setSelectedSession(activeSession); }} 
                    style={{ 
                      background: "linear-gradient(135deg, rgba(250, 204, 21, 0.15), rgba(250, 204, 21, 0.05))", 
                      border: "1px solid #FACC15", 
                      padding: "16px", 
                      borderRadius: "16px", 
                      marginBottom: "15px", 
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(250, 204, 21, 0.1)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ fontWeight: "900", color: "#FACC15", fontSize: "0.95rem" }}>Upcoming Mentor Session</div>
                      <Sparkles size={14} style={{ color: "#FACC15" }} />
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "10px" }}>With {activeSession.sessionId?.mentorId?.name}</div>
                    
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "10px 14px", borderRadius: "10px" }}>
                      {(() => {
                        const sched = activeSession.scheduleDate;
                        const finishTime = sched.getTime() + (90 * 60 * 1000);
                        const isFinished = currentTime.getTime() > finishTime;
                        
                        if (isFinished) {
                          return (
                            <span style={{ fontSize: "0.8rem", color: "#EF4444", fontWeight: "800" }}>COMPLETED / FINISHED</span>
                          );
                        }
                        
                        if (currentTime < sched) {
                          return (
                            <>
                              <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: "700" }}>Starting in:</span>
                              <span style={{ fontFamily: "monospace", fontWeight: "900", color: "#FACC15", fontSize: "1.1rem" }}>
                                {(() => {
                                  const diff = sched.getTime() - currentTime.getTime();
                                  if (diff <= 0) return "00:00";
                                  const mins = Math.floor(diff / 60000);
                                  const secs = Math.floor((diff % 60000) / 1000);
                                  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                                })()}
                              </span>
                            </>
                          );
                        }
                        
                        return (
                          <>
                            <span style={{ fontSize: "0.8rem", color: "#10B981", fontWeight: "800" }}>LIVE NOW</span>
                            <span style={{ fontSize: "0.8rem", color: "#FACC15", fontWeight: "800" }}>View Details</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
                {notifications.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", opacity: 0.5 }}>No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} style={{ padding: "12px", borderBottom: "1px solid #334155" }}>
                      <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{n.title}</div>
                      <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
