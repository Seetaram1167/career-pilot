import React, { useState } from "react";
import { X, Award, Eye, Download, Search, Trophy } from "lucide-react";
import Certificate from "./Certificate";

const AchievementsModal = ({ onClose }) => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use state for user to trigger re-renders on storage changes
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const achievements = user.achievements || [];

  const filteredAchievements = achievements.filter(a => 
    a.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (cert) => {
    // We open a specialized print window for the certificate
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${cert.courseName}</title>
          <style>
            body { margin: 0; padding: 0; }
            @media print {
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div id="cert-root"></div>
        </body>
      </html>
    `);
    
    // In a real app, we'd use a portal or SSR. 
    // For now, we'll trigger the standard handleDownload logic by rendering the Certificate component
    // Alternatively, we just tell the user to use the View button first.
    // For this implementation, we'll make View the primary way to get to Download.
    setSelectedCert(cert);
  };

  const modalStyles = `
    .achievements-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(8, 20, 48, 0.8);
      backdrop-filter: blur(12px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3000;
      animation: fadeIn 0.4s ease;
      font-family: 'Inter', sans-serif;
    }
    .achievements-content {
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(25px);
      width: 90%;
      max-width: 700px;
      max-height: 85vh;
      border-radius: 32px;
      padding: 40px;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      position: relative;
      display: flex;
      flex-direction: column;
      color: #FFFFFF;
    }
    .cert-item {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .cert-item:hover {
      transform: translateY(-4px) scale(1.01);
      background: rgba(255, 255, 255, 0.08);
      border-color: #3b82f6;
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1);
    }
    .search-box {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 14px 22px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 30px;
      transition: all 0.3s;
    }
    .search-box:focus-within {
      border-color: #3b82f6;
      background: rgba(255, 255, 255, 0.1);
    }
    .search-box input {
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
      font-size: 1rem;
      color: #FFFFFF;
    }
    .search-box input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
    .close-modal-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 50%;
      padding: 10px;
      cursor: pointer;
      color: #fff;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-modal-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
      transform: rotate(90deg);
    }
  `;

  if (selectedCert) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 4000, background: 'white', overflowY: 'auto' }}>
        <Certificate 
          userName={selectedCert.userName} 
          courseName={selectedCert.courseName} 
          onBack={() => setSelectedCert(null)} 
        />
      </div>
    );
  }

  return (
    <div className="achievements-overlay" onClick={onClose}>
      <style>{modalStyles}</style>
      <div className="achievements-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)', padding: 14, borderRadius: 16, color: 'white', boxShadow: '0 8px 16px rgba(217, 119, 6, 0.3)' }}>
              <Trophy size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Achievements</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>{achievements.length} Certificates Earned</p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="search-box">
          <Search size={20} color="rgba(255,255,255,0.4)" />
          <input 
            placeholder="Search certificates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          {filteredAchievements.length > 0 ? (
            filteredAchievements.map((cert) => (
              <div key={cert.id} className="cert-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: 16, borderRadius: '15px', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <Award size={26} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>{cert.courseName}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>Issued on {cert.date}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 14, boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)' }}
                    onClick={() => setSelectedCert(cert)}
                  >
                    <Eye size={18} /> View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Award size={64} color="rgba(255,255,255,0.1)" style={{ marginBottom: 20 }} />
              <h3 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>No certificates found</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)' }}>Complete a course to earn your first certification!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
