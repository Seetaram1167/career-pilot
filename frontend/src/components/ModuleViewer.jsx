import React from "react";
import { X, Play, FileText, CheckCircle2, Circle, ArrowLeft, ArrowRight, Video } from "lucide-react";

const ModuleViewer = ({ module, isOpen, onClose, onToggleComplete, isCompleted, hasNext, onNext }) => {
  if (!isOpen || !module) return null;

  const viewerStyles = `
    .viewer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(8, 20, 48, 0.85);
      backdrop-filter: blur(12px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3000;
      animation: fadeIn 0.4s ease;
    }
    .viewer-content {
      background: var(--white);
      color: var(--text-primary);
      width: 95%;
      max-width: 1000px;
      height: 90vh;
      border-radius: 32px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border-color);
    }
    .viewer-header {
      padding: 24px 32px;
      background: var(--white);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .viewer-header h2 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--deep-navy);
    }
    .viewer-body {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 32px;
    }
    .video-section {
      background: #000;
      border-radius: 20px;
      overflow: hidden;
      aspect-ratio: 16/9;
      min-height: 300px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
    }
    .left-column {
      display: flex;
      flex-direction: column;
    }
    .content-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow-y: auto;
      padding-right: 8px;
    }
    .content-card {
      background: white;
      padding: 24px;
      border-radius: 20px;
      border: 1px solid #f1f5f9;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    }
    .content-card h3 {
      margin: 0 0 12px 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .content-card p {
      margin: 0;
      color: #64748b;
      line-height: 1.7;
      font-size: 0.95rem;
      white-space: pre-wrap;
    }
    .resource-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .resource-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: #f8fafc;
      border-radius: 10px;
      font-size: 0.85rem;
      color: #4f46e5;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .resource-item:hover {
      background: #eef2ff;
      transform: translateX(4px);
    }
    .viewer-footer {
      padding: 24px 32px;
      background: #f8fafc;
      border-top: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .complete-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: 16px;
      border: none;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s;
      background: ${isCompleted ? '#10b981' : '#4f46e5'};
      color: white;
      box-shadow: 0 8px 20px ${isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(79, 70, 229, 0.2)'};
    }
    .next-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: 16px;
      border: 1px solid #4f46e5;
      background: white;
      color: #4f46e5;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s;
    }
    .next-btn:hover {
      background: #f5f3ff;
      transform: translateX(4px);
    }
    .complete-btn:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @media (max-width: 900px) {
      .viewer-body {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <style>{viewerStyles}</style>
      <div className="viewer-content" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <h2>{module.title}</h2>
          <button 
            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer' }} 
            onClick={onClose}
          >
            <X size={20} color="#64748b" />
          </button>
        </div>

        <div className="viewer-body">
          <div className="left-column">
            <div className="video-section" style={{ position: 'relative', background: '#000' }}>
              {!module.videoUrl ? (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: '12px' }}>
                  <Video size={48} />
                  <p>Video not available for this module</p>
                </div>
              ) : (
                <>
                  <iframe
                    width="100%"
                    height="100%"
                    src={module.videoUrl}
                    title="Module Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 10 }}>
                    <a 
                      href={module.videoUrl.replace('embed/', 'watch?v=')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn"
                      style={{ fontSize: '0.7rem', padding: '6px 12px', background: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      Watch on YouTube
                    </a>
                  </div>
                </>
              )}
            </div>

            <div className="content-card">
              <h3><FileText size={18} color="#4f46e5" /> Learning Resources</h3>
              <ul className="resource-list">
                {module.resources && module.resources.map((res, i) => (
                  <a 
                    key={i} 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="resource-item"
                    style={{ textDecoration: 'none' }}
                  >
                    <FileText size={14} /> {res.title}
                  </a>
                ))}
              </ul>
            </div>
          </div>

          <div className="content-section">
            <div className="content-card">
              <h3><Play size={18} color="#4f46e5" /> Module Overview</h3>
              <p>{module.description}</p>
            </div>
          </div>
        </div>

        <div className="viewer-footer">
          <div>
            {isCompleted && hasNext && (
              <button className="next-btn" onClick={onNext}>
                NEXT MODULE <ArrowRight size={20} />
              </button>
            )}
          </div>
          <button className="complete-btn" onClick={() => onToggleComplete(module.title)}>
            {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            {isCompleted ? "COMPLETED" : "MARK AS FINISHED"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModuleViewer;
