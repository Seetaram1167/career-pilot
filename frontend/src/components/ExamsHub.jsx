import { useState } from "react";
import {
  Search,
  Calendar as CalendarIcon,
  ExternalLink,
  X,
  BookOpen,
  IndianRupee,
  ClipboardList,
  GraduationCap,
  ArrowRight
} from "lucide-react";

const CATEGORY_BACKGROUNDS = {
  "Engineering Entrance": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000",
  "Medical & Health": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000",
  "Architecture": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000",
  "Management": "https://images.unsplash.com/photo-1507679799987-c71171d79895?auto=format&fit=crop&q=80&w=1000",
  "Law": "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=1000",
  "Civil Services": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=1000",
  "Design": "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000",
  "Banking & Finance": "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=1000",
};

const CATEGORY_FALLBACK_COLORS = {
  "Engineering Entrance": "#1e3a8a",
  "Medical & Health": "#065f46",
  "Architecture": "#78350f",
  "Management": "#1e293b",
  "Law": "#451a03",
  "Civil Services": "#334155",
  "Design": "#701a75",
  "Banking & Finance": "#1e40af",
};

const EXAMS = [
  {
    id: 1,
    category: "Engineering Entrance",
    name: "JEE Main 2026",
    date: "April 15, 2026",
    status: "Upcoming",
    color: "#06B6D4",
    officialUrl: "https://jeemain.nta.ac.in/",
    eligibility: "10+2 with Physics, Chemistry & Mathematics. Min 75% aggregate.",
    syllabus: "Physics, Chemistry, Mathematics (Class 11 & 12 NCERT)",
    applicationFee: "₹1,000 (General) / ₹500 (Reserved)",
    mode: "Computer Based Test (CBT)",
    duration: "3 hours",
    totalMarks: "300",
    conductedBy: "National Testing Agency (NTA)",
  },
  {
    id: 2,
    category: "Medical & Health",
    name: "NEET UG 2026",
    date: "May 3, 2026",
    status: "Registration Open",
    color: "#10B981",
    officialUrl: "https://neet.nta.nic.in/",
    eligibility: "10+2 with Biology, Physics & Chemistry. Min 50% aggregate.",
    syllabus: "Biology, Physics, Chemistry (Class 11 & 12)",
    applicationFee: "₹1,700 (General) / ₹1,000 (Reserved)",
    mode: "Pen & Paper (OMR Based)",
    duration: "3 hours 20 minutes",
    totalMarks: "720",
    conductedBy: "National Testing Agency (NTA)",
  },
  {
    id: 3,
    category: "Architecture",
    name: "NATA 2026",
    date: "June 10, 2026",
    status: "To Be Announced",
    color: "#F59E0B",
    officialUrl: "https://www.nata.in/",
    eligibility: "10+2 with Mathematics. Min 50% aggregate.",
    syllabus: "Drawing, Aesthetic Sensitivity, Mathematical Reasoning, General Aptitude",
    applicationFee: "₹2,000 (General) / ₹1,500 (Reserved)",
    mode: "Computer Based Test + Drawing",
    duration: "3 hours",
    totalMarks: "200",
    conductedBy: "Council of Architecture (COA)",
  },
  {
    id: 4,
    category: "Management",
    name: "IPMAT 2026",
    date: "May 25, 2026",
    status: "Upcoming",
    color: "#8B5CF6",
    officialUrl: "https://www.iimindore.ac.in/ipmat.html",
    eligibility: "10+2 with minimum 60% marks. Age limit: 20 years.",
    syllabus: "Quantitative Ability, Verbal Ability, Logical Reasoning",
    applicationFee: "₹4,130 (General) / ₹2,065 (Reserved)",
    mode: "Computer Based Test (CBT)",
    duration: "2 hours",
    totalMarks: "240",
    conductedBy: "IIM Indore",
  },
  {
    id: 5,
    category: "Law",
    name: "CLAT 2026",
    date: "December 1, 2026",
    status: "To Be Announced",
    color: "#EF4444",
    officialUrl: "https://consortiumofnlus.ac.in/",
    eligibility: "10+2 with minimum 45% marks. No age limit.",
    syllabus: "English, Current Affairs & GK, Legal Reasoning, Logical Reasoning, Quantitative Techniques",
    applicationFee: "₹4,000 (General) / ₹3,500 (Reserved)",
    mode: "Pen & Paper (OMR Based)",
    duration: "2 hours",
    totalMarks: "120",
    conductedBy: "Consortium of National Law Universities",
  },
  {
    id: 6,
    category: "Civil Services",
    name: "UPSC CSE 2026",
    date: "May–June 2026 (Prelims)",
    status: "Upcoming",
    color: "#7C3AED",
    officialUrl: "https://upsc.gov.in/",
    eligibility: "Graduate in any discipline. Age: 21–32 years (General).",
    syllabus: "General Studies, CSAT (Prelims); GS Papers I–IV + Optional (Mains)",
    applicationFee: "₹100 (General) / Exempted (Reserved)",
    mode: "Offline (Pen & Paper)",
    duration: "2 hours per paper",
    totalMarks: "2025 (Mains)",
    conductedBy: "Union Public Service Commission (UPSC)",
  },
  {
    id: 7,
    category: "Design",
    name: "NID DAT 2026",
    date: "January 2027 (Prelims)",
    status: "To Be Announced",
    color: "#EC4899",
    officialUrl: "https://admissions.nid.edu/",
    eligibility: "10+2 in any stream. Creative aptitude required.",
    syllabus: "Creative Ability Test, Situation Test, Design Aptitude, Studio Test",
    applicationFee: "₹3,000 (General) / ₹1,500 (Reserved)",
    mode: "Written + Studio Test",
    duration: "3 hours",
    totalMarks: "Varies",
    conductedBy: "National Institute of Design (NID)",
  },
  {
    id: 8,
    category: "Banking & Finance",
    name: "IBPS PO 2026",
    date: "October 2026 (Prelims)",
    status: "To Be Announced",
    color: "#3B82F6",
    officialUrl: "https://www.ibps.in/",
    eligibility: "Graduate in any discipline. Age: 20–30 years.",
    syllabus: "Reasoning, Quantitative Aptitude, English Language, Computer Knowledge, General Awareness",
    applicationFee: "₹850 (General) / ₹175 (Reserved)",
    mode: "Computer Based Test (CBT)",
    duration: "1 hour (Prelims) / 3 hours (Mains)",
    totalMarks: "100 (Prelims) / 200 (Mains)",
    conductedBy: "Institute of Banking Personnel Selection (IBPS)",
  },
  {
    id: 9,
    category: "Engineering Entrance",
    name: "EAMCET 2026",
    date: "May 2026",
    status: "Upcoming",
    color: "#06B6D4",
    officialUrl: "https://eapcet-ts.che.ac.in/",
    eligibility: "10+2 with Physics, Mathematics, and Chemistry as optional subjects.",
    syllabus: "Mathematics, Physics, Chemistry (Intermediate 1st & 2nd Year)",
    applicationFee: "₹600 (General) / ₹400 (Reserved)",
    mode: "Computer Based Test (CBT)",
    duration: "3 hours",
    totalMarks: "160",
    conductedBy: "JNTU on behalf of TSCHE/APSCHE",
  },
  {
    id: 10,
    category: "Management",
    name: "ICET 2026",
    date: "June 2026",
    status: "To Be Announced",
    color: "#8B5CF6",
    officialUrl: "https://icet.tsche.ac.in/",
    eligibility: "Bachelor's Degree with at least 50% marks (45% for reserved).",
    syllabus: "Analytical Ability, Mathematical Ability, Communication Ability",
    applicationFee: "₹750 (General) / ₹550 (Reserved)",
    mode: "Computer Based Test (CBT)",
    duration: "150 minutes",
    totalMarks: "200",
    conductedBy: "State Council of Higher Education",
  },
  {
    id: 11,
    category: "Engineering Entrance",
    name: "POLYCET 2026",
    date: "April 2026",
    status: "Upcoming",
    color: "#F59E0B",
    officialUrl: "https://polycet.tsche.ac.in/",
    eligibility: "SSC (10th Class) passed or appearing from a recognized board.",
    syllabus: "Mathematics, Physics, Chemistry (Secondary School Level)",
    applicationFee: "₹500 (General) / ₹250 (Reserved)",
    mode: "Offline (OMR Based)",
    duration: "2 hours",
    totalMarks: "120",
    conductedBy: "State Board of Technical Education and Training",
  },
];

const ExamsHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);

  const filteredExams = EXAMS.filter(
    (exam) =>
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const examsStyles = `
    .exams-container {
      padding: var(--spacing-xl) 0;
    }
    .exams-heroSection {
      text-align: center;
      margin-bottom: var(--spacing-3xl);
      padding: var(--spacing-3xl) var(--spacing-lg);
      background: linear-gradient(135deg, rgba(8, 20, 48, 0.95) 0%, rgba(16, 24, 64, 0.9) 100%), 
                  url('https://images.unsplash.com/photo-1434031213662-87422e374442?auto=format&fit=crop&q=80&w=2070');
      background-size: cover;
      background-position: center;
      color: #FFFFFF;
      border-radius: var(--radius-2xl);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }
    .exams-heroSection h1 {
      color: #FFFFFF !important;
      margin-bottom: var(--spacing-md);
      font-size: 3rem;
      font-weight: 800;
      letter-spacing: -1.5px;
    }
    .exams-searchBar {
      max-width: 600px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
    .exams-searchIcon {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255,255,255,0.7);
    }
    .exams-searchBar input {
      width: 100%;
      padding: 18px 18px 18px 56px;
      border-radius: var(--radius-full);
      border: 1px solid rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      color: #FFFFFF;
      font-size: 1.1rem;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .exams-searchBar input:focus {
      background: rgba(255, 255, 255, 0.25);
      border-color: #FFFFFF;
      outline: none;
      box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.1);
    }

    .exams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: var(--spacing-2xl);
      margin-top: var(--spacing-xl);
    }

    .exams-glassCard {
      position: relative;
      height: 480px;
      border-radius: var(--radius-2xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      transition: all 0.6s cubic-bezier(0.2, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .exams-glassCard:hover {
      transform: translateY(-15px);
      box-shadow: 0 40px 70px rgba(0, 10, 30, 0.4);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .exams-cardBg {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
      transition: transform 1.2s ease;
      z-index: 1;
    }
    .exams-glassCard:hover .exams-cardBg {
      transform: scale(1.1);
    }

    .exams-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to bottom, 
                  rgba(8, 20, 48, 0.2) 0%, 
                  rgba(8, 20, 48, 0.5) 40%, 
                  rgba(8, 20, 48, 0.95) 100%);
      z-index: 2;
      transition: all 0.6s ease;
    }

    .exams-cardContent {
      position: relative;
      z-index: 3;
      padding: var(--spacing-2xl);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: #FFFFFF;
    }

    .exams-categoryTag {
      position: absolute;
      top: 24px;
      left: 24px;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(12px);
      padding: 6px 16px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
    }

    .exams-glassCard h2 {
      font-size: 2.25rem;
      font-weight: 800;
      margin-bottom: 12px;
      color: #FFFFFF !important;
      letter-spacing: -0.5px;
      text-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }

    .exams-cardInfo {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      margin-bottom: 24px;
      font-weight: 600;
    }

    .exams-cardFooter {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      /* Buttons always visible for clarity as requested */
      opacity: 1;
      transform: translateY(0);
      transition: all 0.4s ease;
    }

    .exams-btn-glass {
      padding: 14px;
      border-radius: 12px;
      font-weight: 800;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      font-size: 0.95rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .exams-btn-details {
      background: rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
      border: 1px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(8px);
    }
    .exams-btn-details:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
    }
    .exams-btn-site {
      background: #FFFFFF;
      color: #081430; /* Deep navy for contrast on white */
      border: 1px solid #FFFFFF;
    }
    .exams-btn-site:hover {
      background: var(--vibrant-blue);
      color: #FFFFFF;
      border-color: var(--vibrant-blue);
      transform: scale(1.05);
    }

    /* Modal Styling */
    .exams-modalBackdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(2, 6, 23, 0.9);
      backdrop-filter: blur(15px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 24px;
    }
    .exams-modal {
      background: var(--white);
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
    }
    .exams-modalHeader {
      height: 240px;
      position: relative;
      display: flex;
      align-items: flex-end;
      padding: 40px;
    }
    .exams-modalHeaderBg {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background-size: cover;
      background-position: center;
    }
    .exams-modalHeaderOverlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(transparent, var(--white));
    }
    .exams-modalHeader h2 {
      position: relative;
      z-index: 2;
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--deep-navy) !important;
      margin: 0;
    }
  `;

  return (
    <>
      <style>{examsStyles}</style>
      <div className="page-container exams-container">
        <div className="exams-heroSection">
          <h1>Competitive Entrance Registry</h1>
          <p>
            The most comprehensive database for top-tier competitive exams. 
            Detailed schedules, eligibility, and direct official access.
          </p>

          <div className="exams-searchBar">
            <Search className="exams-searchIcon" size={24} />
            <input
              type="text"
              placeholder="Search by exam name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredExams.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", color: "var(--text-secondary)" }}>
             <Search size={48} style={{ opacity: 0.2, marginBottom: "20px" }} />
             <h3>No exams match your search criteria.</h3>
          </div>
        ) : (
          <div className="exams-grid">
            {filteredExams.map((exam) => (
              <div 
                key={exam.id} 
                className="exams-glassCard"
              >
                <div 
                  className="exams-cardBg" 
                  style={{ 
                    background: `${CATEGORY_FALLBACK_COLORS[exam.category] || '#081430'} linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.3) 100%)`,
                    backgroundImage: `url(${CATEGORY_BACKGROUNDS[exam.category]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="exams-overlay" />
                
                <div className="exams-cardContent" onClick={() => setSelectedExam(exam)} style={{ cursor: 'pointer' }}>
                  <div className="exams-categoryTag">{exam.category}</div>
                  <h2>{exam.name}</h2>
                  
                  <div className="exams-cardInfo">
                    <CalendarIcon size={18} />
                    <span>{exam.date}</span>
                    <span style={{ marginLeft: 'auto', color: exam.color, fontSize: '0.85rem', fontWeight: 800 }}>
                      {exam.status}
                    </span>
                  </div>

                <div className="exams-cardFooter" style={{ position: 'relative', zIndex: 10, padding: '0 24px 24px' }}>
                    <button className="exams-btn-glass exams-btn-details" onClick={() => setSelectedExam(exam)}>
                      <ClipboardList size={16} /> Details
                    </button>
                    <a href={exam.officialUrl} target="_blank" rel="noopener noreferrer" className="exams-btn-glass exams-btn-site">
                      Site <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Exam Details Modal ── */}
      {selectedExam && (
        <div className="exams-modalBackdrop" onClick={() => setSelectedExam(null)}>
          <div className="exams-modal" onClick={(e) => e.stopPropagation()}>
            <div className="exams-modalHeader">
              <div 
                className="exams-modalHeaderBg" 
                style={{ backgroundImage: `url(${CATEGORY_BACKGROUNDS[selectedExam.category]})` }}
              />
              <div className="exams-modalHeaderOverlay" />
              <button className="exams-modalClose" onClick={() => setSelectedExam(null)} style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10, background: 'rgba(0,0,0,0.4)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              <h2>{selectedExam.name}</h2>
            </div>

            <div className="exams-modalBody" style={{ padding: '40px', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <div style={{ background: 'var(--soft-grey)', padding: '24px', borderRadius: '24px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px' }}>DATE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--deep-navy)' }}>{selectedExam.date}</div>
                </div>
                <div style={{ background: 'var(--soft-grey)', padding: '24px', borderRadius: '24px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px' }}>APPLICATION FEE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--deep-navy)' }}>{selectedExam.applicationFee}</div>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>ELIGIBILITY</h4>
                <p style={{ fontSize: '1.1rem', color: 'var(--deep-navy)', fontWeight: 600 }}>{selectedExam.eligibility}</p>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>SYLLABUS</h4>
                <p style={{ lineHeight: '1.7', color: 'var(--text-primary)' }}>{selectedExam.syllabus}</p>
              </div>
            </div>

            <div className="exams-modalFooter" style={{ padding: '32px 40px', display: 'flex', gap: '16px', background: 'var(--soft-grey)' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedExam(null)}>
                Close
              </button>
              <a href={selectedExam.officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1 }}>
                Official Website <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamsHub;
