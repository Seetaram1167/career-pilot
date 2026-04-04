import React from "react";
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react";

const Certificate = ({ userName, courseName, onBack, hideBack = false }) => {
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // For a simple web app, printing to PDF is the most reliable "download"
    window.print();
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Cinzel:wght@600&family=Montserrat:wght@400;700&display=swap');

    .cert-container {
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #f1f5f9;
      min-height: 100vh;
    }

    .cert-card {
      width: 1000px;
      height: 700px;
      background: #fff;
      padding: 2px; /* For the double border effect */
      position: relative;
      box-shadow: 0 40px 100px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 8px double #d4af37; /* Gold double border */
      background: white;
      margin-bottom: 40px;
    }

    .cert-inner-border {
      position: absolute;
      top: 15px; left: 15px; right: 15px; bottom: 15px;
      border: 1px solid #d4af37;
      pointer-events: none;
    }

    .cert-watermark {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 8rem;
      color: rgba(212, 175, 55, 0.03);
      font-weight: 800;
      white-space: nowrap;
      pointer-events: none;
      z-index: 0;
    }

    .cert-header {
      text-align: center;
      margin-bottom: 20px;
      z-index: 1;
    }

    .cert-logo {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 2rem;
      color: #0f172a;
      letter-spacing: -1px;
      margin-bottom: 10px;
    }
    .cert-logo span { color: #3b82f6; }

    .cert-title {
      font-family: 'Cinzel', serif;
      font-size: 3rem;
      color: #0f172a;
      margin: 15px 0;
      letter-spacing: 4px;
    }

    .cert-subtitle {
      font-size: 1.1rem;
      color: #64748b;
      font-style: italic;
      margin-bottom: 8px;
    }

    .cert-recipient {
      font-family: 'Dancing Script', cursive;
      font-size: 4rem;
      color: #1e1b4b;
      margin: 5px 0;
      border-bottom: 2px solid #d4af37;
      padding: 0 40px;
    }

    .cert-course {
      font-size: 1.4rem;
      font-weight: 700;
      color: #475569;
      margin: 15px 0;
      max-width: 800px;
      text-align: center;
    }

    .cert-footer {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      margin-top: 30px;
      padding: 0 60px;
      z-index: 1;
    }

    .cert-signature-box {
      text-align: center;
      min-width: 200px;
    }

    .cert-signature {
      font-family: 'Dancing Script', cursive;
      font-size: 2.2rem;
      color: #0f172a;
      border-bottom: 1px solid #94a3b8;
      margin-bottom: 5px;
      padding: 0 20px;
    }

    .cert-barcode-box {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: -15px; /* Offset for internal layout */
    }

    .cert-barcode {
      width: 120px;
      height: 35px;
      background: repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 5px);
      margin-bottom: 5px;
    }

    .cert-id {
      font-size: 0.65rem;
      font-family: monospace;
      color: #94a3b8;
    }

    .cert-actions {
      display: flex;
      gap: 20px;
    }

    @media print {
      /* Hide everything by default */
      body * {
        visibility: hidden;
      }
      /* Show only the certificate and its children */
      .cert-card, .cert-card * {
        visibility: visible;
      }
      .cert-card {
        position: fixed;
        left: 0;
        top: 0;
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-width: 12px;
        width: 100%;
        height: 100%;
        display: flex !important;
      }
      .cert-actions, .cert-back-btn, header, .chatbot-container, .btn, button {
        display: none !important;
      }
      .cert-container {
        padding: 0;
        margin: 0;
        background: white;
        display: block;
      }
      @page {
        size: landscape;
        margin: 0;
      }
    }
  `;

  return (
    <div className="cert-container">
      <style>{styles}</style>
      {!hideBack && (
        <button className="btn cert-back-btn" style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }} onClick={onBack}>
          <ArrowLeft size={18} /> Back to Course
        </button>
      )}

      <div className="cert-card">
        <div className="cert-inner-border"></div>
        <div className="cert-watermark">CAREERPILOT ACADEMY</div>
        
        <div className="cert-header">
          <div className="cert-logo">CAREER<span>PILOT</span></div>
          <p className="cert-subtitle">PROFESSIONAL ACADEMY CERTIFICATION</p>
        </div>

        <h1 className="cert-title">CERTIFICATE</h1>
        <p className="cert-subtitle" style={{ fontSize: '1rem' }}>THIS IS TO CERTIFY THAT</p>
        
        <div className="cert-recipient">{userName}</div>
        
        <p className="cert-subtitle" style={{ fontSize: '1rem', marginTop: '10px' }}>HAS SUCCESSFULLY COMPLETED THE PROFESSIONAL PROGRAM IN</p>
        <div className="cert-course">{courseName}</div>
        
        <p className="cert-subtitle" style={{ fontSize: '0.9rem' }}>A Comprehensive 32+ Module Roadmap to Professional Mastery</p>

        <div className="cert-footer">
          <div className="cert-signature-box">
             <div className="cert-signature">R. Sharma</div>
             <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>DEAN OF ACADEMY</div>
          </div>

          <div className="cert-barcode-box">
             <div className="cert-barcode"></div>
             <div className="cert-id">VERIFY: CP-CERT-2026-{Math.floor(Math.random() * 900000 + 100000)}</div>
          </div>

          <div className="cert-signature-box">
             <div className="cert-signature" style={{ transform: 'rotate(-2deg)' }}>CareerPilot</div>
             <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>OFFICIAL ACADEMY SEAL</div>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', width: '100%', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8', zIndex: 1 }}>
          <div style={{ marginBottom: '4px', fontWeight: 700, color: '#64748b' }}>Dated: {dateStr}</div>
          <div style={{ fontSize: '0.75rem' }}>Valid Lifetime • Digitally Signed & Encrypted • CareerPilot Academy</div>
        </div>
      </div>

      <div className="cert-actions">
        <button className="btn btn-primary" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={handlePrint}>
          <Printer size={20} /> PRINT CERTIFICATE
        </button>
        <button className="btn" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={handleDownload}>
          <Download size={20} /> DOWNLOAD PDF
        </button>
        <button className="btn" style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Share2 size={20} /> SHARE ON LINKEDIN
        </button>
      </div>
    </div>
  );
};

export default Certificate;
